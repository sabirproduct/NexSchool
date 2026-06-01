# NexSchool Codebase - Comprehensive Overview

## Executive Summary
NexSchool is a school management system built with **React + TypeScript + Vite**, using **Zustand** for state management and **Firebase/Firestore** for backend. The application is organized into feature modules with clear separation of concerns: types, schemas, services, stores, and components.

---

## 1. USER ROLES & ACCESS CONTROL

### Role Hierarchy
```
Super Admin     → Full access to all modules
School Admin    → All student-facing modules
Principal       → Dashboard, Students, Attendance, Academics, Exams, Notifications
Teacher         → Dashboard, Attendance, Academics, Exams, Notifications
Accountant      → Dashboard, Fees, Notifications
Hostel Warden   → Dashboard, Hostel, Attendance, Notifications
Student         → Student Portal, Dashboard
Parent          → Parent Portal, Dashboard
```

### User Schema (Firebase Collection: `users`)
```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;
  role: UserRole;
  schoolId: string;              // Multi-tenancy support
  studentIds?: string[];         // For parents (children they can view)
  assignedClassIds?: string[];   // For teachers (classes they teach)
}
```

---

## 2. MODULE STRUCTURE & DATA MODELS

### 2.1 ACADEMICS MODULE
**Purpose**: Manage academic structure, timetables, and teacher assignments

**Key Collections**:

#### academicSessions
```typescript
{
  id: string;
  sessionName: string;           // e.g., "2026-2027"
  academicYear: string;          // YYYY-YYYY format
  startDate: string;             // ISO date
  endDate: string;
  status: 'active' | 'inactive' | 'locked';
}
```

#### classes
```typescript
{
  id: string;
  className: string;             // e.g., "Class 10"
  classLevel: number;            // 10, 11, 12, etc.
  capacity: number;              // Max students: 45-50
  classTeacherId?: string;       // Reference to teacher
  academicSessionId: string;     // Foreign key
  status: 'active' | 'inactive';
}
```

#### sections
```typescript
{
  id: string;
  sectionName: string;           // "A", "B", "C"
  classId: string;               // Foreign key
  capacity: number;              // 40-45
  roomNumber?: string;           // e.g., "R-204"
  classTeacherId?: string;
}
```

#### subjects
```typescript
{
  id: string;
  subjectName: string;           // "Mathematics", "Science"
  subjectCode: string;           // Unique: "MTH101"
  subjectType: 'Theory' | 'Practical' | 'Activity' | 'Lab';
  description?: string;
  isOptional: boolean;
}
```

#### teacherAssignments (classSubjects mapping)
```typescript
{
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  weeklyPeriodCount: number;     // How many periods per week
}
```

#### periods (Time slots)
```typescript
{
  id: string;
  periodName: string;            // "P1", "P2", "Break", "Lunch"
  startTime: string;             // "08:00" format
  endTime: string;               // "08:40"
  type: 'Regular' | 'Break' | 'Lunch';
}
```

#### timetable
```typescript
{
  id: string;
  classId: string;
  sectionId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodId: string;              // Foreign key to periods
  subjectId: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  academicSessionId: string;
}
```

#### academicCalendar (Events)
```typescript
{
  id: string;
  title: string;
  date: string;
  type: 'Holiday' | 'Exam' | 'Event' | 'Meeting';
  description?: string;
}
```

**Store**: `useAcademicsStore` (Zustand)
- State: sessions, classes, sections, subjects, assignments, periods, timetable, events
- Actions: setActiveSession(), addSubject()

---

### 2.2 ADMISSIONS MODULE
**Purpose**: Manage student admission applications and approval workflow

**Key Collections**:

