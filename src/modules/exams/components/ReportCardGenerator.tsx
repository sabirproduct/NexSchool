import { useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { AIReportCard } from './AIReportCard';
import { StudentResult } from '../types';

export function ReportCardGenerator() {
  const { results, marks, exams } = useExamStore();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [showAIReport, setShowAIReport] = useState(false);

  const publishedExams = exams.filter(e => e.status === 'Published');

  const availableResults = results.filter(r => r.status === 'Published');

  const filteredResults = availableResults.filter(r => {
    if (selectedExam && r.examId !== selectedExam) return false;
    if (selectedStudent && r.studentId !== selectedStudent) return false;
    return true;
  });

  const handleGenerateAI = () => {
    if (filteredResults.length > 0) {
      setShowAIReport(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📄 Report Card Generator</h3>
            <p className="text-sm text-gray-500 mt-0.5">Generate AI-powered report cards with detailed analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Exam</label>
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            >
              <option value="">All Exams</option>
              {publishedExams.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.examName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Student</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            >
              <option value="">All Students</option>
              {[...new Set(availableResults.map(r => r.studentId))].map(id => {
                const student = availableResults.find(r => r.studentId === id);
                return (
                  <option key={id} value={id}>{student?.studentName}</option>
                );
              })}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleGenerateAI}
              disabled={filteredResults.length === 0}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>🤖</span>
              Generate AI Report ({filteredResults.length})
            </button>
          </div>
        </div>

        {filteredResults.length > 0 && (
          <div className="text-xs text-gray-400 text-center mt-2">
            {filteredResults.length} result(s) selected for report generation
          </div>
        )}
      </div>

      {/* AI Report Modal */}
      {showAIReport && filteredResults.length > 0 && (
        <AIReportCard
          result={filteredResults[0]}
          marks={marks.filter(m => m.examId === (selectedExam || filteredResults[0].examId))}
          onClose={() => setShowAIReport(false)}
        />
      )}
    </div>
  );
}