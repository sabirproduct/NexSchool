import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { UnifiedAttendanceRecord, UserType, AttendanceDirection, VisitorRecord, VisitorReference } from '../types';

const UNIFIED_COLLECTION = 'unifiedAttendance';
const VISITOR_COLLECTION = 'visitorAttendance';

/**
 * Generate a unique ID for an attendance record
 */
function generateAttendanceId(userId: string, date: string, direction: AttendanceDirection): string {
  return `${userId}_${date}_${direction}`;
}

/**
 * Generate a unique visitor ID
 */
function generateVisitorId(schoolId: string): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VIS-${dateStr}-${random}`;
}

/**
 * Look up a person by their unique ID across users, students, and teachers collections
 */
export async function lookupPersonById(
  personId: string,
  schoolId: string
): Promise<{ found: boolean; userId: string; userName: string; userType: UserType; metadata?: any } | null> {
  if (!db) {
    // Mock mode: return mock data for any ID
    return {
      found: true,
      userId: personId,
      userName: `Person ${personId}`,
      userType: 'student',
    };
  }

  // Try users collection first (teachers, employees, staff)
  try {
    const userDoc = await getDoc(doc(db, 'users', personId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const role = data.role || '';
      let userType: UserType = 'employee';
      if (role === 'teacher' || role === 'principal') userType = 'teacher';
      else if (role === 'student') userType = 'student';

      return {
        found: true,
        userId: personId,
        userName: data.name || data.email || personId,
        userType,
        metadata: {
          department: data.department,
          designation: data.designation,
        },
      };
    }
  } catch (e) {
    // continue to next lookup
  }

  // Try students collection
  try {
    const studentDoc = await getDoc(doc(db, 'students', personId));
    if (studentDoc.exists()) {
      const data = studentDoc.data();
      return {
        found: true,
        userId: personId,
        userName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || personId,
        userType: 'student',
        metadata: {
          classId: data.classId,
          sectionId: data.sectionId,
        },
      };
    }
  } catch (e) {
    // continue
  }

  // Try querying by admissionNo in students collection
  try {
    const studentsQuery = query(
      collection(db, 'students'),
      where('admissionNo', '==', personId),
      where('schoolId', '==', schoolId)
    );
    const snapshot = await getDocs(studentsQuery);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        found: true,
        userId: snapshot.docs[0].id,
        userName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || personId,
        userType: 'student',
        metadata: {
          classId: data.classId,
          sectionId: data.sectionId,
        },
      };
    }
  } catch (e) {
    // continue
  }

  // Try querying users by email
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', personId),
      where('schoolId', '==', schoolId)
    );
    const snapshot = await getDocs(usersQuery);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const role = data.role || '';
      let userType: UserType = 'employee';
      if (role === 'teacher' || role === 'principal') userType = 'teacher';
      else if (role === 'student') userType = 'student';

      return {
        found: true,
        userId: snapshot.docs[0].id,
        userName: data.name || data.email || personId,
        userType,
      };
    }
  } catch (e) {
    // continue
  }

  return null;
}

/**
 * Check if the user has already been marked for the given direction today
 */
export async function hasExistingAttendance(
  userId: string,
  date: string,
  direction: AttendanceDirection
): Promise<boolean> {
  if (!db) return false;

  const id = generateAttendanceId(userId, date, direction);
  const q = query(
    collection(db, UNIFIED_COLLECTION),
    where('id', '==', id)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Mark attendance for a user (student, teacher, or employee)
 */
export async function markAttendance(
  userId: string,
  userName: string,
  userType: UserType,
  direction: AttendanceDirection,
  schoolId: string,
  markedBy: string,
  metadata?: {
    classId?: string;
    sectionId?: string;
    department?: string;
    designation?: string;
  }
): Promise<{ success: boolean; message: string; record?: UnifiedAttendanceRecord }> {
  const today = new Date().toISOString().split('T')[0];
  const id = generateAttendanceId(userId, today, direction);

  // Check for duplicate
  const existing = await hasExistingAttendance(userId, today, direction);
  if (existing) {
    return {
      success: false,
      message: `${userName} already marked ${direction === 'IN' ? 'check-in' : 'check-out'} for today.`,
    };
  }

  // Build metadata object with only defined values (Firestore rejects undefined)
  const cleanMetadata: Record<string, string> = {};
  if (metadata) {
    if (metadata.classId !== undefined) cleanMetadata.classId = metadata.classId;
    if (metadata.sectionId !== undefined) cleanMetadata.sectionId = metadata.sectionId;
    if (metadata.department !== undefined) cleanMetadata.department = metadata.department;
    if (metadata.designation !== undefined) cleanMetadata.designation = metadata.designation;
  }
  const hasMetadata = Object.keys(cleanMetadata).length > 0;

  const record: UnifiedAttendanceRecord = {
    id,
    userId,
    userName,
    userType,
    direction,
    date: today,
    timestamp: new Date().toISOString(),
    schoolId,
    markedBy,
    ...(hasMetadata ? { metadata: cleanMetadata } : {}),
  };

  if (!db) {
    return {
      success: true,
      message: `✅ ${userName} (${userType}) marked ${direction === 'IN' ? 'IN' : 'OUT'} successfully.`,
      record,
    };
  }

  try {
    await addDoc(collection(db, UNIFIED_COLLECTION), {
      id,
      userId,
      userName,
      userType,
      direction,
      date: today,
      timestamp: new Date().toISOString(),
      schoolId,
      markedBy,
      ...(hasMetadata ? { metadata: cleanMetadata } : {}),
      createdAt: serverTimestamp(),
    });
    return {
      success: true,
      message: `✅ ${userName} (${userType}) marked ${direction === 'IN' ? 'IN' : 'OUT'} successfully.`,
      record,
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return {
      success: false,
      message: `❌ Failed to mark attendance: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get today's attendance records
 */
