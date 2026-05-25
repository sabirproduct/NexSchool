import { onCall } from 'firebase-functions/v2/https';

export const assignRole = onCall((request) => {
  return { ok: true, message: `Assign role placeholder for ${request.auth?.uid ?? 'system'}` };
});

export const generateFeeReceipt = onCall(() => ({ ok: true, receiptId: `RCPT-${Date.now()}` }));

export const calculateResult = onCall(() => ({ ok: true, gpa: 9.1 }));

export const sendNotification = onCall(() => ({ ok: true }));
