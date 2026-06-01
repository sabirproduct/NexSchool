# Firebase Firestore Integration Guide

## Overview
The NexSchool application has been fully integrated with Firebase Firestore. All modules now use real-time Firestore operations with fallback to mock data when Firebase is not configured.

## Architecture

### Service Layers
1. **Generic Firestore Service** (`src/services/firestoreService.ts`)
   - CRUD operations
   - Real-time listeners
   - Batch operations
   - Transactions

2. **Module-Specific Services**
   - `src/modules/students/services/studentService.ts`
   - `src/modules/academics/services/academicService.ts`
   - `src/modules/attendance/services/attendanceService.ts`
   - `src/modules/admissions/services/admissionService.ts`
   - `src/modules/exams/services/examService.ts`

### State Management
All modules use **Zustand** stores that integrate with Firestore services:
- Real-time subscriptions for live data
- Fallback to mock data when offline
- Optimistic updates support

## Firestore Collections

### Core Collections

#### 1. academicSessions
```
{
  id: "session-2024-2025",
  schoolId: "school-001",
  sessionName: "2024-2025",
  startDate: "2024-04-01",
  endDate: "2025-03-31",
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. classes
```
{
  id: "class-X",
  schoolId: "school-001",
  academicSessionId: "session-2024-2025",
  className: "Class X",
  classCode: "X",
  totalStrength: 45,
  createdAt: timestamp
}
```

#### 3. sections
```
{
  id: "section-X-A",
  schoolId: "school-001",
  classId: "class-X",
  sectionName: "A",
  sectionCode: "A",
  classTeacherId: "teacher-001",
  createdAt: timestamp
}
```

#### 4. students
```
{
  id: "STU-12345",
  schoolId: "school-001",
  admissionNo: "ADM-2024-001",
  fullName: "John Doe",
  gender: "male",
  dateOfBirth: "2008-05-15",
  classId: "class-X",
  sectionId: "section-X-A",
  status: "active",
  email: "john@school.com",
  phone: "9876543210",
  academic: {
    classId: "class-X",
    sectionId: "section-X-A",
    rollNo: "01",
    admissionNo: "ADM-2024-001",
    studentType: "dayscholar"
  },
  contact: {
    phone: "9876543210",
    email: "john@school.com"
  },
  address: {
    street: "123 Main St",
    city: "Delhi",
    state: "DL",
    pincode: "110001"
  },
  createdAt: timestamp
}
```

#### 5. parents
```
{
  id: "PAR-001",
  schoolId: "school-001",
  studentId: "STU-12345",
  parentName: "Jane Doe",
  parentType: "mother",
  email: "jane@example.com",
  phone: "9876543211",
  createdAt: timestamp
}
```

#### 6. teachers
```
{
  id: "teacher-001",
  schoolId: "school-001",
  employeeId: "EMP-001",
  fullName: "Mr. Smith",
  email: "smith@school.com",
  phone: "9876543212",
  qualification: "B.Tech",
  specialization: "Mathematics",
  status: "active",
  createdAt: timestamp
}
```

#### 7. subjects
```
{
  id: "subject-X-MATH",
  schoolId: "school-001",
  classId: "class-X",
  subjectName: "Mathematics",
  subjectCode: "MATH",
  maxMarks: 100,
  minMarks: 33,
  createdAt: timestamp
}
```

#### 8. teacherAssignments
```
{
  id: "assign-001",
  schoolId: "school-001",
  teacherId: "teacher-001",
  classId: "class-X",
  sectionId: "section-X-A",
  subjectId: "subject-X-MATH",
  academicSessionId: "session-2024-2025",
  createdAt: timestamp
}
```

#### 9. timetable
```
{
  id: "tt-X-A",
  schoolId: "school-001",
  classId: "class-X",
  sectionId: "section-X-A",
  academicSessionId: "session-2024-2025",
  schedule: [
    {
      dayOfWeek: "Monday",
      periods: [
        {
          periodNo: 1,
          startTime: "09:00",
          endTime: "10:00",
          subjectId: "subject-X-MATH",
          teacherId: "teacher-001"
        }
      ]
    }
  ],
  createdAt: timestamp
}
```

#### 10. exams
```
{
  id: "exam-001",
  schoolId: "school-001",
  academicSessionId: "session-2024-2025",
  examName: "Mid-Term Exam",
  examType: "midterm",
  startDate: "2024-09-01",
  endDate: "2024-09-15",
  totalMarks: 100,
  createdAt: timestamp
}
```

#### 11. examSchedules
```
{
  id: "schedule-001",
  schoolId: "school-001",
  examId: "exam-001",
  classId: "class-X",
  subjectId: "subject-X-MATH",
  examDate: "2024-09-05",
  startTime: "10:00",
  endTime: "12:00",
  duration: 120,
  maxMarks: 100,
  createdAt: timestamp
}
```

#### 12. marks
```
{
  id: "mark-exam001-stu12345-math",
  schoolId: "school-001",
  examId: "exam-001",
  studentId: "STU-12345",
  classId: "class-X",
  sectionId: "section-X-A",
  subjectId: "subject-X-MATH",
  marksObtained: 85,
  maxMarks: 100,
  gradePointAverage: 8.5,
  enteredBy: "teacher-001",
  enteredAt: timestamp,
  updatedAt: timestamp
}
```

#### 13. studentResults
```
{
  id: "result-exam001-stu12345",
  schoolId: "school-001",
  examId: "exam-001",
  studentId: "STU-12345",
  classId: "class-X",
  sectionId: "section-X-A",
  totalMarks: 425,
  maxMarks: 500,
  percentage: 85.0,
  grade: "A",
  gpa: 8.5,
  rank: 2,
  status: "pass",
  publishedAt: timestamp,
  createdAt: timestamp
}
```

#### 14. studentAttendance
```
{
  id: "attend-stu12345-2024-09-01",
  schoolId: "school-001",
  studentId: "STU-12345",
  classId: "class-X",
  sectionId: "section-X-A",
  attendanceDate: "2024-09-01",
  status: "present", // or "absent", "leave", "halfday"
  remarks: "Regular",
  markedBy: "teacher-001",
  markedAt: timestamp,
  updatedAt: timestamp
}
```

#### 15. admissionApplications
```
{
  id: "app-2024-001",
  schoolId: "school-001",
  applicationNo: "APP-2024-001",
  applicationStatus: "Draft", // Draft, Submitted, Under Review, Approved, Rejected
  classAppliedFor: "class-VI",
  applicantDetails: {
    fullName: "Alice Johnson",
    dateOfBirth: "2012-06-15",
    gender: "female",
    phone: "9876543213"
  },
  parentDetails: {
    fatherName: "Bob Johnson",
    motherName: "Carol Johnson",
    email: "bob@example.com"
  },
  admissionFeeStatus: "pending", // pending, paid, partial
  documentsUploaded: true,
  appliedAt: timestamp,
  approvedAt: timestamp,
  approvedBy: "admin-001",
  createdAt: timestamp
}
```

#### 16. admissionFees
```
{
  id: "fee-app2024-001-001",
  schoolId: "school-001",
  applicationId: "app-2024-001",
  feeAmount: 5000,
  paymentDate: "2024-08-15",
  paymentMethod: "online",
  transactionId: "TXN-123456",
  paymentStatus: "completed",
  createdAt: timestamp
}
```

#### 17. admissionDocuments
```
{
  id: "doc-app2024-001-001",
  schoolId: "school-001",
  applicationId: "app-2024-001",
  documentType: "birth_certificate",
  documentUrl: "gs://nexschool-bucket/docs/...",
  uploadedAt: timestamp,
  verifiedBy: "admin-001",
  verificationStatus: "verified"
}
```

#### 18. gradeRules
```
{
  id: "grade-rule-001",
  schoolId: "school-001",
  percentage_from: 80,
  percentage_to: 100,
  grade: "A",
  gpa: 9.0,
  remarks: "Excellent",
  createdAt: timestamp
}
```

#### 19. notifications
```
{
  id: "notif-001",
  schoolId: "school-001",
  userId: "user-001",
  studentId: "STU-12345",
  title: "Attendance Alert",
  message: "Your attendance is below 75%",
  type: "attendance", // admission, attendance, exam, fee, etc.
  read: false,
  readAt: timestamp,
  createdAt: timestamp
}
```

#### 20. users
```
{
  id: "user-001",
  schoolId: "school-001",
  email: "john@school.com",
  role: "student", // student, parent, teacher, admin
  fullName: "John Doe",
  phoneNumber: "9876543210",
  assignedClasses: ["class-X"],
  assignedStudents: ["STU-12345"],
  lastLoginAt: timestamp,
  createdAt: timestamp
}
```

## Usage Examples

### 1. Fetch Students with Real-time Updates
```typescript
import { useStudentsStore } from '@/modules/students/store/useStudentsStore';

