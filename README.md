# Trimline Business Hours Booking v0.5 Safe

Small integration update from the stable v0.4 base.

Added:
- Client booking time dropdown uses selected barber's saved business hours
- Closed days show "Closed this day"
- Open days only show 30-minute slots inside barber hours
- Pending/accepted times still show unavailable
- Send Request validates the selected time against barber hours before saving

Not changed:
- Auth/login code
- Navigation
- Profile layout
- Firebase rules

Test:
1. Login works
2. Barber saves hours
3. Client opens Request Booking
4. Closed day shows closed
5. Open day shows only business-hour slots
6. Send Request still works
