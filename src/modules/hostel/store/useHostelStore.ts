import { create } from 'zustand';
import { HostelBlock, HostelRoom, HostelBed, HostelAllocation, MessMenu, HostelComplaint, MonthlyOccupancy, BlockWiseOccupancy, AIHostelReport } from '../types';
import { hostelBlocksSeed, hostelRoomsSeed, hostelBedsSeed, hostelAllocationsSeed, messMenuSeed, hostelComplaintsSeed, monthlyOccupancySeed, blockWiseOccupancySeed } from '../mocks/seed';

function generateAIHostelReport(
  blocks: HostelBlock[],
  monthlyData: MonthlyOccupancy[],
  complaints: HostelComplaint[],
  blockData: BlockWiseOccupancy[],
  totalBeds: number,
  occupiedBeds: number,
): AIHostelReport {
  const overallPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const avgMonthlyOccupancy = monthlyData.reduce((s, m) => s + m.occupancyPct, 0) / Math.max(monthlyData.length, 1);
  const totalRevenue = occupiedBeds * 5000 * 10; // avg rent 5000 * 10 months
  const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const resolutionRate = complaints.length > 0 ? Math.round((resolvedComplaints / complaints.length) * 100) : 0;

  const topComplaintCategories = ['Maintenance', 'Cleanliness', 'Food', 'Electricity', 'Plumbing'];
  const categoryCounts = topComplaintCategories.map(cat =>
    complaints.filter(c => c.category === cat).length
  );

  return {
    overallOccupancy: `Hostel occupancy stands at ${overallPct}% with ${occupiedBeds} out of ${totalBeds} beds occupied across ${blocks.length} blocks. ${overallPct >= 80 ? 'Healthy occupancy levels maintained.' : 'Room for improving occupancy rates.'}`,
    occupancyTrend: `Monthly average occupancy is ${Math.round(avgMonthlyOccupancy)}%. ${avgMonthlyOccupancy >= 75 ? 'Consistent occupancy trend throughout the academic year.' : 'Occupancy shows seasonal variation, peaking mid-academic year.'}`,
    complaintAnalysis: `${complaints.length} total complaints filed. ${openComplaints} pending resolution (${openComplaints > 0 ? Math.round((openComplaints / complaints.length) * 100) : 0}% open). Resolution rate: ${resolutionRate}%. Average resolution time: ${resolutionRate >= 70 ? 'within 3-5 days.' : 'needs improvement.'}`,
    topComplaints: complaints
      .filter(c => c.status !== 'Closed')
      .slice(0, 5)
      .map(c => `${c.subject} (${c.blockName}, ${c.priority} priority)`),
    revenueAnalysis: `Estimated annual hostel revenue: ₹${totalRevenue.toLocaleString()} from ${occupiedBeds} occupied beds. Average revenue per bed: ₹${(totalRevenue / Math.max(occupiedBeds, 1)).toLocaleString()}. Deposit collections: ₹${(occupiedBeds * 10000).toLocaleString()}.`,
    recommendations: [
      overallPct < 75 ? 'Launch awareness campaigns to fill vacant beds in underutilized blocks.' : 'Maintain current occupancy levels with periodic facility upgrades.',
      openComplaints > 5 ? 'Establish a faster complaint redressal mechanism. Target 48-hour resolution for critical issues.' : 'Continue efficient complaint management. Conduct preventive maintenance to minimize issues.',
      'Schedule monthly pest control and deep cleaning across all blocks.',
      `Upgrade amenities in blocks with lower occupancy to attract more students.`,
      'Implement digital mess feedback system to track food quality and preferences.',
      'Conduct quarterly fire safety and security audits.',
      resolutionRate < 70 ? 'Assign dedicated staff for complaint follow-up and escalation.' : 'Maintain current resolution standards with periodic staff training.',
    ],
    insights: [
      `${blockData.filter(b => b.occupancyPct >= 80).length} out of ${blockData.length} blocks have >80% occupancy.`,
      `Highest occupancy: ${blockData.reduce((best, b) => b.occupancyPct > best.occupancyPct ? b : best, blockData[0] || { blockName: 'N/A', occupancyPct: 0 }).blockName} (${Math.max(...blockData.map(b => b.occupancyPct))}%)`,
      `Lowest occupancy: ${blockData.reduce((worst, b) => b.occupancyPct < worst.occupancyPct ? b : worst, blockData[0] || { blockName: 'N/A', occupancyPct: 100 }).blockName} (${Math.min(...blockData.map(b => b.occupancyPct))}%)`,
      `Complaint category breakdown: ${topComplaintCategories.map((cat, i) => `${cat}: ${categoryCounts[i]}`).join(', ')}`,
      `Peak occupancy month: ${monthlyData.reduce((peak, m) => m.occupancyPct > peak.occupancyPct ? m : peak, monthlyData[0]).monthLabel}`,
      `${blocks.filter(b => b.amenities.includes('Gym')).length} blocks have gym facilities. ${blocks.filter(b => b.amenities.includes('Library')).length} blocks have library access.`,
    ],
  };
}

interface HostelState {
  blocks: HostelBlock[];
  rooms: HostelRoom[];
  beds: HostelBed[];
  allocations: HostelAllocation[];
  messMenu: MessMenu[];
  complaints: HostelComplaint[];
  monthlyOccupancy: MonthlyOccupancy[];
  blockOccupancy: BlockWiseOccupancy[];
  aiReport: AIHostelReport;
  loading: boolean;
  totalBeds: number;
  occupiedBeds: number;
}

export const useHostelStore = create<HostelState>((set) => {
  const blocks = hostelBlocksSeed;
  const rooms = hostelRoomsSeed;
  const beds = hostelBedsSeed;
  const allocations = hostelAllocationsSeed;
  const messMenu = messMenuSeed;
  const complaints = hostelComplaintsSeed;
  const monthlyOccupancy = monthlyOccupancySeed;
  const blockOccupancy = blockWiseOccupancySeed;
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const aiReport = generateAIHostelReport(blocks, monthlyOccupancy, complaints, blockOccupancy, totalBeds, occupiedBeds);

  return {
    blocks,
    rooms,
    beds,
    allocations,
    messMenu,
    complaints,
    monthlyOccupancy,
    blockOccupancy,
    aiReport,
    loading: false,
    totalBeds,
    occupiedBeds,
  };
});
