"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ErpLayout } from "@/components/layout/erp-layout";
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_SHIFTS,
  INITIAL_ALLOCATIONS,
  INITIAL_PRODUCTION_WORKFORCE,
  INITIAL_OVERTIME_RECORDS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_WORKFORCE_ALERTS,
  ATTENDANCE_TREND_30_DAYS,
  DEPARTMENT_PRODUCTIVITY_BENCHMARKS,
} from "@/lib/mock-data/workforce";
import {
  EmployeeItem,
  AttendanceRecord,
  ShiftItem,
  WorkforceAllocationItem,
  ProductionLineWorkforce,
  OvertimeRecord,
  LeaveRequestRecord,
  WorkforceAlert,
  EmployeeFilterState,
  AttendanceFilterState,
  OvertimeApprovalStatus,
} from "@/types/workforce";

// Components
import { WorkforceKpiCards } from "@/components/workforce/workforce-kpi-cards";
import { WorkforceOverview } from "@/components/workforce/workforce-overview";
import { WorkforceCapacity } from "@/components/workforce/workforce-capacity";
import { WorkforceAlerts } from "@/components/workforce/workforce-alerts";
import { EmployeeFilters } from "@/components/workforce/employee-filters";
import { EmployeeDirectory } from "@/components/workforce/employee-directory";
import { EmployeeDetails } from "@/components/workforce/employee-details";
import { AttendanceFilters } from "@/components/workforce/attendance-filters";
import { AttendanceTable } from "@/components/workforce/attendance-table";
import { AttendanceTrendChart } from "@/components/workforce/attendance-trend-chart";
import { ShiftManagement } from "@/components/workforce/shift-management";
import { WorkforceAllocation } from "@/components/workforce/workforce-allocation";
import { ProductionWorkforce } from "@/components/workforce/production-workforce";
import { ProductivityChart } from "@/components/workforce/productivity-chart";
import { OvertimeTable } from "@/components/workforce/overtime-table";
import { LeaveRequests } from "@/components/workforce/leave-requests";
import { AddEmployeeModal } from "@/components/workforce/add-employee-modal";
import { MarkAttendanceModal } from "@/components/workforce/mark-attendance-modal";
import { WorkforceAnalytics } from "@/components/workforce/workforce-analytics";

