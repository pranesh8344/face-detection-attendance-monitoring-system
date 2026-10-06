// Seed data for initial students and attendance history

export const INITIAL_STUDENTS = [
  {
    id: "STU-1001",
    name: "Pranesh R",
    department: "Computer Science & Engineering",
    email: "pranesh.r@university.edu",
    phone: "+91 98765 43210",
    batch: "2023-2027",
    joinedDate: "2023-08-10",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    // 10D normalized geometric descriptor vector representation
    faceDescriptor: [0.82, 0.45, 0.61, 0.93, 0.28, 0.54, 0.77, 0.39, 0.65, 0.88]
  },
  {
    id: "STU-1002",
    name: "Kavitha Sundaram",
    department: "Artificial Intelligence & Data Science",
    email: "kavitha.s@university.edu",
    phone: "+91 98765 43211",
    batch: "2023-2027",
    joinedDate: "2023-08-10",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    faceDescriptor: [0.35, 0.78, 0.29, 0.64, 0.81, 0.42, 0.59, 0.73, 0.31, 0.90]
  },
  {
    id: "STU-1003",
    name: "Arun Kumar M",
    department: "Electronics & Communication",
    email: "arun.kumar@university.edu",
    phone: "+91 98765 43212",
    batch: "2022-2026",
    joinedDate: "2022-08-15",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    faceDescriptor: [0.91, 0.12, 0.44, 0.75, 0.63, 0.29, 0.88, 0.51, 0.47, 0.33]
  },
  {
    id: "STU-1004",
    name: "Deepika V",
    department: "Computer Science & Engineering",
    email: "deepika.v@university.edu",
    phone: "+91 98765 43213",
    batch: "2023-2027",
    joinedDate: "2023-08-10",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    faceDescriptor: [0.48, 0.62, 0.89, 0.31, 0.74, 0.58, 0.15, 0.92, 0.67, 0.41]
  },
  {
    id: "STU-1005",
    name: "Siddharth Verma",
    department: "Mechanical Engineering",
    email: "siddharth.v@university.edu",
    phone: "+91 98765 43214",
    batch: "2022-2026",
    joinedDate: "2022-08-15",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    faceDescriptor: [0.67, 0.83, 0.19, 0.52, 0.41, 0.95, 0.36, 0.24, 0.79, 0.56]
  },
  {
    id: "STU-1006",
    name: "Ananya Sharma",
    department: "Information Technology",
    email: "ananya.s@university.edu",
    phone: "+91 98765 43215",
    batch: "2023-2027",
    joinedDate: "2023-08-10",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    faceDescriptor: [0.22, 0.55, 0.77, 0.44, 0.88, 0.33, 0.66, 0.99, 0.11, 0.72]
  }
];

// Helper to get formatted date string YYYY-MM-DD
export const getFormattedDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_ATTENDANCE_LOGS = [
  {
    id: "LOG-901",
    studentId: "STU-1001",
    studentName: "Pranesh R",
    department: "Computer Science & Engineering",
    date: getFormattedDate(0),
    timeIn: "08:52:14 AM",
    timeOut: "04:30:00 PM",
    status: "Present", // Present, Late, Absent, Excused
    confidence: 97.4,
    method: "Face AI Camera",
    location: "Main Gate Kiosk 1",
    notes: "On time verification"
  },
  {
    id: "LOG-902",
    studentId: "STU-1002",
    studentName: "Kavitha Sundaram",
    department: "Artificial Intelligence & Data Science",
    date: getFormattedDate(0),
    timeIn: "09:04:31 AM",
    timeOut: "04:28:15 PM",
    status: "Present",
    confidence: 95.8,
    method: "Face AI Camera",
    location: "Main Gate Kiosk 1",
    notes: "Verified"
  },
  {
    id: "LOG-903",
    studentId: "STU-1003",
    studentName: "Arun Kumar M",
    department: "Electronics & Communication",
    date: getFormattedDate(0),
    timeIn: "09:24:10 AM",
    timeOut: "--",
    status: "Late",
    confidence: 92.1,
    method: "Face AI Camera",
    location: "Block B Scanner",
    notes: "Scanned after 09:15 AM threshold"
  },
  {
    id: "LOG-904",
    studentId: "STU-1004",
    studentName: "Deepika V",
    department: "Computer Science & Engineering",
    date: getFormattedDate(0),
    timeIn: "08:45:02 AM",
    timeOut: "04:32:10 PM",
    status: "Present",
    confidence: 98.9,
    method: "Face AI Camera",
    location: "Main Gate Kiosk 2",
    notes: "On time"
  },
  {
    id: "LOG-905",
    studentId: "STU-1005",
    studentName: "Siddharth Verma",
    department: "Mechanical Engineering",
    date: getFormattedDate(1),
    timeIn: "09:01:15 AM",
    timeOut: "04:15:20 PM",
    status: "Present",
    confidence: 94.6,
    method: "Face AI Camera",
    location: "Mechanical Lab Scanner",
    notes: "Yesterday scan"
  },
  {
    id: "LOG-906",
    studentId: "STU-1006",
    studentName: "Ananya Sharma",
    department: "Information Technology",
    date: getFormattedDate(1),
    timeIn: "09:35:40 AM",
    timeOut: "04:00:00 PM",
    status: "Late",
    confidence: 91.2,
    method: "Manual Entry",
    location: "Admin Office",
    notes: "Medical pass submitted"
  }
];

export const DEPARTMENT_LIST = [
  "Computer Science & Engineering",
  "Artificial Intelligence & Data Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Information Technology",
  "Civil Engineering",
  "Electrical & Electronics"
];
