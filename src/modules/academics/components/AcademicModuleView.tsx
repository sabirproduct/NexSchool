import { Alert, Box, Chip, Grid2 as Grid, List, ListItem, ListItemText, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useAcademicsStore } from '../store/useAcademicsStore';

export function AcademicModuleView() {
  const [tab, setTab] = useState(0);
  const { classes, sections, subjects, assignments, sessions, timetable, events } = useAcademicsStore();
  const activeSession = sessions.find((x) => x.status === 'active');
  const timetableCompletion = useMemo(() => Math.min(100, Math.round((timetable.length / Math.max(1, classes.length * 6)) * 100)), [timetable.length, classes.length]);
  const cards = [
    ['Total Classes', classes.length], ['Total Sections', sections.length], ['Total Subjects', subjects.length], ['Total Teachers', new Set(assignments.map((a)=>a.teacherId)).size],
    ['Active Academic Session', activeSession?.academicYear ?? 'N/A'], ['Timetable Completion %', `${timetableCompletion}%`],
  ];
  return <Box className="space-y-4"><Typography variant="h4" fontWeight={700}>Academic Management</Typography>
    <Grid container spacing={2}>{cards.map(([title, value])=><Grid key={String(title)} size={{xs:12,md:4,lg:2}}><Paper className="p-4"><Typography color="text.secondary">{title}</Typography><Typography variant="h5" fontWeight={700}>{String(value)}</Typography></Paper></Grid>)}</Grid>
    <Paper className="p-4"><Tabs value={tab} onChange={(_,v)=>setTab(v)}><Tab label="Dashboard"/><Tab label="Sessions"/><Tab label="Classes & Sections"/><Tab label="Subjects"/><Tab label="Assignments"/><Tab label="Timetable"/><Tab label="Calendar"/><Tab label="Curriculum"/><Tab label="Homework"/></Tabs>
      <Box className="mt-4">{tab===0 && <Alert severity="info">Teacher workload, subject distribution, class strength analytics and pending timetable widgets are included as scalable placeholders.</Alert>}
      {tab===1 && <List>{sessions.map((s)=><ListItem key={s.id}><ListItemText primary={`${s.sessionName} (${s.startDate} to ${s.endDate})`} secondary={s.status}/><Chip size="small" label={s.status} color={s.status==='active'?'success':'default'} /></ListItem>)}</List>}
      {tab===2 && <List>{classes.map((c)=><ListItem key={c.id}><ListItemText primary={`${c.className} • Capacity ${c.capacity}`} secondary={`Level ${c.classLevel}`}/></ListItem>)}</List>}
      {tab===3 && <List>{subjects.map((s)=><ListItem key={s.id}><ListItemText primary={`${s.subjectName} (${s.subjectCode})`} secondary={s.subjectType}/></ListItem>)}</List>}
      {tab===4 && <List>{assignments.map((a)=><ListItem key={a.id}><ListItemText primary={`${a.teacherName} • ${a.weeklyPeriodCount} periods/week`} secondary={`class ${a.classId} • section ${a.sectionId}`}/></ListItem>)}</List>}
      {tab===5 && <List>{timetable.map((t)=><ListItem key={t.id}><ListItemText primary={`${t.day} ${t.startTime}-${t.endTime}`} secondary={`Class ${t.classId}, Section ${t.sectionId}, Subject ${t.subjectId}`}/></ListItem>)}</List>}
      {tab===6 && <List>{events.map((e)=><ListItem key={e.id}><ListItemText primary={e.title} secondary={`${e.date} • ${e.type}`}/></ListItem>)}</List>}
      {tab===7 && <Alert severity="info">Curriculum planning, syllabus tracking, topic completion and learning outcomes are implementation placeholders.</Alert>}
      {tab===8 && <Alert severity="info">Homework assignment, submission tracking, due dates and attachments are implementation placeholders.</Alert>}</Box></Paper>
  </Box>;
}
