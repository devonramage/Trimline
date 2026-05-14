# Barber Connect Cancel Appointments v2

Fix:
- Cancel now updates the appointment status to "cancelled"
- Cancelled appointments are hidden from the barber schedule
- The appointment disappears immediately after confirming cancellation
- Safer than hard-deleting because the database still keeps a cancellation record

No Firebase rule changes needed if appointment updates already work.
