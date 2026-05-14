# Barber Connect Cancel Confirm v2

Fix:
- Patched the real instant-cancel path.
- Any old markAppointment(id, "cancelled") call now opens the confirm modal instead.
- Cancel button should no longer instantly remove the appointment.
- "Yes, Cancel" marks the appointment cancelled and tries to sync the linked booking request.

Important:
- Existing accepted appointments created before the requestId/appointmentId fix may not always sync to client status.
- New accepted appointments after this version should sync better.

Test with a fresh request:
1. Client sends new booking request
2. Barber accepts it
3. Barber cancels it from Schedule
4. Confirm modal should appear
5. Tap Yes, Cancel
6. Client status should update to cancelled after refresh
