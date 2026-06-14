import { HostelBlock, HostelRoom, HostelBed, HostelAllocation, MessMenu, HostelComplaint, MonthlyOccupancy, BlockWiseOccupancy, RoomType } from '../types';

// ── Hostel Blocks ──────────────────────────────────────────────
export const hostelBlocksSeed: HostelBlock[] = [
  { id: 'BLK-001', blockName: 'Aryabhatta Bhavan', gender: 'Boys', wardenName: 'Dr. Rajesh Kumar', wardenContact: '9876543210', totalRooms: 40, totalCapacity: 120, currentOccupancy: 98, caretakerName: 'Mohan Singh', caretakerContact: '9876543211', address: 'Main Campus, North Wing', amenities: ['WiFi', 'Common Room', 'Laundry', 'Water Purifier', 'CCTV', 'Library'] },
  { id: 'BLK-002', blockName: 'Vikramshila Nilayam', gender: 'Boys', wardenName: 'Prof. Amit Verma', wardenContact: '9876543212', totalRooms: 35, totalCapacity: 105, currentOccupancy: 85, caretakerName: 'Suresh Yadav', caretakerContact: '9876543213', address: 'Main Campus, South Wing', amenities: ['WiFi', 'Common Room', 'Laundry', 'Water Purifier', 'CCTV', 'Gym'] },
  { id: 'BLK-003', blockName: 'Nalanda Vihar', gender: 'Girls', wardenName: 'Dr. Priya Sharma', wardenContact: '9876543214', totalRooms: 30, totalCapacity: 90, currentOccupancy: 88, caretakerName: 'Laxmi Devi', caretakerContact: '9876543215', address: 'East Campus, Block A', amenities: ['WiFi', 'Common Room', 'Laundry', 'Water Purifier', 'CCTV', 'Library', 'Gym'] },
  { id: 'BLK-004', blockName: 'Takshila Sadan', gender: 'Girls', wardenName: 'Dr. Ananya Gupta', wardenContact: '9876543216', totalRooms: 25, totalCapacity: 75, currentOccupancy: 72, caretakerName: 'Geeta Rajan', caretakerContact: '9876543217', address: 'East Campus, Block B', amenities: ['WiFi', 'Common Room', 'Laundry', 'Water Purifier', 'CCTV', 'Music Room'] },
  { id: 'BLK-005', blockName: 'Chanakya Cottages', gender: 'Boys', wardenName: 'Prof. Vikram Singh', wardenContact: '9876543218', totalRooms: 20, totalCapacity: 40, currentOccupancy: 38, caretakerName: 'Ramesh Patel', caretakerContact: '9876543219', address: 'West Campus', amenities: ['WiFi', 'Common Room', 'Laundry', 'Water Purifier', 'CCTV', 'Parking', 'Kitchen'] },
];

// ── Rooms ──────────────────────────────────────────────────────
const floors: ('Ground' | 'First' | 'Second' | 'Third' | 'Fourth')[] = ['Ground', 'First', 'Second', 'Third', 'Fourth'];

function generateRoomsForBlock(block: HostelBlock): HostelRoom[] {
  const rooms: HostelRoom[] = [];
  const roomTypes: RoomType[] = block.blockName === 'Chanakya Cottages' ? ['Single'] : ['Twin Sharing', 'Triple Sharing', 'Dormitory'];
  const bedsPerType: Record<RoomType, number> = { 'Single': 1, 'Twin Sharing': 2, 'Triple Sharing': 3, 'Dormitory': 6 };
  let roomCounter = 1;

  for (const floor of floors) {
    const roomsPerFloor = Math.floor(block.totalRooms / floors.length);
    for (let i = 0; i < roomsPerFloor && roomCounter <= block.totalRooms; i++) {
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const totalBeds = bedsPerType[roomType];
      const occupiedBeds = Math.floor(Math.random() * (totalBeds + 1));
      const prefix = block.gender === 'Boys' ? 'B' : 'G';
      const floorCode = floor === 'Ground' ? 'G' : floor === 'First' ? '1' : floor === 'Second' ? '2' : floor === 'Third' ? '3' : '4';

      rooms.push({
        id: `RM-${block.id}-${String(roomCounter).padStart(3, '0')}`,
        blockId: block.id,
        roomNumber: `${prefix}-${floorCode}-${String(roomCounter).padStart(3, '0')}`,
        floor,
        roomType,
        totalBeds,
        occupiedBeds,
        isActive: true,
        rentPerBed: roomType === 'Single' ? 8000 : roomType === 'Twin Sharing' ? 6000 : roomType === 'Triple Sharing' ? 4500 : 3500,
        description: `${block.blockName} - ${roomType} Room`,
      });
      roomCounter++;
    }
  }
  return rooms;
}

