// Matches PostgreSQL Schema Entities for Workforce Module

export type DepartmentName =
  | "Production"
  | "Packaging"
  | "Quality"
  | "Maintenance"
  | "Inventory"
  | "Procurement"
  | "Finance"
  | "HR"
  | "Operations";

export type DesignationName =
  | "Production Operator"
  | "Machine Operator"
  | "Quality Inspector"
  | "Maintenance Technician"
  | "Warehouse Executive"
  | "Procurement Executive"
  | "Production Supervisor"
  | "Quality Supervisor"
  | "Maintenance Manager"
  | "HR Executive";

export type ShiftName = "Morning Shift" | "General Shift" | "Evening Shift" | "Night Shift";

export type EmployeeStatus = "Active" | "On Leave" | "Inactive";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day" | "Leave";

export type LeaveType = "Casual" | "Earned" | "Sick" | "Emergency";

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type OvertimeApprovalStatus = "Pending" | "Approved" | "Rejected";

export type LineStaffingStatus = "Fully Staffed" | "Understaffed" | "Overstaffed";

// Employee Entity
export interface EmployeeItem {
  id: string;
  employeeId: string; // e.g. EMP-101
  name: string;
  department: DepartmentName;
  designation: DesignationName;
  shift: ShiftName;
  phone: string;
  email: string;
  joiningDate: string;
  status: EmployeeStatus;
  todayAttendance: AttendanceStatus;
  checkInTime?: string;
  productivityScore: number; // e.g. 92%
  // Summary aggregations
  presentDaysCount: number;
  absentDaysCount: number;
  leaveDaysCount: number;
  lateArrivalsCount: number;
  attendanceRate: number; // %
  unitsProducedToday: number;
  qualityPassRate: number; // %
  overtimeHoursMonth: number;
}

// Attendance Record
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: DepartmentName;
  shift: ShiftName;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: number;
  overtimeHours: number;
  status: AttendanceStatus;
}

// Shift Entity
export interface ShiftItem {
  id: string;
  shiftName: ShiftName;
  startTime: string;
  endTime: string;
  totalAssigned: number;
  presentCount: number;
  absentCount: number;
  utilizationRate: number; // %
  leadSupervisor: string;
}

// Workforce Department Allocation
export interface WorkforceAllocationItem {
  id: string;
  category: string;
  department: DepartmentName;
  requiredEmployees: number;
  assignedEmployees: number;
  availableEmployees: number;
  utilizationRate: number;
  hasShortage: boolean;
}

// Production Line Workforce
export interface ProductionLineWorkforce {
  id: string;
  lineId: string; // Line-01, Line-02, Packaging-01, Packaging-02
  lineName: string;
  assignedEmployees: number;
  operatorsCount: number;
  supervisorsCount: number;
  currentShift: ShiftName;
  workforceUtilization: number; // %
  status: LineStaffingStatus;
  leadSupervisor: string;
}

// Overtime Record
export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: DepartmentName;
  date: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  reason: string;
  approvalStatus: OvertimeApprovalStatus;
  isHighOvertime: boolean; // >4 hours
}

// Leave Request Record
export interface LeaveRequestRecord {
  id: string;
  requestId: string; // e.g. LR-2026-081
  employeeId: string;
  employeeName: string;
  department: DepartmentName;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  rejectionReason?: string;
  appliedDate: string;
}

// Workforce Alert
export interface WorkforceAlert {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  targetEntity: string;
  reason: string;
  recommendedAction: string;
  timestamp: string;
  category: "Staffing" | "Overtime" | "Leave" | "Attendance";
}

// 30-Day Attendance Trend Point
export interface AttendanceTrendPoint {
  date: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
  attendanceRate: number;
}

// Department Productivity Item
export interface DepartmentProductivityItem {
  department: string;
  productivity: number; // %
  unitsPerWorker: number;
  avgHours: number;
  overtimeHours: number;
  color: string;
}

// Filter States
export interface EmployeeFilterState {
  searchQuery: string;
  department: string;
  designation: string;
  shift: string;
  status: string;
}

export interface AttendanceFilterState {
  date: string;
  department: string;
  shift: string;
  status: string;
}
