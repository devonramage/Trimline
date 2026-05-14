# Trimline Safe Nav v2

This is a safer nav-label-only update.

Changes:
- Does not touch auth/login/signup
- Settings label becomes Profile
- Barber mode labels:
  - Home
  - Clients
  - Schedule
  - Profile
- Client mode labels:
  - Discover
  - Saved
  - Appointments
  - Profile
- Adds a Profile Menu button inside Account Settings
- Adds version marker: TRIMLINE_SAFE_NAV_V2

After deploying:
- Wait for Vercel to finish
- Hard refresh the site
- If nothing changes, GitHub/Vercel did not deploy the new index.html