// Generate all rooms
export const hostelRoomsSeed: HostelRoom[] = hostelBlocksSeed.flatMap(generateRoomsForBlock);

// ── Beds & Allocations ─────────────────────────────────────────
const studentNames = ['Aarav Sharma', 'Vivaan Singh', 'Aditya Patel', 'Vihaan Verma', 'Arjun Gupta', 'Reyansh Kumar', 'Ayaan Joshi', 'Ishaan Roy', 'Shaurya Das', 'Rudra Sen',
  'Ananya Reddy', 'Diya Kapoor', 'Sara Khan', 'Myra Malhotra', 'Siya Choudhury', 'Aadhya Nair', 'Paridhi Saxena', 'Anika Bose', 'Navya Menon', 'Prisha Iyer',
  'Kabir Bhat', 'Dhruv Saxena', 'Arnav Rao', 'Veer Desai', 'Aryan Pillai', 'Yash Mehra', 'Sai Krishna', 'Rohan Bajaj', 'Tanishq Nair', 'Krishna Reddy',
  'Ira Banerjee', 'Tara Mehta', 'Riya Agarwal', 'Shanaya Tiwari', 'Kyra Bhatt', 'Aarushi Kaur', 'Nisha Rajan', 'Ishita Kulkarni', 'Riddhi Joshi', 'Sanvi Shetty'];

const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const sections = ['A', 'B', 'C'];

function randomElement<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

export const hostelBedsSeed: HostelBed[] = [];
export const hostelAllocationsSeed: HostelAllocation[] = [];

let bedCounter = 0;
let allocCounter = 0;
let studentIdx = 0;

for (const room of hostelRoomsSeed) {
  const block = hostelBlocksSeed.find(b => b.id === room.blockId)!;
  for (let b = 0; b < room.totalBeds; b++) {
    bedCounter++;
    const bedLabel = `${room.roomNumber}-B${String(b + 1).padStart(2, '0')}`;
    const isOccupied = b < room.occupiedBeds && studentIdx < studentNames.length;

    const bed: HostelBed = {
      id: `BED-${String(bedCounter).padStart(5, '0')}`,
      roomId: room.id,
      blockId: room.blockId,
      bedLabel,
      status: isOccupied ? 'Occupied' : 'Available',
      monthlyRent: room.rentPerBed,
    };

    if (isOccupied) {
      const studentName = studentNames[studentIdx];
      const classId = classes[studentIdx % classes.length];
      const sectionId = sections[studentIdx % sections.length];
      const monthsOccupied = randomInt(1, 9);
      const allocDate = new Date(2025, 3 + randomInt(0, 6), randomInt(1, 28)); // Apr-Oct 2025

      bed.allocatedTo = `STU-${String(studentIdx + 1).padStart(4, '0')}`;
      bed.allocatedStudentName = studentName;
      bed.allocationDate = allocDate.toISOString().split('T')[0];

      hostelAllocationsSeed.push({
        id: `HALLOC-${String(++allocCounter).padStart(4, '0')}`,
        studentId: bed.allocatedTo,
        studentName,
        rollNumber: String(studentIdx + 1),
        classId,
        sectionId,
        blockId: room.blockId,
        roomId: room.id,
        bedId: bed.id,
        roomNumber: room.roomNumber,
        blockName: block.blockName,
        allocationDate: bed.allocationDate,
        isActive: true,
        monthlyRent: room.rentPerBed,
        depositPaid: room.rentPerBed * 2,
        remarks: '',
      });

      studentIdx++;
    }

    hostelBedsSeed.push(bed);
  }
}

