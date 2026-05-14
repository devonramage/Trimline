# Barber Connect Cancel Sync v3

Fix:
- Accepting a booking now stores the original requestId on the appointment
- Accepting also stores appointmentId back on the booking request
- Cancelling an accepted appointment now looks up the request three ways:
  1. appointment.requestId
  2. bookingRequest.appointmentId
  3. fallback match by barber/date/time/client/service
- Client request status should update to cancelled after barber cancels an accepted appointment
- Cancel still asks for confirmation first

Test:
1. Client sends request
2. Barber accepts request
3. Client sees accepted
4. Barber cancels appointment from Schedule
5. Confirm popup appears
6. Client sees cancelled after refresh
