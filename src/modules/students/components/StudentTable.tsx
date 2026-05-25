import { Avatar, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Student } from '../types';

export function StudentTable({ rows, loading, onDelete }: { rows: Student[]; total: number; loading: boolean; page: number; pageSize: number; onPageChange: (v: number) => void; onPageSizeChange: (v: number) => void; onDelete: (id: string) => void }) {
  if (loading) return <Typography>Loading students...</Typography>;
  if (!rows.length) return <Paper sx={{ p: 3 }}><Typography>No students found.</Typography></Paper>;
  return <Table size="small"><TableHead><TableRow><TableCell>Photo</TableCell><TableCell>Admission No</TableCell><TableCell>Roll</TableCell><TableCell>Name</TableCell><TableCell>Class</TableCell><TableCell>Section</TableCell><TableCell>Gender</TableCell><TableCell>Mobile</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead><TableBody>
    {rows.map((r)=><TableRow key={r.id}><TableCell><Avatar src={r.photoUrl}>{r.firstName[0]}</Avatar></TableCell><TableCell>{r.academic.admissionNo}</TableCell><TableCell>{r.academic.rollNo}</TableCell><TableCell>{r.fullName}</TableCell><TableCell>{r.academic.classId}</TableCell><TableCell>{r.academic.sectionId}</TableCell><TableCell>{r.gender}</TableCell><TableCell>{r.mobile}</TableCell><TableCell>{r.academic.studentType}</TableCell><TableCell><Chip size="small" label={r.status} color={r.status==='active'?'success':'default'} /></TableCell><TableCell><Stack direction="row" spacing={0.5}><Button size="small">View</Button><Button size="small">Edit</Button><Button size="small" color="error" onClick={()=>onDelete(r.id)}>Delete</Button><Button size="small">Promote</Button></Stack></TableCell></TableRow>)}
  </TableBody></Table>;
}
