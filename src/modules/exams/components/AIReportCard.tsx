import { useMemo, useRef, useState } from 'react';
import { StudentResult, MarkEntry } from '../types';
import { GradeBadge } from './GradeBadge';

interface AIReportCardProps {
  result: StudentResult;
  marks: MarkEntry[];
  onClose: () => void;
}

// AI analysis generator based on actual student marks data
function generateAIAnalysis(result: StudentResult, marks: MarkEntry[]): {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  subjectAnalysis: { subject: string; score: number; maxMarks: number; status: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement'; remark: string }[];
  predictedGrade: string;
  studyTips: string[];
} {
  const studentMarks = marks.filter(m => m.studentId === result.studentId);

  const subjectAnalysis = studentMarks.map(m => {
    const pct = (m.obtainedMarks / m.maximumMarks) * 100;
    let status: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
    let remark: string;

    if (pct >= 80) {
      status = 'Excellent';
      remark = 'Outstanding performance. Strong command over the subject.';
    } else if (pct >= 65) {
      status = 'Good';
      remark = 'Good understanding. Consistent performance with room for excellence.';
    } else if (pct >= 45) {
      status = 'Average';
      remark = 'Satisfactory performance. Focus on key concepts to improve.';
    } else {
      status = 'Needs Improvement';
      remark = 'Requires significant attention. Consider extra tutoring.';
    }

    return { subject: m.subjectName, score: m.obtainedMarks, maxMarks: m.maximumMarks, status, remark };
  });

  const strengths = subjectAnalysis
    .filter(s => s.status === 'Excellent' || s.status === 'Good')
    .map(s => `${s.subject}: ${s.remark}`);

  const weaknesses = subjectAnalysis
    .filter(s => s.status === 'Needs Improvement' || s.status === 'Average')
    .map(s => `${s.subject}: ${s.remark}`);

  if (strengths.length === 0) strengths.push('Need to identify areas of improvement through consistent effort.');
  if (weaknesses.length === 0) weaknesses.push('Keep up the good work! Maintain consistency across all subjects.');

  const overallAssessment = result.percentage >= 75
    ? `${result.studentName} has demonstrated excellent academic performance with an overall score of ${result.percentage}%. The student shows strong command across most subjects and is on track for exceptional results. Continue nurturing the strengths while maintaining balance across all subjects.`
    : result.percentage >= 60
    ? `${result.studentName} has shown a commendable performance with ${result.percentage}% overall score. There is a solid foundation in most subjects. With focused effort on weaker areas, the student can achieve higher grades.`
    : result.percentage >= 45
    ? `${result.studentName} has achieved a satisfactory performance at ${result.percentage}%. While there is understanding of core concepts, significant improvement is needed in several subjects. A structured study plan is recommended.`
    : `${result.studentName} needs substantial improvement with current performance at ${result.percentage}%. Immediate intervention with focused tutoring and parental guidance is recommended to bring the academics back on track.`;

  const recommendations = [
    ...subjectAnalysis
      .filter(s => s.status !== 'Excellent')
      .slice(0, 3)
      .map(s => `Focus on improving ${s.subject} through regular practice and revision.`),
    'Create a consistent daily study schedule with dedicated time for each subject.',
    'Practice previous years\' question papers to understand exam patterns.',
    'Maintain a separate notebook for difficult concepts and review them weekly.',
    result.percentage < 60 ? 'Consider joining extra coaching classes for weak subjects.' : 'Continue participating in class discussions and group studies.',
  ];

  const predictedGrade = result.percentage >= 90 ? 'A+ (Outstanding)' :
    result.percentage >= 80 ? 'A (Excellent)' :
    result.percentage >= 70 ? 'B+ (Very Good)' :
    result.percentage >= 60 ? 'B (Good)' :
    result.percentage >= 50 ? 'C (Satisfactory)' :
    result.percentage >= 40 ? 'D (Below Average)' : 'F (Needs Improvement)';

  const studyTips = [
    'Follow the Pomodoro technique: 25 min study, 5 min break',
    'Use mind maps and flowcharts for complex topics',
    'Teach concepts to someone else to reinforce learning',
    'Take regular notes in your own words',
    'Review and revise within 24 hours of learning new material',
    'Stay consistent rather than cramming at the last minute',
  ];

  return { overallAssessment, strengths, weaknesses, recommendations, subjectAnalysis, predictedGrade, studyTips };
}

export function AIReportCard({ result, marks, onClose }: AIReportCardProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const analysis = useMemo(() => generateAIAnalysis(result, marks), [result, marks]);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      // Dynamically import jspdf and html2canvas only when printing
      const [jspdfModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);
      const jsPDF = jspdfModule.default;
      const html2canvas = html2canvasModule.default;

      const element = reportRef.current;
      if (!element) return;

      // Temporarily make it visible for capture
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.zIndex = '99999';
      element.style.width = '800px';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.zIndex = '';
      element.style.width = '';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ReportCard_${result.studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback: use browser print
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Average': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getScoreBarColor = (pct: number) => {
    if (pct >= 80) return 'bg-gradient-to-r from-emerald-400 to-green-500';
    if (pct >= 65) return 'bg-gradient-to-r from-blue-400 to-indigo-500';
    if (pct >= 45) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI Report Card</h2>
              <p className="text-sm text-gray-500">AI-powered academic analysis & improvement plan</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isPrinting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <span>📄</span>
                  Download PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="p-6 space-y-6 bg-white">
          {/* Student Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{result.studentName}</h3>
                <p className="text-white/80 mt-1">Student ID: {result.studentId}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{result.percentage.toFixed(1)}%</p>
                <p className="text-white/80 text-sm">Overall Score</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-white/70 text-xs">GPA</p>
                <p className="font-bold">{result.gpa.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Grade</p>
                <p className="font-bold">{result.finalGrade}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Class Rank</p>
                <p className="font-bold">#{result.classRank}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Total</p>
                <p className="font-bold">{result.obtainedMarks}/{result.totalMarks}</p>
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📋</span>
              <h4 className="font-bold text-gray-900">AI Overall Assessment</h4>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{analysis.overallAssessment}</p>
          </div>

          {/* Subject-wise Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📊</span>
              <h4 className="font-bold text-gray-900">Subject-wise Performance Analysis</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.subjectAnalysis.map(sub => {
                const pct = (sub.score / sub.maxMarks) * 100;
                return (
                  <div key={sub.subject} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{sub.subject}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${getScoreBarColor(pct)}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{sub.score}/{sub.maxMarks}</span>
                    </div>
                    <p className="text-xs text-gray-500">{sub.remark}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💪</span>
                <h4 className="font-bold text-gray-900">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎯</span>
                <h4 className="font-bold text-gray-900">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-amber-500 mt-0.5">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📌</span>
              <h4 className="font-bold text-gray-900">AI Recommendations</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Predicted Grade & Study Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎯</span>
                <h4 className="font-bold text-gray-900">Predicted Grade Potential</h4>
              </div>
              <p className="text-lg font-bold text-violet-700">{analysis.predictedGrade}</p>
              <p className="text-xs text-gray-500 mt-1">Based on current performance trends and improvement areas</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📚</span>
                <h4 className="font-bold text-gray-900">Smart Study Tips</h4>
              </div>
              <ul className="space-y-1.5">
                {analysis.studyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-rose-400">✦</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Report generated by NexSchool AI • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              This AI analysis is based on academic performance data and is intended for guidance purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}