import { Card, CardContent, Divider, Grid2, Link, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StudentProfileHeader } from '../components/StudentProfileHeader';
import { getStudentById } from '../services/studentService';
import { Student } from '../types';

export function StudentDetailsPage() {
  const { id = '' } = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    getStudentById(id).then((s) => setStudent(s ?? null));
  }, [id]);

  const documents = useMemo(
    () => [
      { label: 'Birth Certificate', url: '#' },
      { label: 'Transfer Certificate', url: '#' },
      { label: 'Aadhaar (placeholder)', url: '#' },
      { label: 'Previous Marksheet', url: '#' },
      { label: 'Other Documents', url: '#' },
    ],
    []
  );

  if (!student) return <Typography>Student not found.</Typography>;

  return (
    <Stack spacing={2}>
      <StudentProfileHeader student={student} />

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <InfoCard title="Personal Info" rows={[
            ['First Name', student.firstName], ['Last Name', student.lastName], ['Gender', student.gender], ['Date of Birth', student.dob],
            ['Blood Group', student.bloodGroup || '-'], ['Religion', student.religion || '-'], ['Category', student.category || '-'], ['Email', student.email || '-'], ['Mobile', student.mobile],
          ]} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <InfoCard title="Parent Info" rows={[
            ['Father Name', student.parent.fatherName], ['Mother Name', student.parent.motherName], ['Guardian Name', student.parent.guardianName], ['Guardian Mobile', student.parent.guardianMobile],
            ['Guardian Email', student.parent.guardianEmail || '-'], ['Occupation', student.parent.occupation || '-'], ['Annual Income', student.parent.annualIncome || '-'],
          ]} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <InfoCard title="Academic Info" rows={[
            ['Admission Number', student.academic.admissionNo], ['Roll Number', student.academic.rollNo], ['Admission Date', student.academic.admissionDate], ['Class', student.academic.classId],
            ['Section', student.academic.sectionId], ['Session', student.academic.session], ['Previous School', student.academic.previousSchool || '-'], ['Student Type', student.academic.studentType],
          ]} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <InfoCard title="Attendance Summary" rows={[['Present Days', 'Placeholder'], ['Absent Days', 'Placeholder'], ['Attendance %', 'Placeholder']]} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <InfoCard title="Fees Summary" rows={[['Outstanding', 'Placeholder'], ['Last Payment', 'Placeholder'], ['Status', 'Placeholder']]} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <InfoCard title="Hostel Info" rows={student.hostel ? [
            ['Hostel Name', student.hostel.hostelName], ['Room Number', student.hostel.roomNo], ['Bed Number', student.hostel.bedNo], ['Warden Name', student.hostel.wardenName], ['Joining Date', student.hostel.joiningDate],
          ] : [['Student Type', 'Day Scholar'], ['Hostel', 'Not applicable']]} />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Uploaded Documents</Typography>
              <List dense>
                {documents.map((doc) => (
                  <ListItem key={doc.label} disableGutters secondaryAction={<Link href={doc.url}>View</Link>}>
                    <ListItemText primary={doc.label} secondary="Storage URL placeholder" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Stack>
  );
}

function InfoCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Divider sx={{ mb: 1 }} />
        <Stack spacing={1}>
          {rows.map(([k, v]) => (
            <Stack key={k} direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" color="text.secondary">{k}</Typography>
              <Typography variant="body2" fontWeight={600}>{v}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