export const totalStudentsInHostel = studentIdx;

// ── Mess Menu ──────────────────────────────────────────────────
const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const meals: { mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'; startTime: string; endTime: string }[] = [
  { mealType: 'Breakfast', startTime: '07:00', endTime: '08:30' },
  { mealType: 'Lunch', startTime: '12:00', endTime: '13:30' },
  { mealType: 'Snacks', startTime: '16:30', endTime: '17:00' },
  { mealType: 'Dinner', startTime: '19:30', endTime: '21:00' },
];

const breakfastItems = ['Aloo Paratha + Curd', 'Poha + Jalebi', 'Idli + Sambar', 'Chole Bhature', 'Masala Dosa', 'Upma + Coconut Chutney', 'Bread Pakora + Chai', 'Veg Cutlet + Bread', 'Puri Bhaji', 'Sandwich + Juice'];
const lunchItems = ['Dal Tadka + Rice + Roti + Salad', 'Rajma Chawal + Achar', 'Chole + Rice + Roti + Onion', 'Kadhai Paneer + Naan', 'Veg Biryani + Raita', 'Dal Makhani + Roti', 'Mix Veg + Dal + Rice', 'Sambar Rice + Papad', 'Pasta + Garlic Bread', 'Pulao + Raita + Boondi'];
const snacksItems = ['Samosa + Chutney', 'Pakora + Chai', 'French Fries', 'Vada Pav', 'Bhel Puri', 'Pav Bhaji', 'Biscuit + Tea', 'Maggie', 'Bread Butter + Coffee', 'Bhutta'];
const dinnerItems = ['Paneer Butter Masala + Roti + Rice', 'Dal Fry + Jeera Rice', 'Mix Veg + Dal + Roti', 'Chicken Curry + Rice (Non-Veg Day)', 'Soya Chaap + Naan', 'Veg Kofta + Roti', 'Matar Paneer + Laccha Paratha', 'Dal Tadka + Steamed Rice', 'Palak Paneer + Roti', 'Chana Masala + Rice + Papad'];

export const messMenuSeed: MessMenu[] = [];
days.forEach((day, dayIdx) => {
  meals.forEach((meal, mealIdx) => {
    const itemPool = meal.mealType === 'Breakfast' ? breakfastItems : meal.mealType === 'Lunch' ? lunchItems : meal.mealType === 'Snacks' ? snacksItems : dinnerItems;
    const items = [itemPool[(dayIdx * 3 + mealIdx) % itemPool.length]];
    if (Math.random() > 0.5) items.push(itemPool[(dayIdx * 3 + mealIdx + 3) % itemPool.length]);

    messMenuSeed.push({
      id: `MENU-${day.slice(0, 3).toUpperCase()}-${meal.mealType.slice(0, 3).toUpperCase()}`,
      day,
      mealType: meal.mealType,
      items,
      startTime: meal.startTime,
      endTime: meal.endTime,
      isActive: true,
    });
  });
});

