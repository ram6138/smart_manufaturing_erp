"use client";

import React, { useState } from "react";
import { EmployeeItem, AttendanceRecord, AttendanceStatus, ShiftName } from "@/types/workforce";
import { X, CalendarCheck, Clock } from "lucide-react";

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeItem[];
  onMarkAttendance: (record: AttendanceRecord) => void;
}

const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "Present",
  "Late",
  "Half Day",
  "Absent",
  "Leave",
];

export function MarkAttendanceModal({
  isOpen,
  onClose,
  employees,
  onMarkAttendance,
}: MarkAttendanceModalProps) {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.employeeId || "EMP-101");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkIn, setCheckIn] = useState("06:00 AM");
  const [checkOut, setCheckOut] = useState("02:30 PM");
  const [status, setStatus] = useState<AttendanceStatus>("Present");
  const [overtimeHours, setOvertimeHours] = useState(0.5);
  const [workingHours, setWorkingHours] = useState(8.5);

  if (!isOpen) return null;

  const currentEmp = employees.find((e) => e.employeeId === selectedEmpId) || employees[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId: currentEmp?.employeeId || "EMP-101",
      employeeName: currentEmp?.name || "Factory Worker",
      department: currentEmp?.department || "Production",
      shift: currentEmp?.shift || "Morning Shift",
      date,
      checkIn: status === "Absent" || status === "Leave" ? "--" : checkIn,
      checkOut: status === "Absent" || status === "Leave" ? "--" : checkOut,
      workingHours: status === "Absent" || status === "Leave" ? 0 : Number(workingHours) || 8.0,
      overtimeHours: status === "Absent" || status === "Leave" ? 0 : Number(overtimeHours) || 0,
      status,
    };

    onMarkAttendance(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Mark Floor Attendance</h3>
            <p className="text-xs text-slate-400">Manual clock-in / clock-out recording and punch-card corrections</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Employee <span className="text-cyan-400">*</span>
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId}) — {emp.department} [{emp.shift}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Attendance Status <span className="text-cyan-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {ATTENDANCE_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {status !== "Absent" && status !== "Leave" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Check In Time
                  </label>
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    placeholder="e.g. 06:00 AM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Check Out Time
                  </label>
                  <input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    placeholder="e.g. 02:30 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Working Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/30 transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              Save Attendance Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
