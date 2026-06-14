import { useMemo } from 'react';
import { useExamStore } from '../store/useExamStore';

export function ExamScheduler() {
  const { schedules, exams } = useExamStore();

  const groupedByExam = useMemo(() => {
    return exams.map(exam => ({
      ...exam,
      slots: schedules.filter(s => s.examId === exam.id),
    }));
  }, [exams, schedules]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📅 Exam Schedule</h3>
            <p className="text-sm text-gray-500 mt-0.5">{schedules.length} scheduled slots</p>
          </div>
        </div>

        <div className="space-y-3">
          {groupedByExam.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No schedules available</p>
          ) : (
            groupedByExam.map(exam => (
              <div key={exam.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">{exam.examName}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    exam.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    exam.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {exam.status}
                  </span>
                </div>

                {exam.slots.length === 0 ? (
                  <p className="text-xs text-gray-400">No slots scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {exam.slots.map(slot => (
                      <div key={slot.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-sm font-bold text-indigo-600 border border-indigo-100">
                            {slot.subjectName.slice(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{slot.subjectName}</p>
                            <p className="text-xs text-gray-500">
                              Class {slot.classId}-{slot.sectionId} • Room {slot.roomCode || 'TBD'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(slot.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                          <p className="text-xs font-semibold text-gray-700">{slot.startTime} - {slot.endTime}</p>
                          <p className="text-xs text-gray-400">{slot.maximumMarks}/{slot.passingMarks}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}