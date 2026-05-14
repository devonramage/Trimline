# Barber Connect Cancel Confirm v1

Fix:
- Every appointment Cancel button now opens a custom confirmation modal first
- Every booking request Decline button now opens a custom confirmation modal first
- Cancel only happens after tapping "Yes, Cancel"
- Decline only happens after tapping "Yes, Decline"
- Cancelling still attempts to sync the linked client booking request to cancelled

Test:
1. Barber accepts a client request
2. Barber goes to Schedule
3. Tap Cancel
4. You should see a modal with Keep Appointment / Yes, Cancel
5. Tap Yes, Cancel
6. Appointment disappears
7. Client request should show cancelled if linked