#### admissionApplications
```typescript
{
  id: string;
  applicationNo: string;         // Unique: "NS-2026-0001"
  studentFirstName: string;
  studentLastName: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;                   // Date of birth (YYYY-MM-DD)
  bloodGroup?: string;
  religion?: string;
  category?: string;             // SC/ST/OBC/General
  studentType: 'Day Scholar' | 'Residential';
  applyingClassId: string;       // Foreign key to classes
  guardianName: string;
  mobile: string;                // 10-digit
  email: string;
  hostelRequired: boolean;
  preferredHostel?: string;      // "Girls Hostel A", "Boys Hostel B"
  applicationStatus: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waiting List' | 'Enrolled';
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  approvedBy?: string;           // Admin UID who approved
  rejectionReason?: string;
  admissionFeeStatus: 'Paid' | 'Pending' | 'Failed';
  createdAt: string;
  updatedAt: string;
}
```

#### admissionEnquiries (Prospect contacts)
- Name, contact, class interested, inquiry date
- Not yet fully modeled in code

#### admissionReviews (Reviewer notes)
- Application ID, reviewer comments, rating/decision

#### admissionDocuments (Supporting docs)
- Application ID, document type, URL to storage

#### admissionFees (Payment tracking)
- Application ID, fee amount, payment status, transaction ID

