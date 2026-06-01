import { useMemo, useState } from 'react';
import { useAcademicsStore } from '../store/useAcademicsStore';

export function AcademicModuleView() {
  const [tab, setTab] = useState(0);
  const { classes, sections, subjects, assignments, sessions, timetable, events } = useAcademicsStore();
  const activeSession = sessions.find((x) => x.status === 'active');
  const timetableCompletion = useMemo(
    () => Math.min(100, Math.round((timetable.length / Math.max(1, classes.length * 6)) * 100)),
    [timetable.length, classes.length]
  );
  const cards = [
    ['Total Classes', classes.length],
    ['Total Sections', sections.length],
    ['Total Subjects', subjects.length],
    ['Total Teachers', new Set(assignments.map((a) => a.teacherId)).size],
    ['Active Academic Session', activeSession?.academicYear ?? 'N/A'],
    ['Timetable Completion %', `${timetableCompletion}%`],
  ];

  const tabs = ['Dashboard', 'Sessions', 'Classes & Sections', 'Subjects', 'Assignments', 'Timetable', 'Calendar', 'Curriculum', 'Homework'];

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="h4 fw-bold">Academic Management</h2>
      </div>

      <div className="row g-3 mb-4">
        {cards.map(([title, value]) => (
          <div className="col-12 col-md-6 col-lg-4" key={title as string}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted small mb-1">{title}</p>
                <h3 className="h5 mb-0">{String(value)}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ul className="nav nav-tabs mb-4">
        {tabs.map((label, index) => (
          <li className="nav-item" key={label}>
            <button type="button" className={`nav-link ${tab === index ? 'active' : ''}`} onClick={() => setTab(index)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="card shadow-sm p-3">
        {tab === 0 && <div className="alert alert-info">Teacher workload, subject distribution, class strength analytics and pending timetable widgets are included as scalable placeholders.</div>}

        {tab === 1 && (
          <ul className="list-group">
            {sessions.map((s) => (
              <li key={s.id} className="list-group-item d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div className="fw-semibold">{s.sessionName} ({s.startDate} to {s.endDate})</div>
                  <div className="text-muted small">{s.status}</div>
                </div>
                <span className={`badge ${s.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{s.status}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === 2 && (
          <ul className="list-group">
            {classes.map((c) => (
              <li key={c.id} className="list-group-item">
                <div className="fw-semibold">{c.className} • Capacity {c.capacity}</div>
                <p className="mb-0 text-muted">Level {c.classLevel}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === 3 && (
          <ul className="list-group">
            {subjects.map((s) => (
              <li key={s.id} className="list-group-item">
                <div className="fw-semibold">{s.subjectName} ({s.subjectCode})</div>
                <p className="mb-0 text-muted">{s.subjectType}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === 4 && (
          <ul className="list-group">
            {assignments.map((a) => (
              <li key={a.id} className="list-group-item">
                <div className="fw-semibold">{a.teacherName} • {a.weeklyPeriodCount} periods/week</div>
                <p className="mb-0 text-muted">class {a.classId} • section {a.sectionId}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === 5 && (
          <ul className="list-group">
            {timetable.map((t) => (
              <li key={t.id} className="list-group-item">
                <div className="fw-semibold">{t.day} {t.startTime}-{t.endTime}</div>
                <p className="mb-0 text-muted">Class {t.classId}, Section {t.sectionId}, Subject {t.subjectId}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === 6 && (
          <ul className="list-group">
            {events.map((e) => (
              <li key={e.id} className="list-group-item">
                <div className="fw-semibold">{e.title}</div>
                <p className="mb-0 text-muted">{e.date} • {e.type}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === 7 && <div className="alert alert-info">Curriculum planning, syllabus tracking, topic completion and learning outcomes are implementation placeholders.</div>}
        {tab === 8 && <div className="alert alert-info">Homework assignment, submission tracking, due dates and attachments are implementation placeholders.</div>}
      </div>
    </div>
  );
}
