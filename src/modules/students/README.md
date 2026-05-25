# Student Management Module (NexSchool ERP)

## Folder Structure
- components/: reusable UI (form, table, filters, cards, profile header, uploader, delete dialog)
- pages/: list, add, edit, details, promotion
- hooks/: debounced search helper
- services/: Firestore-ready service layer (currently mock-backed)
- schemas/: payload validation
- store/: Zustand state management for list/filter/pagination
- types/: domain interfaces
- mocks/: seed data
- utils/: shared validation helpers

## Firestore Collections
- students
- parents
- studentDocuments
- studentPromotions
- classes
- sections
- hostels

## Student Storage Paths
- /student-photos/{studentId}
- /student-documents/{studentId}/

## Notes
- `admissionNo` is intended immutable in edit mode.
- soft delete is implemented via status=inactive.
- promotion history should be persisted in `studentPromotions` collection.
