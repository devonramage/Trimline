# Trimline Business Hours Save v0.4

Added:
- Save Hours button
- Business hours save to Firebase under barbers/{uid}.businessHours
- Saved hours reload when reopening the modal
- Basic validation: end time must be after start time

Not added yet:
- Client booking form does not use these hours yet
- Availability slots are not filtered yet

Test:
1. Login works
2. Profile opens
3. Edit Hours opens
4. Change a day/time
5. Save Hours
6. Reopen modal and confirm the changes stayed
