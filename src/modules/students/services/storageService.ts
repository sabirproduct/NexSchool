import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../config/firebase';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Firebase Storage and return the download URL
 */
export async function uploadStudentDocument(
  studentId: string,
  file: File,
  label: string
): Promise<UploadResult> {
  if (!db) {
    // Mock upload when Firebase is not configured
    console.warn('Firebase not configured. Simulating file upload.');
    return {
      url: URL.createObjectURL(file),
      path: `mock/students/${studentId}/${label}`,
    };
  }

  const storage = getStorage();
  const timestamp = Date.now();
  const filePath = `students/${studentId}/${label}_${timestamp}_${file.name}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return { url, path: filePath };
}

/**
 * Upload multiple files for a student
 */
export async function uploadStudentDocuments(
  studentId: string,
  files: Record<string, FileList | undefined>
): Promise<Record<string, UploadResult>> {
  const results: Record<string, UploadResult> = {};

  const uploadPromises = Object.entries(files)
    .filter(([, fileList]) => fileList && fileList.length > 0)
    .map(async ([label, fileList]) => {
      const file = fileList![0];
      const result = await uploadStudentDocument(studentId, file, label);
      results[label] = result;
    });

  await Promise.all(uploadPromises);
  return results;
}