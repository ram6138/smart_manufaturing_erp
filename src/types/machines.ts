// Matches PostgreSQL Schema Entities for Machines & Predictive Maintenance Module

export type MachineStatus = "Running" | "Idle" | "Maintenance" | "Warning";

export type MachineRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type MaintenanceType = "Preventive" | "Corrective" | "Inspection";

export type MaintenanceStatus = "Completed" | "In Progress" | "Scheduled" | "Overdue";

// Maps to `machine_sensor_readings` time-series points (24h)
export interface SensorReadingPoint {
  timestamp: string; // e.g. "00:00", "04:00", "08:00"
  hourLabel: string;
  temperature: number; // °C
  temperatureThreshold: number;
  vibration: number; // mm/s (RMS)
  vibrationThreshold: number;
  motorLoad: number; // %
  powerConsumption: number; // kW
}

// Maps to `maintenance_records` table
export interface MaintenanceRecord {
  id: string;
  maintenanceId: string; // e.g. MNT-2026-0041
  machineId: string;
  date: string;
  type: MaintenanceType;
  description: string;
  technician: string;
  downtimeHours: number;
  cost: number;
  status: MaintenanceStatus;
  notes?: string;
}

// Maps to `machine_failure_predictions` (ML prediction interface)
export interface MachineFailurePrediction {
  id: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  riskScore: number; // 0 - 100%
  riskLevel: MachineRiskLevel;
  mainRiskFactor: string; // e.g. "Increasing temperature trend"
  prediction: string;
  recommendedAction: string;
  confidenceScore: number; // e.g. 91.5%
  predictedFailureWindow: string; // e.g. "48-72 hours"
  predictionDate: string;
}

// Maps to `machines` table joined with real-time sensor state
export interface MachineItem {
  id: string;
  machineCode: string; // e.g. MCH-001, MCH-004
  machineName: string; // e.g. Baking Oven 1, Baking Oven 2
  machineType: string; // e.g. Continuous Tunnel Oven, Rotary Deck Oven
  status: MachineStatus;
  location: string; // e.g. Line 1 - Thermal Bay, Line 2 - Primary
  installationDate: string; // e.g. 2023-04-15
  operatingHours: number; // e.g. 4,280
  downtimeMinutes: number; // e.g. 48 mins today
  utilization: number; // 0 - 100%
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  currentTemperature: number; // °C
  currentVibration: number; // mm/s
  currentMotorLoad: number; // %
  currentPower: number; // kW
  riskLevel: MachineRiskLevel;
  riskScore: number; // %
  sensorHistory: SensorReadingPoint[];
  maintenanceHistory: MaintenanceRecord[];
  prediction: MachineFailurePrediction;
}

// Maintenance Alert interface
export interface MaintenanceAlert {
  id: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  reason: string;
  recommendedAction: string;
  timestamp: string;
  isAcknowledged?: boolean;
}

// Filter State interface
export interface MachineFilterState {
  searchQuery: string;
  machineType: string;
  status: string;
  riskLevel: string;
}
