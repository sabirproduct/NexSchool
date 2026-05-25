# Attendance Management Module

## Scope
Production-oriented attendance module with student, hostel, teacher/staff attendance, dashboard analytics, reports, and future-ready placeholders (QR/RFID/Biometric/GPS/Offline Sync).

## Firestore Collections
- studentAttendance
- teacherAttendance
- hostelAttendance
- attendanceSummary
- attendanceLogs
- leaveApplications
- attendanceSettings

## Key Capabilities
- Daily class-wise attendance with quick present-all and inline edits
- Multi-tab workflow: student, hostel, teacher/staff, reports, student details, integrations
- Validation for required fields, date correctness, duplicate prevention
- Role-aware security rules in `firestore.rules`
- Cloud Functions placeholders for summary calculation, low-attendance alerts, notification triggers, daily aggregation

## Setup
1. Add Firebase env keys to `.env` (`VITE_FIREBASE_*`).
2. Deploy rules: `firebase deploy --only firestore:rules`.
3. Deploy functions from `/functions`: `npm run deploy` (or your existing CI command).
4. Run web app: `npm run dev`.
