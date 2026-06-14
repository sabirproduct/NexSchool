import { ExamModuleView } from '../components/ExamModuleView';
import { GPAChart } from '../components/GPAChart';
import { ReportCardGenerator } from '../components/ReportCardGenerator';

export function ExaminationManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📝 Examination & Result Management</h1>
            <p className="text-white/80 mt-1 text-sm">Manage exams, schedules, marks, results & AI-powered analytics</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
            <span className="text-lg">🎓</span>
            <span className="text-sm font-medium">Session 2026-27</span>
          </div>
        </div>
      </div>

      {/* GPA Trend */}
      <GPAChart data={[
        { exam: 'Unit Test 1', gpa: 7.2 },
        { exam: 'Quarterly', gpa: 8.1 },
        { exam: 'Half Yearly', gpa: 8.5 },
      ]} />

      {/* Main Module View */}
      <ExamModuleView />

      {/* Report Card Generator */}
      <ReportCardGenerator />
    </div>
  );
}