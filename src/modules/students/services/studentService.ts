import { mockStudents } from '../mocks/seed';
import { Student, StudentFilters } from '../types';

let memory = [...mockStudents];

export async function listStudents(filters: StudentFilters, page: number, pageSize: number) {
  let rows = [...memory];
  if (filters.search) rows = rows.filter((s) => s.fullName.toLowerCase().includes(filters.search!.toLowerCase()) || s.academic.admissionNo.includes(filters.search!));
  if (filters.classId) rows = rows.filter((s) => s.academic.classId === filters.classId);
  if (filters.sectionId) rows = rows.filter((s) => s.academic.sectionId === filters.sectionId);
  if (filters.gender) rows = rows.filter((s) => s.gender === filters.gender);
  if (filters.status) rows = rows.filter((s) => s.status === filters.status);
  if (filters.studentType) rows = rows.filter((s) => s.academic.studentType === filters.studentType);

  const sortBy = filters.sortBy ?? 'name';
  const sortOrder = filters.sortOrder ?? 'asc';
  rows.sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName) * dir;
    if (sortBy === 'admissionDate') return a.academic.admissionDate.localeCompare(b.academic.admissionDate) * dir;
    return a.academic.rollNo.localeCompare(b.academic.rollNo, undefined, { numeric: true }) * dir;
  });

  const total = rows.length;
  const start = page * pageSize;
  return { rows: rows.slice(start, start + pageSize), total };
}

export async function getStudentById(id: string) { return memory.find((s) => s.id === id); }
export async function createStudent(student: Student) { memory = [{ ...student }, ...memory]; return student; }
export async function updateStudent(id: string, patch: Partial<Student>) { memory = memory.map((s) => s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s); return getStudentById(id); }
export async function softDeleteStudent(id: string) { return updateStudent(id, { status: 'inactive' }); }
export async function promoteStudents(ids: string[], classId: string, sectionId: string, session: string) {
  memory = memory.map((s) => ids.includes(s.id) ? { ...s, academic: { ...s.academic, classId, sectionId, session } } : s);
}
