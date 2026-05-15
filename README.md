# Trimline Business Hours Booking v0.5

Added:
- Client booking time dropdown now uses the selected barber's saved business hours
- Closed days show "Closed this day"
- Open days only show 30-minute slots inside business hours
- Existing pending/accepted times still show unavailable
- Send Request validates business hours again before saving

No Firebase rule changes required.

Test:
1. Barber saves business hours
2. Client selects that barber
3. Client opens Request Booking
4. Pick a closed day — should say closed
5. Pick an open day — only times inside hours should show
6. Pending/booked times should still be unavailable
