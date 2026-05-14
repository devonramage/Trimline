# Barber Connect Cancel Sync v1

Fix:
- Barber cancel now updates the appointment status to cancelled
- If the appointment came from a booking request, the original booking request is also marked cancelled
- Client side status updates from accepted to cancelled
- Barber schedule removes the cancelled appointment immediately

No Firebase rules change needed if appointment/request updates already work.
