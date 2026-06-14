import { StudentResult } from '../types';
import { GradeBadge } from './GradeBadge';

interface ResultCardProps {
  result: StudentResult;
  onViewAI?: (result: StudentResult) => void;
  onPrint?: (result: StudentResult) => void;
}

export function ResultCard({ result, onViewAI, onPrint }: ResultCardProps) {
  const passColor = result.percentage >= 33 ? 'from-emerald-500 to-green-600' : 'from-red-500 to-rose-600';

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header gradient */}
      <div className={`bg-gradient-to-r ${passColor} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="font-bold text-lg leading-tight">{result.studentName}</h3>
            <p className="text-white/80 text-sm mt-0.5">Roll: {result.studentId}</p>
          </div>
          <GradeBadge grade={result.finalGrade} size="lg" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Score ring */}
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={result.percentage >= 33 ? '#10b981' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={`${(result.percentage / 100) * 283} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-xl font-bold text-gray-900">{result.percentage.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium">Obtained</p>
            <p className="text-sm font-bold text-gray-900">{result.obtainedMarks}/{result.totalMarks}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium">GPA</p>
            <p className="text-sm font-bold text-gray-900">{result.gpa.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium">Class Rank</p>
            <p className="text-sm font-bold text-gray-900">#{result.classRank}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium">Section Rank</p>
            <p className="text-sm font-bold text-gray-900">#{result.sectionRank}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            result.status === 'Published'
              ? 'bg-emerald-50 text-emerald-700'
              : result.status === 'Locked'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              result.status === 'Published' ? 'bg-emerald-500' : result.status === 'Locked' ? 'bg-blue-500' : 'bg-gray-400'
            }`} />
            {result.status}
          </span>

          <div className="flex gap-2">
            {result.status === 'Published' && (
              <>
                {onPrint && (
                  <button
                    onClick={() => onPrint(result)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Print Report Card"
                  >
                    🖨️ Print
                  </button>
                )}
                {onViewAI && (
                  <button
                    onClick={() => onViewAI(result)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg shadow-md shadow-purple-200 transition-all"
                    title="View AI Analysis"
                  >
                    🤖 AI Report
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {result.publishedAt && (
          <p className="text-xs text-gray-400 text-center">
            Published: {new Date(result.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}