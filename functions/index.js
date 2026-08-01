"use strict";

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { defineSecret } = require("firebase-functions/params");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

initializeApp();

const db = getFirestore();
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL = "Trimline <onboarding@resend.dev>";
const DEV_APP_URL = "https://trimline-git-dev-devon-ramage-s-projects.vercel.app/";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function friendlyTime(time = "") {
  if (!time) return "Time not provided";
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

async function claimEmailEvent(eventId, kind) {
  const ref = db.collection("emailEvents").doc(eventId);
  return db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists) return false;
    transaction.create(ref, {
      kind,
      status: "processing",
      createdAt: new Date()
    });
    return true;
  });
}

async function completeEmailEvent(eventId, status, details = {}) {
  await db.collection("emailEvents").doc(eventId).set({
    status,
    ...details,
    updatedAt: new Date()
  }, { merge: true });
}

async function sendEmail({ to, subject, html }) {
  if (!to) throw new Error("No recipient email address was available.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY.value()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html
    })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${JSON.stringify(result)}`);
  }
  return result;
}

async function getUserEmail(userId) {
  if (!userId) return "";
  const snapshot = await db.collection("users").doc(userId).get();
  return snapshot.exists ? (snapshot.data().email || "") : "";
}

exports.notifyBarberOfBookingRequest = onDocumentCreated({
  document: "bookingRequests/{requestId}",
  region: "us-central1",
  secrets: [RESEND_API_KEY]
}, async event => {
  const request = event.data && event.data.data();
  if (!request) return;

  const eventId = `booking-request-${event.id}`;
  if (!(await claimEmailEvent(eventId, "booking-request"))) return;

  try {
    const barberEmail = await getUserEmail(request.barberId);
    const clientName = escapeHtml(request.clientName || "A client");
    const barberName = escapeHtml(request.barberName || "Barber");
    const service = escapeHtml(request.service || "Appointment");
    const date = escapeHtml(request.date || "Date not provided");
    const time = escapeHtml(friendlyTime(request.time));
    const phone = escapeHtml(request.phone || "Not provided");
    const notes = escapeHtml(request.notes || "None");

    const result = await sendEmail({
      to: barberEmail,
      subject: `New Trimline booking request from ${request.clientName || "a client"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111">
          <h1 style="font-size:24px">New booking request</h1>
          <p>Hi ${barberName}, ${clientName} requested an appointment.</p>
          <p><strong>Service:</strong> ${service}<br>
          <strong>Date:</strong> ${date}<br>
          <strong>Time:</strong> ${time}<br>
          <strong>Phone:</strong> ${phone}<br>
          <strong>Notes:</strong> ${notes}</p>
          <p><a href="${DEV_APP_URL}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Open Trimline Dev</a></p>
        </div>`
    });

    await completeEmailEvent(eventId, "sent", { resendId: result.id || "" });
  } catch (error) {
    logger.error("Booking request email failed", { eventId, error: error.message });
    await completeEmailEvent(eventId, "failed", { error: error.message });
  }
});

exports.notifyClientOfBookingStatus = onDocumentUpdated({
  document: "bookingRequests/{requestId}",
  region: "us-central1",
  secrets: [RESEND_API_KEY]
}, async event => {
  const before = event.data && event.data.before.data();
  const after = event.data && event.data.after.data();
  if (!before || !after || before.status === after.status) return;

  const supportedStatuses = new Set(["accepted", "declined", "cancelled"]);
  if (!supportedStatuses.has(after.status)) return;

  const eventId = `booking-status-${after.status}-${event.id}`;
  if (!(await claimEmailEvent(eventId, `booking-${after.status}`))) return;

  try {
    const clientEmail = after.email || await getUserEmail(after.clientUserId);
    const clientName = escapeHtml(after.clientName || "Client");
    const barberName = escapeHtml(after.barberName || after.barberUsername || "your barber");
    const service = escapeHtml(after.service || "Appointment");
    const date = escapeHtml(after.date || "Date not provided");
    const time = escapeHtml(friendlyTime(after.time));

    const copy = {
      accepted: {
        subject: "Your Trimline booking was accepted",
        heading: "Booking accepted",
        message: `Your appointment with ${barberName} is confirmed.`
      },
      declined: {
        subject: "Update on your Trimline booking request",
        heading: "Booking request declined",
        message: `${barberName} could not accept this requested time. Open Trimline to request another appointment.`
      },
      cancelled: {
        subject: "Your Trimline appointment was cancelled",
        heading: "Appointment cancelled",
        message: `Your appointment with ${barberName} has been cancelled.`
      }
    }[after.status];

    const result = await sendEmail({
      to: clientEmail,
      subject: copy.subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111">
          <h1 style="font-size:24px">${copy.heading}</h1>
          <p>Hi ${clientName}, ${copy.message}</p>
          <p><strong>Service:</strong> ${service}<br>
          <strong>Date:</strong> ${date}<br>
          <strong>Time:</strong> ${time}</p>
          <p><a href="${DEV_APP_URL}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Open Trimline Dev</a></p>
        </div>`
    });

    await completeEmailEvent(eventId, "sent", { resendId: result.id || "" });
  } catch (error) {
    logger.error("Booking status email failed", { eventId, status: after.status, error: error.message });
    await completeEmailEvent(eventId, "failed", { error: error.message });
  }
});
