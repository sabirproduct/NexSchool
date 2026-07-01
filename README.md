# NexSchool ERP MVP

A production-style MVP scaffold for a School Management System with React + Firebase.

## Features Included
- Feature-based modular React architecture
- Role-aware route protection scaffolding
- Core module pages (dashboard, students, admissions, attendance, academics, exams, fees, hostel, notifications, parent/student portals)
- Firebase configuration placeholders
- Firestore security rules and index examples
- Cloud Functions placeholders for role assignment, fee receipts, notifications, and result calculation

## Firestore Collections (MVP)
- users
- students
- guardians
- hostel_allocations
- admissions
- attendance
- classes
- sections
- subjects
- timetable
- exams
- results
- fee_structures
- payments
- hostels
- rooms
- notices

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Run app:
   ```bash
   npm run dev
   ```

## Deployment
- Build: `npm run build`
- Deploy hosting + firestore + functions using Firebase CLI.
