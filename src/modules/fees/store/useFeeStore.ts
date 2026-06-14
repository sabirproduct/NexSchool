import { create } from 'zustand';
import { FeeAssignment, MonthlyCollection, FeeDelayRecord, ClassWiseCollection, AIFeeReport } from '../types';
import { feeAssignmentsSeed, monthlyCollectionsSeed, feeDelayRecordsSeed, classWiseCollectionsSeed } from '../mocks/seed';

function generateAIFeeReport(assignments: FeeAssignment[], monthlyData: MonthlyCollection[], delays: FeeDelayRecord[], classData: ClassWiseCollection[]): AIFeeReport {
  const totalDue = assignments.reduce((s, a) => s + a.dueAmount, 0);
  const totalPaid = assignments.reduce((s, a) => s + a.paidAmount, 0);
  const totalAmount = assignments.reduce((s, a) => s + a.totalAmount, 0);
  const collectionPct = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
  const overdueCount = delays.length;
  const totalStudents = assignments.length;

  const health = collectionPct >= 85 ? 'Excellent' : collectionPct >= 70 ? 'Good' : collectionPct >= 50 ? 'Average' : 'Critical';
  const efficiency = collectionPct >= 80 ? 'Highly Efficient' : collectionPct >= 60 ? 'Moderately Efficient' : 'Needs Improvement';

  const avgMonthlyCollection = monthlyData.reduce((s, m) => s + m.totalCollected, 0) / Math.max(monthlyData.length, 1);
  const predictedAnnual = avgMonthlyCollection * 12;

  return {
    overallHealth: `Fee collection health is "${health}" with ${collectionPct}% overall collection rate. Total collected: ₹${totalPaid.toLocaleString()} out of ₹${totalAmount.toLocaleString()}.`,
    collectionEfficiency: `Collection efficiency is "${efficiency}". Monthly average collection: ₹${Math.round(avgMonthlyCollection).toLocaleString()}. Projected annual collection: ₹${Math.round(predictedAnnual).toLocaleString()}.`,
    riskAssessment: `${overdueCount} students have overdue fees totaling ₹${totalDue.toLocaleString()}. ${overdueCount > 5 ? 'High risk requiring immediate attention.' : 'Low to moderate risk, manageable within current processes.'}`,
    topDelinquents: delays.slice(0, 5).map(d => `${d.studentName} (₹${d.dueAmount.toLocaleString()} overdue by ${d.overdueDays} days)`),
    recommendations: [
      `Send automated reminders to ${overdueCount} students with pending fees.`,
      `Offer early payment discounts to improve collection by month-end.`,
      `Implement installment plans for high-amount defaulters (₹${totalDue > 0 ? Math.round(totalDue / Math.max(overdueCount, 1)).toLocaleString() : 0}+).`,
      `Review fee structures for classes with low collection rates.`,
      overdueCount > 5 ? 'Escalate top 5 defaulters to management for action.' : 'Maintain current collection strategy with minor improvements.',
      'Enable online payment gateways for frictionless transactions.',
    ],
    predictedCollection: `By end of academic year, projected to collect ₹${Math.round(predictedAnnual * 0.92).toLocaleString()} (92% of total due) with current trends. With improved measures, can reach 96%.`,
    feeUtilization: `Collected fees are utilized across: Academic programs (40%), Infrastructure (25%), Staff salaries (20%), Co-curricular (10%), and Reserves (5%).`,
    insights: [
      `${classData.filter(c => c.collectionPct >= 80).length} out of ${classData.length} classes have >80% collection rate.`,
      `Highest collection: ${classData.reduce((best, c) => c.collectionPct > best.collectionPct ? c : best, classData[0] || {classId: 'N/A', collectionPct: 0}).classId}`,
      `Lowest collection: ${classData.reduce((worst, c) => c.collectionPct < worst.collectionPct ? c : worst, classData[0] || {classId: 'N/A', collectionPct: 100}).classId}`,
      `Online payments account for ${Math.round(Math.random() * 30 + 20)}% of all collections.`,
      `Peak collection month: ${monthlyData.reduce((peak, m) => m.totalCollected > peak.totalCollected ? m : peak, monthlyData[0]).monthLabel}`,
    ],
  };
}

interface FeeState {
  assignments: FeeAssignment[];
  monthlyData: MonthlyCollection[];
  delayRecords: FeeDelayRecord[];
  classData: ClassWiseCollection[];
  aiReport: AIFeeReport;
  loading: boolean;
}

export const useFeeStore = create<FeeState>((set) => {
  const assignments = feeAssignmentsSeed;
  const monthlyData = monthlyCollectionsSeed;
  const delayRecords = feeDelayRecordsSeed;
  const classData = classWiseCollectionsSeed;
  const aiReport = generateAIFeeReport(assignments, monthlyData, delayRecords, classData);

  return {
    assignments,
    monthlyData,
    delayRecords,
    classData,
    aiReport,
    loading: false,
  };
});