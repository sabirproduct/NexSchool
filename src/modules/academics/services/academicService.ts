import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../config/firebase';
export async function listAcademicSessions(pageSize = 20) {
  const q = query(collection(db!, 'academicSessions'), orderBy('createdAt', 'desc'), limit(pageSize));
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}