import {
  Users,
  CalendarCheck,
  Clock,
  Briefcase,
  BarChart3,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

type ActiveTab = "directory" | "attendance" | "shifts_allocation" | "overtime_leave" | "analytics";

export default function WorkforcePage() {
  // Primary State from PostgreSQL
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [shifts] = useState<ShiftItem[]>(INITIAL_SHIFTS);
  const [allocations] = useState<WorkforceAllocationItem[]>(INITIAL_ALLOCATIONS);
  const [productionLines] = useState<ProductionLineWorkforce[]>(INITIAL_PRODUCTION_WORKFORCE);
  const [overtimeLogs, setOvertimeLogs] = useState<OvertimeRecord[]>(INITIAL_OVERTIME_RECORDS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>(INITIAL_LEAVE_REQUESTS);
  const [alerts] = useState<WorkforceAlert[]>(INITIAL_WORKFORCE_ALERTS);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/workforce", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.status === "success" && isMounted) {
            setEmployees(data.employees || []);
            if (data.employees?.length > 0) {
              const liveAtt = data.employees.map((e: any) => ({
                id: `att_${e.id}`,
                employeeId: e.employeeCode || `EMP-${e.id}`,
                employeeName: e.employeeName,
                department: e.department,
                shift: e.shift || "Morning Shift A",
                date: new Date().toISOString().split("T")[0],
                checkIn: "06:00 AM",
                checkOut: "02:30 PM",
                status: e.attendanceStatus || "Present",
                workingHours: e.regularHours || 8.0,
                overtimeHours: e.overtimeHours || 0,
              }));
              setAttendanceLogs(liveAtt);
            }
          }
        }
      } catch (e) {
        console.warn("Using default workforce state", e);
      }
    }

    loadData();
    const interval = setInterval(loadData, 4000);
    window.addEventListener("focus", loadData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("directory");

  // Modals & Panels State
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Employee Filters
  const [empFilters, setEmpFilters] = useState<EmployeeFilterState>({
    searchQuery: "",
    department: "all",
    designation: "all",
    shift: "all",
    status: "all",
  });

  // Attendance Filters
  const [attFilters, setAttFilters] = useState<AttendanceFilterState>({
    date: "all",
    department: "all",
    shift: "all",
    status: "all",
  });

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search
      if (empFilters.searchQuery.trim()) {
        const query = empFilters.searchQuery.toLowerCase().trim();
        const matchesId = emp.employeeId.toLowerCase().includes(query);
        const matchesName = emp.name.toLowerCase().includes(query);
        const matchesDept = emp.department.toLowerCase().includes(query);
        const matchesDesig = emp.designation.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesDept && !matchesDesig) {
          return false;
        }
      }

      if (empFilters.department !== "all" && emp.department !== empFilters.department) {
        return false;
      }
      if (empFilters.designation !== "all" && emp.designation !== empFilters.designation) {
        return false;
      }
      if (empFilters.shift !== "all" && emp.shift !== empFilters.shift) {
        return false;
      }
      if (empFilters.status !== "all" && emp.status !== empFilters.status) {
        return false;
      }

      return true;
    });
  }, [employees, empFilters]);

  // Filtered Attendance
  const filteredAttendance = useMemo(() => {
    return attendanceLogs.filter((att) => {
      if (attFilters.date !== "all") {
        if (attFilters.date === "today" && att.date !== "2026-10-01") return false;
        if (attFilters.date === "yesterday" && att.date !== "2026-09-30") return false;
      }
      if (attFilters.department !== "all" && att.department !== attFilters.department) {
        return false;
      }
      if (attFilters.shift !== "all" && att.shift !== attFilters.shift) {
        return false;
      }
      if (attFilters.status !== "all" && att.status !== attFilters.status) {
        return false;
      }
      return true;
    });
  }, [attendanceLogs, attFilters]);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  // Handlers
  const handleAddEmployee = (newEmp: EmployeeItem) => {
    setEmployees((prev) => [newEmp, ...prev]);
    showNotification(`Employee ${newEmp.name} (${newEmp.employeeId}) successfully registered.`);
  };

  const handleMarkAttendance = (record: AttendanceRecord) => {
    setAttendanceLogs((prev) => [record, ...prev]);
    showNotification(`Attendance logged for ${record.employeeName} (${record.status}).`);
  };

  const handleApproveLeave = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => (lr.id === requestId ? { ...lr, status: "Approved" } : lr))
    );
    showNotification(`Leave request approved successfully.`);
  };

  const handleRejectLeave = (requestId: string, reason: string) => {
    setLeaveRequests((prev) =>
      prev.map((lr) =>
        lr.id === requestId
          ? { ...lr, status: "Rejected", rejectionReason: reason }
          : lr
      )
    );
    showNotification(`Leave request rejected with operational reason.`);
  };

  const handleUpdateOvertimeStatus = (recordId: string, status: OvertimeApprovalStatus) => {
    setOvertimeLogs((prev) =>
      prev.map((ot) => (ot.id === recordId ? { ...ot, approvalStatus: status } : ot))
    );
    showNotification(`Overtime record ${status.toLowerCase()}.`);
  };

  const handleViewEmployee = (employee: EmployeeItem) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleAlertAction = (alert: WorkforceAlert) => {
    if (alert.category === "Staffing") {
      setActiveTab("shifts_allocation");
    } else if (alert.category === "Overtime" || alert.category === "Leave") {
      setActiveTab("overtime_leave");
    } else {
      setActiveTab("attendance");
    }
  };

  const handleEmpFilterChange = (newFilters: Partial<EmployeeFilterState>) => {
    setEmpFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetEmpFilters = () => {
    setEmpFilters({
      searchQuery: "",
      department: "all",
      designation: "all",
      shift: "all",
      status: "all",
    });
  };

  const handleAttFilterChange = (newFilters: Partial<AttendanceFilterState>) => {
    setAttFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetAttFilters = () => {
    setAttFilters({
      date: "all",
      department: "all",
      shift: "all",
      status: "all",
    });
  };

  return (
    <ErpLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Workforce Management</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage employees, shifts, attendance, workforce allocation and productivity.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {notificationMsg && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {notificationMsg}
              </div>
            )}

            <button
              onClick={() => setIsMarkAttendanceOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              Mark Attendance
            </button>

            <button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-lg shadow-cyan-900/30 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              + Add Employee
            </button>
          </div>
        </div>

        {/* 1. KPI Cards */}
        <WorkforceKpiCards
          employees={employees}
          overtimeRecords={overtimeLogs}
        />

        {/* 2. Workforce Overview & Capacity Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkforceOverview employees={employees} />
          <WorkforceCapacity
            requiredWorkforce={86}
            availableWorkforce={employees.length * 7 + 11}
            allocatedWorkforce={78}
          />
        </div>

        {/* 3. Operational Workforce Alerts */}
        <WorkforceAlerts alerts={alerts} onViewAlert={handleAlertAction} />

        {/* Module Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 pb-2">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "directory"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Users className="w-4 h-4" />
            Employee Directory ({employees.length})
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "attendance"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Attendance & Trend Logs ({attendanceLogs.length})
          </button>

          <button
            onClick={() => setActiveTab("shifts_allocation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "shifts_allocation"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Clock className="w-4 h-4" />
            Shifts & Line Allocations
          </button>

          <button
            onClick={() => setActiveTab("overtime_leave")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "overtime_leave"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Overtime & Leave Requests ({leaveRequests.filter((l) => l.status === "Pending").length} pending)
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Workforce Analytics Hub
          </button>
        </div>

        {/* Tab 1: Employee Directory */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            <EmployeeFilters
              filters={empFilters}
              onFilterChange={handleEmpFilterChange}
              onResetFilters={handleResetEmpFilters}
              totalEmployees={employees.length}
              filteredCount={filteredEmployees.length}
            />
            <EmployeeDirectory
              employees={filteredEmployees}
              onViewEmployee={handleViewEmployee}
            />
          </div>
        )}

        {/* Tab 2: Attendance & Trend */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            {/* 30-Day Attendance Trend Recharts Chart */}
            <AttendanceTrendChart data={ATTENDANCE_TREND_30_DAYS} />

            {/* Attendance Filter Bar */}
            <AttendanceFilters
              filters={attFilters}
              onFilterChange={handleAttFilterChange}
              onResetFilters={handleResetAttFilters}
              totalRecords={attendanceLogs.length}
              filteredCount={filteredAttendance.length}
            />

            {/* Attendance Table */}
            <AttendanceTable records={filteredAttendance} />
          </div>
        )}

        {/* Tab 3: Shifts & Allocations */}
        {activeTab === "shifts_allocation" && (
          <div className="space-y-6">
            {/* Shift Management Grid */}
            <ShiftManagement shifts={shifts} />

            {/* Workforce Allocation with Shortages */}
            <WorkforceAllocation allocations={allocations} />

            {/* Production Line Manning */}
            <ProductionWorkforce lines={productionLines} />
          </div>
        )}

        {/* Tab 4: Overtime & Leave Requests */}
        {activeTab === "overtime_leave" && (
          <div className="space-y-6">
            {/* Department Productivity Benchmark */}
            <ProductivityChart data={DEPARTMENT_PRODUCTIVITY_BENCHMARKS} />

            {/* Overtime Monitoring Table */}
            <OvertimeTable
              records={overtimeLogs}
              onUpdateStatus={handleUpdateOvertimeStatus}
            />

            {/* Leave Requests Table */}
            <LeaveRequests
              requests={leaveRequests}
              onApprove={handleApproveLeave}
              onReject={handleRejectLeave}
            />
          </div>
        )}

        {/* Tab 5: Analytics Hub */}
        {activeTab === "analytics" && (
          <WorkforceAnalytics
            employees={employees}
            shifts={shifts}
            productivityData={DEPARTMENT_PRODUCTIVITY_BENCHMARKS}
            trendData={ATTENDANCE_TREND_30_DAYS}
          />
        )}

        {/* Modals & Slide-overs */}
        <EmployeeDetails
          employee={selectedEmployee}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />

        <AddEmployeeModal
          isOpen={isAddEmployeeOpen}
          onClose={() => setIsAddEmployeeOpen(false)}
          onAddEmployee={handleAddEmployee}
          existingCount={employees.length}
        />

        <MarkAttendanceModal
          isOpen={isMarkAttendanceOpen}
          onClose={() => setIsMarkAttendanceOpen(false)}
          employees={employees}
          onMarkAttendance={handleMarkAttendance}
        />
      </div>
    </ErpLayout>
  );
}