function StudentsList() {
  const { students, loading, fetchStudents } = useStudentsStore();

  useEffect(() => {
    fetchStudents('school-001');
  }, []);

  if (loading) return <div>Loading...</div>;
  return students.map(s => <div key={s.id}>{s.fullName}</div>);
}
```

### 2. Submit Attendance
```typescript
import { submitStudentAttendance } from '@/modules/attendance/services/attendanceService';

async function handleAttendanceSubmit(records) {
  await submitStudentAttendance('school-001', records);
}
```

### 3. Approve Admission (Transaction)
```typescript
import { approveAdmissionTransaction } from '@/modules/admissions/services/admissionService';

async function approveAdmission(appId, appData) {
  const result = await approveAdmissionTransaction(
    appId,
    appData,
    'admin-001'
  );
  console.log('Student created:', result.studentId);
}
```

### 4. Real-time Exam Marks Updates
```typescript
import { subscribeToMarks } from '@/modules/exams/services/examService';

useEffect(() => {
  const unsubscribe = subscribeToMarks(
    'school-001',
    'exam-001',
    'class-X',
    (marks) => {
      setMarks(marks);
    }
  );
  return unsubscribe;
}, []);
```

## Setting Up Firestore Indexes

Some queries require composite indexes. Create them in Firebase Console:

### Recommended Indexes
```
1. admissionApplications
   - Fields: schoolId (Asc), status (Asc), createdAt (Desc)
   
