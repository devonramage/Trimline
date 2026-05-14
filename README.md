# Barber Connect Request Polish v1

Added:
- Send Request button locks after first tap
- Button changes to "Sending..."
- Duplicate booking request prevention
- Client cannot send multiple pending/accepted requests for same barber/date/time
- Service field changed to dropdown:
  - Haircut
  - Beard trim
  - Haircut + beard trim

No new Firebase rules required if bookingRequests are already working.

Deploy:
- Drag/drop this zip to Netlify
- Test rapid tapping the request button
- Test service dropdown
