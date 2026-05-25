# Admission Management Module

## Included
- Admission dashboard metrics and operational tabs.
- Public-facing admission form scaffold with RHF validation.
- Application listing with filters and workflow actions (approve/reject/waiting).
- Enquiry and fee management placeholders for integration.
- Zustand state, schema validation utility, and seed data.
- Firestore transaction service stubs for approval workflow.

## Firestore schema
- `admissionApplications`
- `admissionEnquiries`
- `admissionReviews`
- `admissionDocuments`
- `admissionFees`
- `students`
- `parents`
- `notifications`

## Storage paths
- `/admission-documents/{applicationId}/`
- `/student-photos/{applicationId}/`

## Setup notes
1. Connect Firebase app config in shared app-level firebase client.
2. Replace `admissionService.ts` TODOs with Firestore modular SDK queries.
3. Add Storage upload pipeline (with image compression pre-upload).
4. Add pagination with query cursors for production scale.
5. Wire role claims for admin-only workflow transitions.