// ── Complaints ─────────────────────────────────────────────────
const complaintCategories: ('Maintenance' | 'Cleanliness' | 'Food' | 'Electricity' | 'Plumbing' | 'Furniture' | 'Security' | 'Other')[] = ['Maintenance', 'Cleanliness', 'Food', 'Electricity', 'Plumbing', 'Furniture', 'Security', 'Other'];
const complaintSubjects = [
  'AC not working in room', 'Leaking tap in bathroom', 'Broken window latch', 'Room light flickering', 'Bed frame broken',
  'Water seepage from ceiling', 'Fan speed regulator not working', 'Toilet flush not working', 'Cockroach infestation',
  'Food quality issues in mess', 'Geyser not heating water', 'Door lock broken', 'Wardrobe handle broken', 'Cracked wall mirror',
  'Mosquito problem in corridor', 'Staircase light not working', 'Water cooler not dispensing cold water', 'Pest control needed',
  'Common room TV not working', 'Garbage not collected for 2 days', 'Almirah door jammed', 'Window curtain torn',
  'Power socket not working', 'Table lamp fuse blown', 'No hot water in morning',
];

export const hostelComplaintsSeed: HostelComplaint[] = [];

const complaintStatuses: ('Open' | 'In Progress' | 'Resolved' | 'Closed')[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

const resolvedStudents = hostelAllocationsSeed.filter(() => Math.random() > 0.3);
resolvedStudents.slice(0, 25).forEach((alloc, idx) => {
  const category = complaintCategories[idx % complaintCategories.length];
  const priority: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const p = priority[idx % priority.length];
  const daysAgo = randomInt(1, 60);
  const filedDate = new Date(2025, 3 + randomInt(0, 7), randomInt(1, 28));
  const status = complaintStatuses[Math.min(idx % complaintStatuses.length, 3)];
  const resolvedDate = status === 'Resolved' || status === 'Closed' ? new Date(filedDate.getTime() + randomInt(1, 10) * 86400000).toISOString().split('T')[0] : undefined;

  hostelComplaintsSeed.push({
    id: `CMP-${String(idx + 1).padStart(4, '0')}`,
    studentId: alloc.studentId,
    studentName: alloc.studentName,
    roomNumber: alloc.roomNumber,
    blockName: alloc.blockName,
    category,
    priority: p,
    status,
    subject: complaintSubjects[idx % complaintSubjects.length],
    description: `Complaint regarding ${category.toLowerCase()}: ${complaintSubjects[idx % complaintSubjects.length].toLowerCase()}. Need urgent attention and resolution.`,
    filedDate: filedDate.toISOString().split('T')[0],
    resolvedDate,
    resolvedBy: resolvedDate ? (['Rajesh Kumar', 'Suresh Yadav', 'Mohan Singh', 'Ramesh Patel'])[idx % 4] : undefined,
    remarks: status === 'Resolved' ? 'Issue fixed. Verified by warden.' : status === 'Closed' ? 'Resolved and closed.' : 'Pending investigation.',
  });
});

// ── Occupancy Analytics ────────────────────────────────────────
const monthLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export const monthlyOccupancySeed: MonthlyOccupancy[] = monthLabels.map((label, idx) => {
  const baseCapacity = 430;
  const monthIdx = idx;
  // Occupancy increases in academic year and then drops
  const occupancyFactor = Math.max(0.5, Math.min(1, 0.6 + (monthIdx <= 7 ? monthIdx * 0.05 : (11 - monthIdx) * 0.05)));
  const totalCapacity = baseCapacity;
  const occupied = Math.round(baseCapacity * occupancyFactor);
  return {
    month: String(idx + 1).padStart(2, '0'),
    monthLabel: label,
    year: 2025,
    totalCapacity,
    occupied,
    vacant: totalCapacity - occupied,
    occupancyPct: Math.round((occupied / totalCapacity) * 100),
  };
});

export const blockWiseOccupancySeed: BlockWiseOccupancy[] = hostelBlocksSeed.map((block) => ({
  blockId: block.id,
  blockName: block.blockName,
  totalCapacity: block.totalCapacity,
  currentOccupancy: block.currentOccupancy,
  occupancyPct: Math.round((block.currentOccupancy / block.totalCapacity) * 100),
  totalRooms: block.totalRooms,
  gender: block.gender,
}));