**Workflow**: 
1. Application created (Draft)
2. Guardian submits (Submitted)
3. Admin reviews (Under Review)
4. Admin approves → Triggers transaction:
   - Update application status → "Approved"
   - Create student record (with admission #, placeholder roll #)
   - Create parent record
   - Send notification
5. Student enrolled (Enrolled)

**Store**: `useAdmissionsStore` (Zustand)
- State: applications, filters
- Actions: setFilters(), upsertApplication(), updateStatus()

---

### 2.3 ATTENDANCE MODULE
**Purpose**: Track attendance for students, staff, and hostel residents

**Key Collections**:

#### studentAttendance
```typescript
{
  attendanceId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  attendanceDate: string;        // ISO date
  rollNumber: string;
  studentName: string;
  studentPhotoUrl?: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave';
  remarks?: string;              // Reason for absence/leave
  markedBy: string;              // Teacher UID
  markedAt: string;
  updatedAt: string;
  schoolId?: string;             // Multi-tenancy
}
```

#### hostelAttendance
```typescript
{
  recordId: string;
  studentId: string;
  studentName: string;
  hostelId: string;              // Reference to hostel
  roomId: string;
  attendanceType: 'Morning' | 'Night';
  status: 'Present' | 'Missing' | 'Leave' | 'Sick';
  date: string;
  markedBy: string;              // Warden UID
}
```

#### staffAttendance (Teachers & Admin)
```typescript
{
  attendanceId: string;
  teacherId: string;
  teacherName: string;
  staffType: 'Teacher' | 'Staff';
  status: 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day';
  checkIn?: string;              // Time: "08:45"
  checkOut?: string;             // Time: "16:00"
  date: string;
}
```

#### attendanceLogs (Audit trail)
- Attendance lock records, timestamp, module reference

**Features**:
- Bulk attendance marking for a class/section on a date
- Subject-wise tracking (attendance by period)
- Attendance analytics (percentage calculations)
- Lock attendance sheet to prevent edits

**Store**: `useAttendanceStore` (Zustand)
- State: filters (classId, sectionId, date, subject), studentRecords, hostelRecords, teacherRecords
- Actions: setFilters(), setStudentStatus(), markAllPresent()

---

### 2.4 EXAMS MODULE
**Purpose**: Manage exams, schedules, marks entry, and result publication

**Key Collections**:

#### exams
```typescript
{
  id: string;
  examName: string;              // "Quarterly Assessment", "Unit Test 1"
  examType: 'Unit Test' | 'Monthly Test' | 'Quarterly' | 'Half Yearly' | 'Annual Exam' | 'Practical Exam';
  academicSessionId: string;     // Foreign key
  startDate: string;
  endDate: string;
  description?: string;
  status: 'Draft' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Published';
  createdBy: string;             // Admin UID
  createdAt: string;
}
```

#### examSchedules
```typescript
{
  id: string;
  examId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subjectName: string;
  examDate: string;
  startTime: string;             // "09:00"
  endTime: string;               // "12:00"
  maximumMarks: number;
  passingMarks: number;          // Usually 33% or 40%
  roomCode?: string;             // Exam center/room
  assignedTeacherId?: string;    // Exam invigilator
}
```

#### marks (Mark entries)
```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  examId: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  sectionId: string;
  obtainedMarks: number;         // 0-100
  maximumMarks: number;
  passingMarks: number;
  grade: string;                 // "A", "B", "C", "F"
  status: 'Present' | 'Absent' | 'Exempted';
  remarks?: string;              // Medical leave reason
  enteredBy: string;             // Teacher UID
  createdAt: string;
}
```

#### gradeRules (Grading scale)
```typescript
{
  id: string;
  minPercentage: number;         // 91
  maxPercentage: number;         // 100
  grade: string;                 // "A+"
  gradePoint: number;            // 10
  remarks?: string;              // "Outstanding"
}
```

**Example Grade Scale**:
| Grade | Percentage | Grade Point |
|-------|-----------|------------|
| A+    | 91-100    | 10         |
| A     | 81-90.99  | 9          |
| B+    | 71-80.99  | 8          |
| F     | 0-40.99   | 0          |

#### studentResults
```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  totalMarks: number;            // Sum of all subjects max marks
  obtainedMarks: number;
  percentage: number;            // Calculated
  gpa: number;                   // Grade Point Average
  finalGrade: string;
  classRank: number;
  sectionRank: number;
  status: 'Draft' | 'Published' | 'Locked';
  publishedAt?: string;
}
```

**Workflow**:
1. Create exam (Draft)
2. Create schedules for each class/section/subject
3. Enter marks (before result publication)
4. Generate results using grade rules
5. Publish results → Lock for editing
6. Can view by student/parent/teacher (role-based)

**Store**: `useExamStore` (Zustand)
- State: exams, schedules, marks, results, gradeRules
- Actions: updateExamStatus(), upsertMark(), publishResult()

---

### 2.5 STUDENTS MODULE
**Purpose**: Core student information management

**Key Collections**:

#### students
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dob: string;                   // Date of birth
  bloodGroup?: string;           // "O+", "B-"
  religion?: string;
  category?: string;             // SC/ST/OBC/General
  aadhaarNo?: string;
  mobile: string;
  email?: string;
  photoUrl?: string;             // Firebase Storage URL
  
  parent: {
    fatherName: string;
    motherName: string;
    guardianName: string;
    guardianMobile: string;
    guardianEmail?: string;
    occupation?: string;
    annualIncome?: string;
  };
  
  address: {
    addressLine: string;
    state: string;
    district: string;
    city: string;
    pinCode: string;
  };
  
  academic: {
    admissionNo: string;         // Unique: "ADM1001"
    rollNo: string;              // "10A-01"
    admissionDate: string;
    classId: string;             // Foreign key
    sectionId: string;
    session: string;             // "2025-26"
    previousSchool?: string;
    studentType: 'day_scholar' | 'residential';
  };
  
  hostel?: {
    hostelName: string;          // "Blue House"
    roomNo: string;              // "12"
    bedNo: string;               // "2"
    wardenName: string;
    joiningDate: string;
  };
  
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  createdAt: string;
  updatedAt: string;
  createdBy: string;             // Admin UID
}
```

#### studentDocuments (Supporting files)
```typescript
{
  id: string;
  studentId: string;
  label: string;                 // "Birth Certificate", "Aadhar"
  url: string;                   // Firebase Storage URL
  mimeType: string;              // "application/pdf"
  createdAt: string;
}
```

#### studentPromotions (Class movements)
```typescript
{
  promotionId: string;
  studentIds: string[];          // Batch promote multiple students
  fromClassId: string;
  toClassId: string;
  fromSectionId: string;
  toSectionId: string;
  session: string;               // New session after promotion
  promotedAt: string;
  promotedBy: string;            // Admin UID
}
```

#### parents (Parent accounts - created on admission approval)
```typescript
{
  parentId: string;
  uid: string;                   // Firebase Auth UID
  studentIds: string[];          // Can view multiple children
  role: 'parent';
  email: string;
}
```

**Features**:
- Filtering: by class, section, gender, status, type, search
- Sorting: by name, admission date, roll number
- Pagination: 10 rows per page (default)
- Soft delete (mark inactive)
- Bulk promotion to next class/section

**Store**: `useStudentsStore` (Zustand)
- State: rows, total, page, pageSize, filters, selectedIds
- Actions: fetch(), setFilters(), setPage(), setPageSize(), remove(), setSelectedIds()

---

## 3. STORE ARCHITECTURE

All modules use **Zustand** for state management:

```typescript
// Pattern: Feature Store
create<State>((set, get) => ({
  // Initial state
  data: [],
  filters: {},
  loading: false,
  
  // Actions (mutations)
  setData: (data) => set({ data }),
  addItem: (item) => set((state) => ({ data: [...state.data, item] })),
  
  // Async actions
  fetch: async () => {
    set({ loading: true });
    const data = await service.fetch();
    set({ data, loading: false });
  }
}));
```

**Key Stores**:
- `useAcademicsStore` - Academic structure, timetables
- `useAdmissionsStore` - Admission applications
- `useAttendanceStore` - Attendance records
- `useExamStore` - Exams, marks, results
- `useStudentsStore` - Student data with pagination
- `useAuthStore` - Current logged-in user

---

## 4. SERVICE LAYER PATTERN

Services handle **Firebase integration** and **business logic**:

```typescript
// academicService.ts
export async function listAcademicSessions(pageSize = 20) {
  const q = query(
    collection(db!, 'academicSessions'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}

// attendanceService.ts
export async function fetchStudentAttendance(classId, sectionId, date) {
  const q = query(
    collection(db, 'studentAttendance'),
    where('classId', '==', classId),
    where('sectionId', '==', sectionId),
    where('attendanceDate', '==', date)
  );
  return (await getDocs(q)).docs.map((d) => d.data());
}

// Uses writeBatch for bulk updates
export async function submitStudentAttendance(records) {
  const batch = writeBatch(db);
  records.forEach((record) => {
    batch.set(doc(collection(db, 'studentAttendance'), record.attendanceId), record);
  });
  await batch.commit();
}
```

**Features**:
- ✅ Firebase collection queries
- ✅ Batch operations (bulk insert/update)
- ✅ Transactions (e.g., admission approval)
- ✅ Timestamp management (`serverTimestamp()`)
- ✅ Fallback to mock data if Firebase not configured

---

## 5. MOCK DATA

All modules have mock seed data in `mocks/seed.ts` for development/testing:

### Sample Mock Data Sizes:
| Module | Record Type | Count | Purpose |
|--------|-----------|-------|---------|
| Academics | Sessions | 1 | Current session |
| Academics | Classes | 1 | Sample class |
| Academics | Timetable | 1 | Sample entry |
| Admissions | Applications | 2 | Submitted, Under Review |
| Attendance | Student Records | 18 | Class A+B |
| Attendance | Hostel Records | 8 | Morning+Night |
| Exams | Exams | 2 | Quarterly + Unit Test |
| Exams | Marks | 2 | Pass + Fail examples |
| Students | Students | 24 | Mixed class/section/type |

---

## 6. FIRESTORE SCHEMA DESIGN

### Collection Hierarchy

```
root/
├── users/
│   └── {uid}
│       ├── uid
│       ├── email
│       ├── role
│       ├── schoolId
│       ├── studentIds[] (for parents)
│       └── assignedClassIds[] (for teachers)
│
├── academicSessions/
│   └── {sessionId}
│
├── classes/
│   └── {classId}
│       └── academicSessionId (FK)
│
├── sections/
│   └── {sectionId}
│       └── classId (FK)
│
├── subjects/
│   └── {subjectId}
│
├── teacherAssignments/
│   └── {assignmentId}
│
├── periods/
│   └── {periodId}
│
├── timetable/
│   └── {timetableId}
│
├── academicCalendar/
│   └── {eventId}
│
├── admissionApplications/
│   └── {appId}
│
├── admissionEnquiries/
│
├── admissionReviews/
│
├── admissionDocuments/
│   └── (links to Firebase Storage)
│
├── admissionFees/
│
├── students/
│   └── {studentId}
│       ├── classId (FK)
│       ├── sectionId (FK)
│       └── academic.admissionNo (unique)
│
├── parents/
│   └── {parentId}
│       ├── uid (FK to users)
│       └── studentIds[] (FK)
│
├── studentDocuments/
│   └── (links to Firebase Storage)
│
├── studentPromotions/
│   └── {promotionId}
│
├── studentAttendance/
│   └── {recordId}
│       ├── classId (FK)
│       ├── sectionId (FK)
│       └── attendanceDate (for querying)
│
├── hostelAttendance/
│   └── {recordId}
│
├── staffAttendance/
│   └── {recordId}
│
├── attendanceLogs/
│   └── (audit trail)
│
├── exams/
│   └── {examId}
│
├── examSchedules/
│   └── {scheduleId}
│
├── marks/
│   └── {markId}
│       ├── examId (FK)
│       └── studentId (FK)
│
├── studentResults/
│   └── {resultId}
│
├── gradeRules/
│   └── {ruleId}
│
└── hostels/
    └── {hostelId}
```

### Critical Indexes Needed

```firestore
// Student Queries
students:
  - classId + status
  - sectionId + status
  - academic.admissionNo (unique)

admissionApplications:
  - applicationStatus + createdAt
  - applyingClassId + applicationStatus

studentAttendance:
  - classId + sectionId + attendanceDate
  - attendanceDate (for daily reports)

marks:
  - examId + classId + sectionId
  - studentId + examId

studentResults:
  - examId + classId (for reports)
  - studentId (for student transcript)
```

### Firestore Rules (Currently Implemented)

```
- students: Admins full access; Teachers can read their assigned classes; Students/Parents can read own data; Accountants can read all
- parents: Admins only
- teacherAssignments: Admins write; Teachers, Students, Parents can read
- Public collections: All signed-in users can read; Admins can write
- studentPromotions: All signed-in can read; Admins can write
```

---

## 7. DATA RELATIONSHIPS & FOREIGN KEYS

```
classes
  ├── classTeacherId ──→ (future: teachers collection)
  └── academicSessionId ──→ academicSessions

sections
  └── classId ──→ classes

teacherAssignments
  ├── teacherId ──→ (future: teachers collection)
  ├── subjectId ──→ subjects
  ├── classId ──→ classes
  └── sectionId ──→ sections

timetable
  ├── classId ──→ classes
  ├── sectionId ──→ sections
  ├── periodId ──→ periods
  ├── subjectId ──→ subjects
  └── teacherId ──→ (future: teachers collection)

admissionApplications
  └── applyingClassId ──→ classes

students
  ├── classId ──→ classes
  ├── sectionId ──→ sections
  └── (future: parentId ──→ parents)

parents
  └── studentIds[] ──→ students

studentAttendance
  ├── studentId ──→ students
  ├── classId ──→ classes
  └── sectionId ──→ sections

hostelAttendance
  ├── studentId ──→ students
  └── hostelId ──→ hostels

exams
  └── academicSessionId ──→ academicSessions

examSchedules
  ├── examId ──→ exams
  ├── classId ──→ classes
  ├── sectionId ──→ sections
  └── subjectId ──→ subjects

marks
  ├── examId ──→ exams
  ├── studentId ──→ students
  ├── classId ──→ classes
  └── sectionId ──→ sections

studentResults
  ├── examId ──→ exams
  └── studentId ──→ students

gradeRules
  └── (applied during result calculation)

studentPromotions
  └── studentIds[] ──→ students
```

---

## 8. KEY IMPLEMENTATION DETAILS

### Validation
Each module has a schema file with validators:
- **academicSchema.ts**: Session & subject validation
- **admissionSchema.ts**: Application completeness checks
- **attendanceSchema.ts**: Duplicate detection, field validation
- **examSchema.ts**: Mark range validation
- **studentSchema.ts**: Mobile/email format, required fields

### Transaction Example (Admission Approval)
```typescript
// approveAdmissionTransaction in admissionService.ts
async function approveAdmissionTransaction(application, approvedBy) {
  // TODO: Implement with Firestore runTransaction:
  // 1. Update admissionApplications/{id} → status = "Approved"
  // 2. Create students/{newStudentId} with admission details
  // 3. Create parents/{parentId} placeholder
  // 4. Create notifications/{notificationId}
  // 5. Send email/SMS
}
```

### Batch Operations
```typescript
// submitStudentAttendance example
const batch = writeBatch(db);
records.forEach((record) => {
  const ref = doc(collection(db, 'studentAttendance'), record.attendanceId);
  batch.set(ref, { ...record, updatedAt: serverTimestamp() }, { merge: true });
});
await batch.commit();
```

### Multi-Tenancy
- `schoolId` field in users
- Can be added to all collections for data isolation
- Role-based queries filter by schoolId implicitly

---

## 9. MODULE READINESS CHECKLIST

| Module | Types | Schema | Service | Store | Mocks | Firestore Service |
|--------|-------|--------|---------|-------|-------|-------------------|
| Academics | ✅ | ✅ | ✅ (Basic) | ✅ | ✅ | ⚠️ Partial |
| Admissions | ✅ | ✅ | ⚠️ TODO | ✅ | ✅ | ⚠️ TODO |
| Attendance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exams | ✅ | ✅ | ✅ (Partial) | ✅ | ✅ | ✅ |
| Students | ✅ | ✅ | ✅ (In-memory) | ✅ | ✅ | ⚠️ TODO |

**Legend**:
- ✅ Complete
- ⚠️ Partial/TODO
- ❌ Not started

---

## 10. NEXT STEPS FOR IMPLEMENTATION

### Phase 1: Complete Service Layer
1. **Admissions**: Implement admission application submission, approval workflow with transaction
2. **Students**: Migrate from in-memory service to Firestore queries
3. **Academics**: Add schedule conflict detection, timetable generation

### Phase 2: Add Missing Collections
1. Teachers (staff directory)
2. Hostels (accommodation management)
3. Fees (payment tracking)
4. Notifications (email/SMS queue)
5. Documents (storage management)

### Phase 3: Features
1. Bulk student promotion
2. Attendance analytics & reports
3. Grade calculation engine
4. Result card generation
5. Parent-facing dashboards

### Phase 4: DevOps
1. Firestore indexes optimization
2. Caching strategy (Redis/IndexedDB)
3. Backup automation
4. Performance monitoring

---

## 11. DEVELOPMENT TIPS

### Running with Mock Data
- Set `VITE_FIREBASE_API_KEY` to empty or invalid
- Services fallback to mock seed data
- Perfect for UI development without Firebase setup

### Adding a New Module
```typescript
// 1. src/modules/newModule/types/index.ts
export interface YourData { ... }

// 2. src/modules/newModule/schemas/yourSchema.ts
export function validateYourData(input) { ... }

// 3. src/modules/newModule/services/yourService.ts
export async function fetch() { ... }

// 4. src/modules/newModule/store/useYourStore.ts
export const useYourStore = create((set) => ({ ... }))

// 5. src/modules/newModule/mocks/seed.ts
export const mockData = [ ... ]
```

### Debugging Firestore Queries
- Enable Firebase console logging
- Use Firestore emulator locally
- Check Firestore indexes in console if queries slow

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         React Components                 │
│  (features/*, modules/*/components)     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Zustand Stores                     │
│  (useAcademicsStore, etc.)              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Service Layer                      │
│  (academicService, admissionService)    │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│   Firebase   │  │  Mock Data   │
│  (Firestore) │  │  (seed.ts)   │
└──────────────┘  └──────────────┘
```

---

Generated: May 25, 2026
