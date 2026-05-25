import { onCall } from 'firebase-functions/v2/https';

export const assignRole = onCall((request) => ({ ok: true, message: `Assign role placeholder for ${request.auth?.uid ?? 'system'}` }));
export const generateFeeReceipt = onCall(() => ({ ok: true, receiptId: `RCPT-${Date.now()}` }));
export const calculateResult = onCall(() => ({ ok: true, gpa: 9.1 }));
export const sendNotification = onCall(() => ({ ok: true }));

export const calculateAttendanceSummary = onCall(() => ({ ok: true, message: 'Attendance summary calculation placeholder' }));
export const triggerLowAttendanceAlerts = onCall(() => ({ ok: true, warningThreshold: 75, criticalThreshold: 50 }));
export const triggerAttendanceNotifications = onCall(() => ({ ok: true, channels: ['sms', 'whatsapp', 'parent-app'] }));
export const aggregateDailyAttendance = onCall(() => ({ ok: true, message: 'Daily attendance aggregation placeholder' }));

export const detectTimetableConflict = onCall(() => ({ ok: true, conflictFree: true, message: 'Timetable conflict validation placeholder' }));
export const calculateTeacherWorkload = onCall(() => ({ ok: true, workloadByTeacher: [] }));
export const validateSessionActivation = onCall(() => ({ ok: true, singleActiveSession: true }));
export const sendAcademicReminders = onCall(() => ({ ok: true, channels: ['email','sms','app'] }));
