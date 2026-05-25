Use this as a detailed master prompt for [OpenAI Codex](https://openai.com/codex/?utm_source=chatgpt.com) or any AI coding agent to generate your MVP School Management System.

---

# School Management System MVP – Full Stack AI Development Prompt

Build a modern, scalable, production-ready MVP School Management System (SMS) web application using React.js, Firebase, and Google Firestore.

The system must support both:

* Day Scholar students
* Residential / Hostel students

The application should support end-to-end school digitization with role-based workflows and modular architecture.

---

## Tech Stack

### Frontend

* React.js (latest stable version)
* React Router
* Material UI (MUI)
* React Hook Form
* Axios
* Zustand or Redux Toolkit for state management
* Recharts for analytics dashboard
* Framer Motion for animations

### Backend / Cloud

* Firebase Hosting
* Firebase Authentication
* Google Firestore Database
* Firebase Cloud Functions
* Firebase Storage
* Firebase Security Rules

### Deployment

* Google Firebase Hosting
* Environment-based configuration

---

# Project Requirements

Create a scalable MVP architecture with:

* Clean folder structure
* Reusable components
* Modular feature-based architecture
* Mobile responsive UI
* Role-based access control
* Firestore optimized schema
* Proper loading/error handling
* Reusable tables/forms/dialogs

---

# Roles & Permissions

Implement authentication and role-based dashboards for:

1. Super Admin
2. School Admin
3. Principal
4. Teacher
5. Accountant
6. Hostel Warden
7. Student
8. Parent

Each role must:

* Have separate dashboard
* Have limited permissions
* See only authorized modules

Use Firebase Authentication + Firestore role mapping.

---

# Core MVP Modules

---

## 1. Authentication Module

Features:

* Login
* Logout
* Forgot Password
* Role-based redirects
* Firebase Authentication
* Session persistence

Support:

* Email/password login
* Optional phone authentication

---

## 2. Dashboard Module

Create beautiful dashboard with:

* Student count
* Attendance statistics
* Pending fees
* Upcoming exams
* Hostel occupancy
* Notifications
* Recent activities

Charts:

* Attendance trends
* Fee collection trends
* Exam performance

---

## 3. Student Management Module

Features:

* Student admission form
* Student profile
* Student search
* Student edit/update
* Class/section allocation
* Parent information
* Upload documents
* Profile photo upload

Support:

* Day scholar
* Residential student

Residential student fields:

* Hostel
* Room number
* Bed number
* Warden allocation

Firestore collections:

* students
* guardians
* hostel_allocations

---

## 4. Admission Management

Features:

* Online admission application
* Admission approval workflow
* Admission status tracking
* Document upload
* Application fee tracking

Statuses:

* Pending
* Approved
* Rejected
* Waiting List

---

## 5. Attendance Management

Features:

* Daily attendance
* Class-wise attendance
* Teacher attendance entry
* Student attendance reports
* Monthly attendance analytics

Support:

* Day scholar attendance
* Hostel attendance

---

## 6. Academic Module

Features:

* Classes
* Sections
* Subjects
* Timetable
* Teacher assignment

Collections:

* classes
* sections
* subjects
* timetable

---

## 7. Examination Module

Features:

* Exam creation
* Subject marks entry
* Grade calculation
* Result generation
* Report card PDF generation

Exam types:

* Unit Test
* Half Yearly
* Final Exam

Include:

* GPA calculation
* Ranking
* Result analytics

---

## 8. Fees & Payment Module

Features:

* Fee structure setup
* Student fee assignment
* Payment entry
* Due tracking
* Receipt generation
* Payment history

Support:

* Tuition fees
* Hostel fees
* Transport fees
* Admission fees

Optional:

* Razorpay integration placeholder

---

## 9. Hostel Management Module

Features:

* Hostel creation
* Room management
* Bed allocation
* Occupancy tracking
* Hostel attendance
* Warden management

Collections:

* hostels
* rooms
* hostel_students

---

## 10. Notification Module

Features:

* Send notices
* SMS/email integration placeholder
* Parent notifications
* Exam notifications
* Fee reminders

---

## 11. Parent Portal

Features:

* Child attendance
* Fees
* Exam results
* Notifications
* Homework

---

## 12. Student Portal

Features:

* Attendance
* Results
* Fee history
* Timetable
* Notices

---

# Firestore Database Design

Design optimized Firestore schema with:

* Proper indexing
* Collection naming standards
* Nested subcollections only where necessary
* Query optimization

Include:

* ER-style relationship explanation
* Security rules
* Scalability consideration

---

# Firebase Security Rules

Implement secure rules:

* Role-based access
* Students only see own data
* Parents only see linked child data
* Teachers access assigned classes only

---

# UI/UX Requirements

Design style:

* Modern school ERP dashboard
* Minimal clean UI
* Material UI based
* Dark/light theme support
* Mobile responsive

Pages:

* Sidebar navigation
* Top navbar
* Breadcrumbs
* Reusable data tables
* Filters/search

---

# Required Features

Implement:

* Pagination
* Search
* Filtering
* Form validation
* Toast notifications
* File uploads
* Loading skeletons
* Error boundaries

---

# Architecture Requirements

Use:

* Feature-based folder structure
* Custom hooks
* API service layer
* Context or Redux state
* Route guards
* Reusable form components

---

# Firebase Functions

Create Firebase Cloud Functions for:

* Fee receipt generation
* Notifications
* Role assignment
* Result calculation
* Scheduled reminders

---

# Deliverables

Generate:

1. Complete folder structure
2. Firestore schema
3. Firebase rules
4. Authentication setup
5. Reusable UI components
6. Full React pages
7. Cloud functions
8. Deployment guide
9. Environment variable setup
10. README documentation

---

# Bonus MVP Features

If possible include:

* QR attendance support
* ID card generation
* Hostel meal tracking
* Transport tracking
* Homework module
* Library management

---

# Coding Standards

Requirements:

* Use functional React components
* Use hooks only
* Avoid unnecessary re-renders
* Use async/await
* Use TypeScript if possible
* Write clean documented code

---

# Expected Output

Generate:

* Production-ready MVP source code
* Firebase configuration
* Firestore schema
* Fully responsive frontend
* Deployment instructions
* Example seed data
* Authentication flow
* Role management implementation

The generated project should be modular, scalable, and easy to extend into a complete enterprise-level School ERP in the future.
