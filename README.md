# Trimline Profile Layout + Pictures v1

Added:
- Instagram-style Profile layout
- Barber and Client profile header
- Profile photo upload
- Photo saved to Firebase Storage
- Photo URL saved to users/{uid}
- Barber photo also saved to barbers/{uid}
- Fallback initials avatar if no photo
- Stats cards for barber/client modes
- Profile Photo button in profile actions and menu

No Firestore rule changes needed.
Storage rules must allow signed-in users to upload files.