export async function getTodayAttendance(
  schoolId: string
): Promise<UnifiedAttendanceRecord[]> {
  const today = new Date().toISOString().split('T')[0];

  if (!db) return [];

  try {
    const q = query(
      collection(db, UNIFIED_COLLECTION),
      where('schoolId', '==', schoolId),
      where('date', '==', today),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as UnifiedAttendanceRecord);
  } catch (error) {
    console.error('Error fetching today attendance:', error);
    return [];
  }
}

/**
 * Get attendance records for a specific user
 */
export async function getUserAttendance(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<UnifiedAttendanceRecord[]> {
  if (!db) return [];

  try {
    const conditions: any[] = [
      where('userId', '==', userId),
    ];

    if (startDate) {
      conditions.push(where('date', '>=', startDate));
    }
    if (endDate) {
      conditions.push(where('date', '<=', endDate));
    }

    conditions.push(orderBy('date', 'desc'));

    const q = query(collection(db, UNIFIED_COLLECTION), ...conditions);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as UnifiedAttendanceRecord);
  } catch (error) {
    console.error('Error fetching user attendance:', error);
    return [];
  }
}

// ──────────────────────────────────────────────
//  VISITOR ATTENDANCE
// ──────────────────────────────────────────────

/**
 * Check in a visitor
 */
export async function visitorCheckIn(
  visitorName: string,
  reference: VisitorReference,
  schoolId: string,
  markedBy: string,
  options?: {
    referenceName?: string;
    idCardUrl?: string;
    phone?: string;
    purpose?: string;
  }
): Promise<{ success: boolean; message: string; record?: VisitorRecord }> {
  const today = new Date().toISOString().split('T')[0];
  const visitorId = generateVisitorId(schoolId);

  const visitorRecordData: Record<string, any> = {
    id: `vis_${visitorId}`,
    visitorId,
    visitorName,
    reference,
    direction: 'IN',
    date: today,
    timestamp: new Date().toISOString(),
    schoolId,
    markedBy,
  };
  // Only add optional fields if they have values (Firestore rejects undefined)
  if (options?.referenceName) visitorRecordData.referenceName = options.referenceName;
  if (options?.idCardUrl) visitorRecordData.idCardUrl = options.idCardUrl;
  if (options?.phone) visitorRecordData.phone = options.phone;
  if (options?.purpose) visitorRecordData.purpose = options.purpose;

  const record = visitorRecordData as VisitorRecord;

  if (!db) {
    return {
      success: true,
      message: `✅ Visitor ${visitorName} checked in. Visitor ID: ${visitorId}`,
      record,
    };
  }

  try {
    await addDoc(collection(db, VISITOR_COLLECTION), {
      ...record,
      createdAt: serverTimestamp(),
    });
    return {
      success: true,
      message: `✅ Visitor ${visitorName} checked in. Visitor ID: ${visitorId}`,
      record,
    };
  } catch (error) {
    console.error('Error checking in visitor:', error);
    return {
      success: false,
      message: `❌ Failed to check in visitor: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Check out a visitor by visitor ID
 */
export async function visitorCheckOut(
  visitorId: string,
  schoolId: string,
  markedBy: string
): Promise<{ success: boolean; message: string; record?: VisitorRecord }> {
  if (!db) {
    return {
      success: true,
      message: `✅ Visitor ${visitorId} checked out successfully.`,
    };
  }

  try {
    // Find the visitor's check-in record that hasn't been checked out
    const q = query(
      collection(db, VISITOR_COLLECTION),
      where('visitorId', '==', visitorId),
      where('schoolId', '==', schoolId),
      where('direction', '==', 'IN'),
      orderBy('timestamp', 'desc'),
      // limit to 1 to get the latest check-in
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        success: false,
        message: `❌ No active check-in found for visitor ID: ${visitorId}`,
      };
    }

    const checkInDoc = snapshot.docs[0];
    const checkInData = checkInDoc.data() as VisitorRecord;

    // Create a check-out record
    const checkOutRecord: VisitorRecord = {
      ...checkInData,
      id: `vis_${visitorId}_OUT`,
      direction: 'OUT',
      timestamp: new Date().toISOString(),
      checkOutTime: new Date().toISOString(),
      markedBy,
    };

    await addDoc(collection(db, VISITOR_COLLECTION), {
      ...checkOutRecord,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `✅ ${checkInData.visitorName} checked out successfully.`,
      record: checkOutRecord,
    };
  } catch (error) {
    console.error('Error checking out visitor:', error);
    return {
      success: false,
      message: `❌ Failed to check out visitor: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get today's visitor records
 */
export async function getTodayVisitors(
  schoolId: string
): Promise<VisitorRecord[]> {
  const today = new Date().toISOString().split('T')[0];

  if (!db) return [];

  try {
    const q = query(
      collection(db, VISITOR_COLLECTION),
      where('schoolId', '==', schoolId),
      where('date', '==', today),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as VisitorRecord);
  } catch (error) {
    console.error('Error fetching today visitors:', error);
    return [];
  }
}