2. studentAttendance
   - Fields: schoolId (Asc), classId (Asc), attendanceDate (Desc)
   
3. marks
   - Fields: schoolId (Asc), examId (Asc), classId (Asc), studentId (Asc)
   
4. studentResults
   - Fields: schoolId (Asc), examId (Asc), classId (Asc), rank (Asc)
```

## Fallback Strategy

All services gracefully fallback to mock data when:
- Firebase is not configured (missing env variables)
- Database operations fail
- Offline mode is detected

This ensures the app remains usable during development and testing.

## Security Rules

Example Firestore rules (in `firestore.rules`):
```
match /databases/{database}/documents {
  match /students/{document=**} {
    allow read: if request.auth.uid != null && request.auth.token.schoolId == resource.data.schoolId;
    allow write: if request.auth.token.role in ['admin', 'teacher'];
  }
  
  match /exams/{document=**} {
    allow read: if request.auth.uid != null;
    allow write: if request.auth.token.role == 'admin';
  }
}
```

## Next Steps

1. ✅ Created base Firestore service layer
2. ✅ Updated all module services
3. ⏳ Create Firestore security rules
4. ⏳ Set up composite indexes in Firebase Console
5. ⏳ Populate initial data (academic sessions, classes, etc.)
6. ⏳ Update Zustand stores to use real-time listeners
7. ⏳ Test with real Firebase project

## Environment Setup

Ensure your `.env` file has:
```
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=nexschool-2026
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Troubleshooting

### Issue: Permission denied when writing to Firestore
- Check security rules in Firebase Console
- Verify user is authenticated
- Ensure schoolId matches in token

### Issue: Missing index error
- Go to Firebase Console > Firestore Database > Indexes
- Create the suggested composite index
- Wait for index creation to complete

### Issue: Data not syncing in real-time
- Check that onSnapshot listener is properly set up
- Verify network connectivity
- Check browser console for errors
