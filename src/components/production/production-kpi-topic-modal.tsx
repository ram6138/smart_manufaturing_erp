"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductionKPIData, ProductionOrder } from "@/types/production";
import {
  Factory,
  CheckCircle2,
  Gauge,
  ShieldAlert,
  Clock,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  X,
  Layers,
  Wrench,
  Boxes,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  Filter,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Truck,
  Cpu,
  RefreshCw,
  Info,
} from "lucide-react";

export type KpiTopicId =
  | "planned"
  | "actual"
  | "efficiency"
  | "rejected"
  | "downtime"
  | "completed";

interface ProductionKpiTopicModalProps {
  topicId: KpiTopicId | null;
  kpi: ProductionKPIData;
  onClose: () => void;
  onApplyFilter?: (filterType: string, value: string) => void;
  onShowNotification?: (msg: string) => void;
}

export function ProductionKpiTopicModal({
  topicId,
  kpi,
  onClose,
  onApplyFilter,
  onShowNotification,
}: ProductionKpiTopicModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!topicId) return null;

  // Rich topic knowledge database for all 6 production KPIs
  const topicConfigs: Record<
    KpiTopicId,
    {
      title: string;
      subtitle: string;
      value: string;
      unit: string;
      change: string;
      isGood: boolean;
      icon: any;
      badgeColor: string;
      badgeBg: string;
      accentColor: string;
      statusTag: string;
      tabs: {
        name: string;
        tagline: string;
        icon: any;
        description: string;
        keyMetrics: { label: string; val: string; sub?: string; color?: string }[];
        bulletPoints: string[];
        recommendation: string;
      }[];
      relatedFilter: {
        filterType: string;
        filterValue: string;
        buttonText: string;
      };
      quickLinks: {
        label: string;
        desc: string;
        icon: any;
        action?: "tab" | "route" | "scroll";
        tabIndex?: number;
        href?: string;
        target?: string;
      }[];
    }
  > = {
    planned: {
      title: "Planned Production",
      subtitle: "Master Production Schedule (MPS) target quotas, shift allocation & capacity models",
      value: `${Number(kpi.plannedProduction || 150000).toLocaleString()}`,
      unit: "units",
      change: `+${kpi.plannedChangePercent || 5.2}% vs previous cycle`,
      isGood: true,
      icon: Factory,
      badgeColor: "text-cyan-600",
      badgeBg: "bg-cyan-50 border-cyan-200",
      accentColor: "from-cyan-500 to-blue-600",
      statusTag: "Target for Current Production Cycle",
      tabs: [
        {
          name: "Master Production Schedule (MPS)",
          tagline: "High-level production volume planning mapped to delivery windows",
          icon: Calendar,
          description:
            "The current 7-day cycle targets 150,000 finished biscuit units distributed across 6 primary SKU lines. Production scheduling uses finite capacity loading to prevent line bottlenecking at Baking Oven 1 and Oven 2.",
          keyMetrics: [
            { label: "Cycle Planned Target", val: "150,000 u", sub: "All 6 product lines", color: "text-cyan-600" },
            { label: "Daily Scheduled Run Rate", val: "21,428 u/day", sub: "Across 3 daily shifts", color: "text-blue-600" },
            { label: "Line Capacity Utilization", val: "91.8%", sub: "Rated plant ceiling: 95%", color: "text-emerald-600" },
            { label: "Active Planned Batches", val: "8 Batches", sub: "PROD-00001 to PROD-00008", color: "text-purple-600" },
          ],
          bulletPoints: [
            "Classic Butter Biscuit leads planned volume with 40,000 units (26.7% of total output).",
            "Chocolate Biscuit allocation is set to 32,000 units with dedicated packaging line priority.",
            "Coconut (24k), Cream (22k), Marie (18k), and Salted (14k) complete the weekly master matrix.",
            "Shift load balancing: 45% Morning Shift, 35% Evening Shift, 20% Night Shift.",
          ],
          recommendation:
            "Maintain current finite capacity schedules. Pre-stage dry ingredient silos 2 hours before Night shift changeover to prevent mixer starvation.",
        },
        {
          name: "Demand & Sales Order Alignment",
          tagline: "Direct mapping of planned shop floor orders to customer sales commitments",
          icon: Truck,
          description:
            "92% of the planned volume is pre-allocated to confirmed national supermarket distributor orders and retail export contracts, with 8% allocated for buffer safety stock replenishment.",
          keyMetrics: [
            { label: "Firm Customer Orders", val: "138,000 u", sub: "92% committed demand", color: "text-blue-600" },
            { label: "Safety Stock Replenishment", val: "12,000 u", sub: "Warehouse target buffer", color: "text-emerald-600" },
            { label: "Average Lead Time", val: "18.5 hrs", sub: "Order release to dock", color: "text-amber-600" },
            { label: "Backlog Fulfillment Rate", val: "99.2%", sub: "Zero delinquent POs", color: "text-cyan-600" },
          ],
          bulletPoints: [
            "PROD-00001 and PROD-00002 carry Urgent/High priority tags for regional retail distribution.",
            "Contractual delivery penalties are protected with a 48-hour dispatch buffer window.",
            "Automated ERP inventory sync triggers re-order alerts when finished goods dip below 8,000 units.",
          ],
          recommendation:
            "Prioritize PROD-00002 Chocolate Biscuit batch through Oven 2 to satisfy export shipping container departure on Friday 16:00.",
        },
        {
          name: "Line Balancing & Machine Capacity",
          tagline: "Equipment throughput synchronization across mixing, baking, and flow wrapping",
          icon: Cpu,
          description:
            "Plant equipment speeds are balanced to eliminate inter-process inventory buildup between continuous tunnel baking ovens and automated flow-wrap packaging stations.",
          keyMetrics: [
            { label: "Baking Oven 1 Target", val: "48,500 u", sub: "Tunnel oven velocity: 120 u/min", color: "text-cyan-600" },
            { label: "Baking Oven 2 Target", val: "34,200 u", sub: "Rotary oven velocity: 85 u/min", color: "text-blue-600" },
            { label: "Mixer 1 Throughput", val: "52,000 u", sub: "High-shear batching", color: "text-emerald-600" },
            { label: "Packaging Stations", val: "57,800 u", sub: "Dual flow-wrap lines", color: "text-purple-600" },
          ],
          bulletPoints: [
            "Baking Oven 1 operates at peak efficiency (96.4% utilization) with minimal changeover downtime.",
            "Baking Oven 2 has adjusted thermal curve profiles for high-sugar chocolate biscuit formulations.",
            "Packaging Machine 2 scheduled for planned belt maintenance during Night Shift.",
          ],
          recommendation:
            "Run dual-lane feeder synchronization on Packaging Machine 1 to match Oven 1 high-speed output during Morning peak.",
        },
        {
          name: "Material Requirements (MRP Readiness)",
          tagline: "Raw ingredient and packaging film staging verification for planned runs",
          icon: Boxes,
          description:
            "Material Requirement Planning (MRP) algorithms have verified that 100% of required wheat flour, sugar, and packaging film are staged in line-side buffer bays.",
          keyMetrics: [
            { label: "Flour Requirement", val: "7,800 kg", sub: "100% staged & QA cleared", color: "text-emerald-600" },
            { label: "Sugar Requirement", val: "2,925 kg", sub: "100% staged in silos", color: "text-emerald-600" },
            { label: "Cocoa Powder", val: "396 kg", sub: "Batch-ready in weighing bay", color: "text-cyan-600" },
            { label: "Wrapper Film Reels", val: "16,250 m", sub: "Dual roll auto-spliced", color: "text-blue-600" },
          ],
          bulletPoints: [
            "BOM version 1.4 active for all biscuit product recipes.",
            "Lot traceability barcodes mapped to raw ingredient suppliers for end-to-end recall security.",
            "Packaging boxes and corrugated master cartons staged at final palletization station.",
          ],
          recommendation:
            "Ensure cocoa powder dry storage humidity stays below 55% RH during evening shift handling.",
        },
      ],
      relatedFilter: {
        filterType: "status",
        filterValue: "In Progress",
        buttonText: "Filter Active Scheduled & In-Progress Orders",
      },
      quickLinks: [
        { label: "Bill of Materials (BOM)", desc: "Inspect ingredient consumption formulas", icon: Boxes, action: "tab", tabIndex: 3 },
        { label: "Master Schedule (MPS)", desc: "View shift-by-shift Gantt timeline", icon: Calendar, action: "tab", tabIndex: 0 },
        { label: "Capacity Planning", desc: "Equipment load vs rated limits", icon: Cpu, action: "tab", tabIndex: 2 },
      ],
    },
    actual: {
      title: "Actual Production",
      subtitle: "Real-time finished goods output, shift yield tracking & planned variance telemetry",
      value: `${Number(kpi.actualProduction || 142500).toLocaleString()}`,
      unit: "units",
      change: `+${kpi.actualChangePercent || 4.8}% output increase`,
      isGood: true,
      icon: CheckCircle2,
      badgeColor: "text-blue-600",
      badgeBg: "bg-blue-50 border-blue-200",
      accentColor: "from-blue-500 to-indigo-600",
      statusTag: "95.0% Plan Fulfillment Rate",
      tabs: [
        {
          name: "Shopfloor Telemetry & Output",
          tagline: "Live unit counts and machine counter feeds from plant floor sensors",
          icon: Activity,
          description:
            "142,500 finished units have cleared automated optical inspection and flow-wrapping. The plant is currently executing at a steady 95.0% fulfillment rate against the 150,000 unit target.",
          keyMetrics: [
            { label: "Total Finished Output", val: "142,500 u", sub: "Cleared QA check", color: "text-blue-600" },
            { label: "Good Quality Yield", val: "139,250 u", sub: "97.7% first-pass good", color: "text-emerald-600" },
            { label: "Current Run Rate", val: "1,250 u/hr", sub: "Line 1 & 2 aggregate", color: "text-cyan-600" },
            { label: "Plan Attainment Gap", val: "-7,500 u", sub: "5.0% remaining to target", color: "text-amber-600" },
          ],
          bulletPoints: [
            "Baking Oven 1 has produced 48,500 units with 97.2% equipment efficiency.",
            "Classic Butter Biscuit batch PROD-00001 is nearing final palletization with 24,200 units completed.",
            "Chocolate Biscuit batch PROD-00002 has achieved 26,800 units despite thermal variance in Zone 3.",
          ],
          recommendation:
            "Maintain continuous line feed on Oven 1. The remaining 7,500 units are scheduled to complete during the current shift.",
        },
        {
          name: "Shift-by-Shift Output Breakdown",
          tagline: "Comparative throughput performance across Morning, Evening, and Night operating crews",
          icon: Clock,
          description:
            "Morning shift delivered the highest throughput with 64,500 units (45.3%), followed by Evening shift with 49,600 units (34.8%), and Night shift with 28,400 units (19.9%).",
          keyMetrics: [
            { label: "Morning Shift (06:00-14:00)", val: "64,500 u", sub: "96.5% shift efficiency", color: "text-emerald-600" },
            { label: "Evening Shift (14:00-22:00)", val: "49,600 u", sub: "92.8% shift efficiency", color: "text-blue-600" },
            { label: "Night Shift (22:00-06:00)", val: "28,400 u", sub: "93.1% shift efficiency", color: "text-purple-600" },
            { label: "Operator Headcount", val: "36 Operators", sub: "12 per active shift", color: "text-cyan-600" },
          ],
          bulletPoints: [
            "Morning shift benefited from zero unplanned stoppages on Baking Oven 1.",
            "Evening shift experienced a 55-minute pause for dough viscosity calibration on Mixer 1.",
            "Night shift successfully completed export batch PROD-00007 (12,000 units) with 96.8% yield.",
          ],
          recommendation:
            "Standardize the dough viscosity pre-mix check SOP across the Evening shift team to eliminate calibration delays.",
        },
        {
          name: "Plan Variance Root Cause Analysis",
          tagline: "Detailed breakdown of the 7,500-unit planned vs actual delta",
          icon: Info,
          description:
            "The 5.0% variance (-7,500 units) has been analyzed: 3,250 units lost to quality scrap rejections, 2,800 units due to dough viscosity pause on Mixer 1, and 1,450 units due to Packaging Machine 2 maintenance staging.",
          keyMetrics: [
            { label: "Quality Scrap Loss", val: "3,250 u", sub: "43.3% of variance", color: "text-rose-600" },
            { label: "Mixer Calibration Delay", val: "2,800 u", sub: "37.3% of variance", color: "text-amber-600" },
            { label: "Packager 2 Maintenance", val: "1,450 u", sub: "19.4% of variance", color: "text-slate-600" },
            { label: "Net Recoverable Units", val: "4,250 u", sub: "Via overtime buffer", color: "text-emerald-600" },
          ],
          bulletPoints: [
            "No catastrophic equipment failures occurred during the run cycle.",
            "Scrap rate (2.2%) remains well within the plant safety threshold (2.5%).",
            "Active batches currently in progress will absorb the remaining schedule before weekend dispatch.",
          ],
          recommendation:
            "Authorize 45 minutes of scheduled buffer extension on Line 1 to close out remaining Classic Butter Biscuit cartons.",
        },
        {
          name: "Active Work Order Progress",
          tagline: "Execution status of all currently active shop floor batches",
          icon: ClipboardCheck,
          description:
            "8 total production orders are tracked in the database: 2 In Progress, 2 Completed, 1 Paused, 1 Released, 1 Scheduled, 1 Cancelled.",
          keyMetrics: [
            { label: "In Progress Orders", val: "2 Batches", sub: "PROD-00001, PROD-00002", color: "text-blue-600" },
            { label: "Completed Batches", val: "2 Batches", sub: "PROD-00003, PROD-00007", color: "text-emerald-600" },
            { label: "Paused Orders", val: "1 Batch", sub: "PROD-00004 (Mixer 1)", color: "text-amber-600" },
            { label: "Released for Staging", val: "1 Batch", sub: "PROD-00005 (Line 1 buffer)", color: "text-purple-600" },
          ],
          bulletPoints: [
            "PROD-00001 (Classic Butter): 24,200 / 25,000 units (96.8% efficiency).",
            "PROD-00002 (Chocolate): 26,800 / 30,000 units (89.3% efficiency).",
            "PROD-00003 (Marie): 20,000 / 20,000 units (100% completed).",
          ],
          recommendation:
            "Resume PROD-00004 Coconut Biscuit once viscosity sensor reads 42.5 cP.",
        },
      ],
      relatedFilter: {
        filterType: "status",
        filterValue: "In Progress",
        buttonText: "Filter In-Progress Orders in Table",
      },
      quickLinks: [
        { label: "Production Orders Table", desc: "View and edit active shop floor batches", icon: ClipboardCheck, action: "scroll", target: '[aria-label="Production Orders List"]' },
        { label: "Daily Output Chart", desc: "7-day volume telemetry graph", icon: BarChart3, action: "scroll", target: '[aria-label="Production Performance Trends"]' },
        { label: "Product Performance", desc: "Volume breakdown across 6 SKU lines", icon: Layers, action: "scroll", target: '[aria-label="Product and Machine Performance"]' },
      ],
    },
    efficiency: {
      title: "Production Efficiency (OEE)",
      subtitle: "Overall Equipment Effectiveness, availability, performance velocity & quality yield",
      value: `${kpi.productionEfficiency || 94.2}%`,
      unit: "",
      change: `+${kpi.efficiencyChangePercent || 1.4}% efficiency gain`,
      isGood: true,
      icon: Gauge,
      badgeColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 border-emerald-200",
      accentColor: "from-emerald-500 to-teal-600",
      statusTag: "Target: ≥ 92.0% (Exceeding Benchmark by +2.2%)",
      tabs: [
        {
          name: "Overall Equipment Effectiveness (OEE)",
          tagline: "Tripartite industrial formula: Availability × Performance × Quality",
          icon: Gauge,
          description:
            "Plant-wide OEE stands at 94.2%, outperforming the world-class food manufacturing benchmark (85.0%) and the internal plant target (92.0%).",
          keyMetrics: [
            { label: "Overall Plant OEE", val: "94.2%", sub: "Above 92.0% target", color: "text-emerald-600" },
            { label: "Availability Rate (A)", val: "96.2%", sub: "Uptime vs planned run", color: "text-blue-600" },
            { label: "Performance Rate (P)", val: "97.8%", sub: "Actual speed vs rated speed", color: "text-cyan-600" },
            { label: "Quality Yield Rate (Q)", val: "98.1%", sub: "First-pass good units", color: "text-purple-600" },
          ],
          bulletPoints: [
            "Formula calculation: 96.2% Availability × 97.8% Performance × 98.1% Quality = 94.2% Net OEE.",
            "Baking Oven 1 is the highest performing asset with 97.2% overall line efficiency.",
            "Marie Biscuit line achieved a flawless 97.8% product efficiency score.",
          ],
          recommendation:
            "Focus next Kaizen cycle on Baking Oven 2 thermal stabilization to bring its 89.4% efficiency up to the 92% plant threshold.",
        },
        {
          name: "Cycle Time & Speed Loss Analysis",
          tagline: "Conveyor velocity, micro-stoppages, and thermal ramp-up efficiency",
          icon: Activity,
          description:
            "Automated speed loss tracking indicates that line conveyors ran at 98.4% of maximum rated design speed with fewer than 3 micro-stoppages per operating hour.",
          keyMetrics: [
            { label: "Rated Line Velocity", val: "125 u/min", sub: "Design max speed", color: "text-slate-600" },
            { label: "Actual Running Speed", val: "123 u/min", sub: "98.4% speed efficiency", color: "text-emerald-600" },
            { label: "Micro-Stoppages (<5 min)", val: "4 events", sub: "Total loss: 12 minutes", color: "text-amber-600" },
            { label: "Oven Thermal Ramp Time", val: "14 mins", sub: "Target: ≤ 15 mins", color: "text-blue-600" },
          ],
          bulletPoints: [
            "Conveyor belt speed synchronization between oven exit and packaging hopper operating with zero jams.",
            "Auto-splicer on flow wrapper eliminated film change stoppage time.",
            "Optical weight sensor auto-adjusts dough depositing nozzle with 0.1s response latency.",
          ],
          recommendation:
            "Install vibration damping mounts on Mixer 1 to prevent micro-chatter during high-shear dough cycling.",
        },
        {
          name: "Efficiency Ranking by Asset & SKU",
          tagline: "Machine-by-machine and product-by-product efficiency comparison",
          icon: BarChart3,
          description:
            "Detailed efficiency scoring across all 5 plant machinery assets and 6 production biscuit SKUs.",
          keyMetrics: [
            { label: "Baking Oven 1", val: "97.2%", sub: "48,500 units produced", color: "text-emerald-600" },
            { label: "Mixer 1", val: "95.6%", sub: "52,000 units processed", color: "text-emerald-600" },
            { label: "Packaging Machine 1", val: "94.0%", sub: "41,000 units packed", color: "text-blue-600" },
            { label: "Baking Oven 2", val: "89.4%", sub: "34,200 units produced", color: "text-amber-600" },
          ],
          bulletPoints: [
            "Marie Biscuit (SKU-MAR-05): 97.8% product efficiency.",
            "Cream Biscuit (SKU-CRM-04): 95.9% product efficiency.",
            "Classic Butter Biscuit (SKU-CBB-01): 95.5% product efficiency.",
            "Salted Biscuit (SKU-SLT-06): 95.7% product efficiency.",
          ],
          recommendation:
            "Review temperature PID controller settings on Baking Oven 2 during next scheduled line washdown.",
        },
        {
          name: "Lean Manufacturing & Kaizen Actions",
          tagline: "Continuous improvement initiatives and Single-Minute Exchange of Die (SMED) results",
          icon: Sparkles,
          description:
            "Recent SMED implementation reduced biscuit cutter die changeover time from 45 minutes to 18 minutes, recovering 2.5 hours of productive uptime per week.",
          keyMetrics: [
            { label: "Changeover Time Reduction", val: "-60%", sub: "From 45m down to 18m", color: "text-emerald-600" },
            { label: "Recovered Weekly Capacity", val: "+2.5 hrs", sub: "Equivalent to 3,200 units", color: "text-cyan-600" },
            { label: "5S Audit Score", val: "98/100", sub: "Plant floor hygiene & safety", color: "text-purple-600" },
            { label: "Standard Work Compliance", val: "96.4%", sub: "Operator SOP adherence", color: "text-blue-600" },
          ],
          bulletPoints: [
            "Quick-release clamp retrofit completed on flow-wrap packaging guide rails.",
            "Visual shadow boards installed for all dough preparation tools and test sieves.",
            "Weekly digital checklist logs 100% compliance across all shift supervisors.",
          ],
          recommendation:
            "Replicate quick-change tooling fixtures onto Packaging Machine 2 during its upcoming maintenance overhaul.",
        },
      ],
      relatedFilter: {
        filterType: "status",
        filterValue: "all",
        buttonText: "View Full Production Performance Data",
      },
      quickLinks: [
        { label: "Machine Performance Matrix", desc: "Inspect equipment utilization & status", icon: Wrench, action: "scroll", target: '[aria-label="Product and Machine Performance"]' },
        { label: "Product Performance Table", desc: "SKU-level throughput & efficiency", icon: Layers, action: "scroll", target: '[aria-label="Product and Machine Performance"]' },
        { label: "7-Day Efficiency Trend", desc: "Historical OEE line chart", icon: Activity, action: "scroll", target: '[aria-label="Production Performance Trends"]' },
      ],
    },
    rejected: {
      title: "Rejected Quantity (Quality Scrap)",
      subtitle: "Non-conforming units, scrap rate Pareto analysis & defect root cause prevention",
      value: `${Number(kpi.rejectedQuantity || 3250).toLocaleString()}`,
      unit: "units",
      change: `${kpi.rejectedChangePercent || -0.8}% scrap reduction`,
      isGood: true,
      icon: ShieldAlert,
      badgeColor: "text-rose-600",
      badgeBg: "bg-rose-50 border-rose-200",
      accentColor: "from-rose-500 to-red-600",
      statusTag: "2.2% Scrap Rate (Within 2.5% Safe Threshold)",
      tabs: [
        {
          name: "Scrap Pareto & Defect Root Causes",
          tagline: "Categorized breakdown of non-conforming scrap units across the shop floor",
          icon: AlertTriangle,
          description:
            "Out of 145,750 total produced units, 3,250 units (2.2%) were rejected during optical inspection, checkweigher verification, and packaging seal integrity checks.",
          keyMetrics: [
            { label: "Total Rejected Units", val: "3,250 u", sub: "2.2% scrap rate", color: "text-rose-600" },
            { label: "Over-Baking Burn Defects", val: "1,365 u", sub: "42% of total scrap", color: "text-rose-600" },
            { label: "Packaging Seal Tears", val: "910 u", sub: "28% of total scrap", color: "text-amber-600" },
            { label: "Dough Weight Discrepancy", val: "585 u", sub: "18% of total scrap", color: "text-yellow-600" },
          ],
          bulletPoints: [
            "Over-baking scrap concentrated primarily on Baking Oven 2 during high-sugar chocolate batch start.",
            "Seal tears on Flow Wrapper 1 occurred during high-speed heat crimp cycle.",
            "Checkweigher rejected 585 underweight biscuits from Mixer 1 dough density transition.",
            "Foreign object optical / metal detector scrap was 0.0% (Zero contamination events).",
          ],
          recommendation:
            "Re-calibrate heat-sealing temperature on Flow Wrapper 1 jaw from 165°C to 158°C to prevent film scorch.",
        },
        {
          name: "Non-Conformance Reports (NCR) & Quality Holds",
          tagline: "Formal QA quarantine records and supplier material discrepancy tracking",
          icon: FileSpreadsheet,
          description:
            "One active Non-Conformance Report (NCR-409) is currently documented in the system regarding raw material dough consistency on PROD-00008, resulting in orderly batch cancellation.",
          keyMetrics: [
            { label: "Active NCR Tickets", val: "1 Report", sub: "NCR-409 (Supplier flour lot)", color: "text-rose-600" },
            { label: "Quarantined Goods", val: "300 u", sub: "Isolated in QA Hold Area B", color: "text-amber-600" },
            { label: "Supplier Claim Status", val: "Filed", sub: "Credit request submitted", color: "text-blue-600" },
            { label: "QA Checkpoints Passed", val: "99.1%", sub: "12 out of 12 stages validated", color: "text-emerald-600" },
          ],
          bulletPoints: [
            "PROD-00008 cancelled early to prevent downstream line contamination and salvage clean ingredients.",
            "Supplier flour batch #WFL-902 quarantined pending moisture content laboratory re-test.",
            "No non-conforming finished goods have exited the factory staging facility.",
          ],
          recommendation:
            "Obtain formal supplier CoA certification before unloading next bulk flour tanker shipment.",
        },
        {
          name: "First Pass Yield (FPY) by SKU",
          tagline: "Quality yield and scrap percentage across all 6 biscuit lines",
          icon: Layers,
          description:
            "First Pass Yield measures the proportion of units that pass quality inspection on the first attempt without rework or scrap.",
          keyMetrics: [
            { label: "Marie Biscuit (SKU-MAR-05)", val: "98.3% FPY", sub: "Scrap: 310 units (1.7%)", color: "text-emerald-600" },
            { label: "Coconut Biscuit (SKU-COCO-03)", val: "97.9% FPY", sub: "Scrap: 480 units (2.1%)", color: "text-emerald-600" },
            { label: "Classic Butter (SKU-CBB-01)", val: "98.4% FPY", sub: "Scrap: 620 units (1.6%)", color: "text-emerald-600" },
            { label: "Chocolate Biscuit (SKU-CHOC-02)", val: "97.3% FPY", sub: "Scrap: 840 units (2.7%)", color: "text-amber-600" },
          ],
          bulletPoints: [
            "Classic Butter Biscuit achieved the lowest scrap rate (1.6%) across all high-volume runs.",
            "Chocolate Biscuit scrap slightly elevated (2.7%) due to cocoa powder viscosity sensitivity.",
            "Cream Biscuit (SKU-CRM-04) maintained a strong 97.7% first-pass quality yield.",
          ],
          recommendation:
            "Increase cocoa dough mixing time by 2.5 minutes on Mixer 1 to improve batch homogeneity.",
        },
        {
          name: "Scrap Financial Cost & Material Recovery",
          tagline: "Monetary cost of scrap waste and secondary animal feed salvage recovery",
          icon: Boxes,
          description:
            "The 3,250 rejected units represent $1,840.00 in raw material loss, with $420.00 recovered through authorized industrial secondary feed salvage sales.",
          keyMetrics: [
            { label: "Gross Scrap Material Cost", val: "$1,840.00", sub: "$0.56 per rejected unit", color: "text-rose-600" },
            { label: "Salvage Recovery Value", val: "+$420.00", sub: "Approved animal feed recycling", color: "text-emerald-600" },
            { label: "Net Scrap Loss", val: "$1,420.00", sub: "0.8% of production gross value", color: "text-amber-600" },
            { label: "Target Monthly Reduction", val: "-15.0%", sub: "Targeting < 2,800 units", color: "text-cyan-600" },
          ],
          bulletPoints: [
            "100% of clean baked biscuit scrap is diverted from landfills into certified animal feed processing.",
            "Packaging film waste is segregated for industrial polymer recycling.",
            "Automated cost tracking logs scrap directly to production work center ledger accounts.",
          ],
          recommendation:
            "Conduct optical reject camera lens cleaning every 4 hours to avoid false positive rejections.",
        },
      ],
      relatedFilter: {
        filterType: "priority",
        filterValue: "Urgent",
        buttonText: "Filter High Scrap & Urgent Orders",
      },
      quickLinks: [
        { label: "Quality Assurance Module", desc: "View detailed QC inspection logs", icon: ShieldAlert, action: "route", href: "/quality" },
        { label: "Non-Conformance Records", desc: "Review open NCRs & supplier claims", icon: FileSpreadsheet, action: "tab", tabIndex: 1 },
        { label: "Product Scrap Breakdown", desc: "Scrap quantity per product line", icon: Layers, action: "scroll", target: '[aria-label="Product and Machine Performance"]' },
      ],
    },
    downtime: {
      title: "Equipment Downtime",
      subtitle: "Unplanned stoppages, scheduled preventative maintenance & reliability metrics",
      value: `${kpi.downtimeHours || 186}`,
      unit: "hours",
      change: `${kpi.downtimeChangePercent || -12.5}% downtime reduction`,
      isGood: true,
      icon: Clock,
      badgeColor: "text-amber-600",
      badgeBg: "bg-amber-50 border-amber-200",
      accentColor: "from-amber-500 to-orange-600",
      statusTag: "Across 5 Plant Machinery Assets",
      tabs: [
        {
          name: "Breakdown vs Scheduled Maintenance",
          tagline: "Proportion of planned preventative servicing vs unplanned operational halts",
          icon: Wrench,
          description:
            "Total cumulative plant downtime across all 5 assets is 186 hours for the current accounting period, reflecting a 12.5% reduction compared to last month.",
          keyMetrics: [
            { label: "Total Plant Downtime", val: "186 hrs", sub: "All 5 production assets", color: "text-amber-600" },
            { label: "Scheduled Maintenance (PM)", val: "128 hrs", sub: "68.8% planned servicing", color: "text-blue-600" },
            { label: "Unplanned Stoppages", val: "58 hrs", sub: "31.2% minor pauses & jams", color: "text-rose-600" },
            { label: "Plant Availability Index", val: "96.4%", sub: "Industry target: ≥ 95.0%", color: "text-emerald-600" },
          ],
          bulletPoints: [
            "Packaging Machine 2 accounts for 48.0 hours of scheduled maintenance during belt overhaul.",
            "Baking Oven 2 logged 18.5 hours due to rotary deck bearing lubrication and thermal sensor calibration.",
            "Mixer 1 logged 6.8 hours of sanitation washdown between flavor changeovers.",
            "Baking Oven 1 achieved outstanding reliability with only 4.2 hours total downtime.",
          ],
          recommendation:
            "Complete final tension calibration on Packaging Machine 2 conveyor belt before night shift release.",
        },
        {
          name: "Equipment Reliability Metrics (MTBF & MTTR)",
          tagline: "Mean Time Between Failures and Mean Time To Repair benchmarks",
          icon: Cpu,
          description:
            "Plant equipment demonstrates high mechanical reliability with an average Mean Time Between Failures (MTBF) of 142 operating hours and rapid repair turnaround (MTTR: 1.8 hrs).",
          keyMetrics: [
            { label: "Mean Time Between Failures (MTBF)", val: "142 hrs", sub: "Benchmark: ≥ 120 hrs", color: "text-emerald-600" },
            { label: "Mean Time To Repair (MTTR)", val: "1.8 hrs", sub: "Benchmark: ≤ 2.5 hrs", color: "text-blue-600" },
            { label: "First-Time Fix Rate", val: "94.5%", sub: "Maintenance team resolution", color: "text-cyan-600" },
            { label: "Critical Spare Availability", val: "98.2%", sub: "MRO stock readiness", color: "text-purple-600" },
          ],
          bulletPoints: [
            "On-site maintenance technicians equipped with digital tablet diagnostics for rapid PLC fault isolation.",
            "Predictive vibration sensors installed on oven drive motors provide 48-hour advance failure warning.",
            "Zero catastrophic motor burnouts recorded in the past 180 operating days.",
          ],
          recommendation:
            "Replenish high-temperature food-grade synthetic lubricant inventory in MRO spare parts crib.",
        },
        {
          name: "Downtime Pareto by Root Cause",
          tagline: "Statistical breakdown of root stoppage reasons across all work centers",
          icon: AlertTriangle,
          description:
            "Root cause analysis indicates that mechanical wear and changeover cleaning constitute 60% of all recorded downtime minutes.",
          keyMetrics: [
            { label: "Conveyor Belt Wear & Overhaul", val: "65 hrs", sub: "35% of total downtime", color: "text-amber-600" },
            { label: "Thermal Sensor Calibration", val: "46 hrs", sub: "25% of total downtime", color: "text-blue-600" },
            { label: "Sanitation & Allergen Clean", val: "37 hrs", sub: "20% of total downtime", color: "text-cyan-600" },
            { label: "Material Staging Wait", val: "38 hrs", sub: "20% of total downtime", color: "text-slate-600" },
          ],
          bulletPoints: [
            "Mechanical belt overhaul on Packager 2 is a 1-in-6-month routine preventative overhaul.",
            "Allergen washdowns strictly enforced when switching from Chocolate (cocoa) to Butter biscuits.",
            "Raw material waiting delays have been cut by 50% following line-side staging buffer implementation.",
          ],
          recommendation:
            "Schedule upcoming allergen sanitizations during shift turnover to minimize active production disruption.",
        },
        {
          name: "Preventative Maintenance (PM) Work Orders",
          tagline: "Upcoming planned equipment servicing schedule and technician assignments",
          icon: ClipboardCheck,
          description:
            "Upcoming preventative maintenance work orders scheduled for the next 72 hours across the plant floor.",
          keyMetrics: [
            { label: "WO-PM-2026-088", val: "Baking Oven 1", sub: "Heating coil thermal scan", color: "text-blue-600" },
            { label: "WO-PM-2026-091", val: "Packaging Machine 2", sub: "Belt tensioning & sign-off", color: "text-amber-600" },
            { label: "WO-PM-2026-094", val: "Mixer 1", sub: "Gearbox oil flush & seal test", color: "text-purple-600" },
            { label: "PM Schedule Adherence", val: "97.4%", sub: "On-time maintenance closure", color: "text-emerald-600" },
          ],
          bulletPoints: [
            "All maintenance logs digitized and synced with ERP asset management records.",
            "Technician sign-offs include ATP swab hygiene certification prior to food contact surface release.",
            "Automated spare parts deduction applied on MRO inventory ledger upon work order closure.",
          ],
          recommendation:
            "Execute WO-PM-2026-091 sign-off before 22:00 to release Packaging Machine 2 for Night shift Salted Biscuit run.",
        },
      ],
      relatedFilter: {
        filterType: "machine",
        filterValue: "Packaging Machine 2",
        buttonText: "Filter Orders on Maintenance-Affected Machine",
      },
      quickLinks: [
        { label: "Equipment Asset Registry", desc: "View all 5 plant machinery status logs", icon: Wrench, action: "route", href: "/machines" },
        { label: "Maintenance Work Orders", desc: "Create or track PM work tickets", icon: ClipboardCheck, action: "tab", tabIndex: 3 },
        { label: "Machine Performance Table", desc: "Utilization & output per asset", icon: Cpu, action: "scroll", target: '[aria-label="Product and Machine Performance"]' },
      ],
    },
    completed: {
      title: "Completed Orders",
      subtitle: "Finished batch release, On-Time In-Full (OTIF) fulfillment & warehouse transfers",
      value: `${kpi.completedOrders || 42}`,
      unit: "jobs",
      change: `+${kpi.completedChangePercent || 14.3}% batch closure rate`,
      isGood: true,
      icon: ClipboardCheck,
      badgeColor: "text-purple-600",
      badgeBg: "bg-purple-50 border-purple-200",
      accentColor: "from-purple-500 to-indigo-600",
      statusTag: "Batches Closed on Time & Transferred to Warehouse",
      tabs: [
        {
          name: "On-Time In-Full (OTIF) Dispatch",
          tagline: "Delivery punctuality and quantity fulfillment for completed production orders",
          icon: Truck,
          description:
            "42 production work orders have been successfully completed and released during the current cycle, maintaining an outstanding 97.6% On-Time In-Full (OTIF) fulfillment rate.",
          keyMetrics: [
            { label: "Completed Batches", val: "42 Batches", sub: "100% quantity fulfilled", color: "text-purple-600" },
            { label: "OTIF Punctuality Rate", val: "97.6%", sub: "41 out of 42 on schedule", color: "text-emerald-600" },
            { label: "Average Cycle Turnaround", val: "6.4 hrs", sub: "Per completed batch", color: "text-blue-600" },
            { label: "Total Good Units Closed", val: "139,250 u", sub: "Ready for distribution", color: "text-cyan-600" },
          ],
          bulletPoints: [
            "PROD-00003 (Marie Biscuit): 20,000 units completed with 100% yield efficiency and zero downtime.",
            "PROD-00007 (Chocolate Biscuit Export): 12,000 units packed in moisture barrier cartons for export.",
            "All completed master batches stamped with GS1-128 compliance barcodes and expiration date stamps.",
          ],
          recommendation:
            "Generate dispatch paperwork for export batch PROD-00007 to clear customs staging dock.",
        },
        {
          name: "Batch Release & QA Clearance Certificates",
          tagline: "Quality assurance sign-offs, Certificates of Analysis (CoA) & traceability",
          icon: CheckCircle,
          description:
            "Every closed production batch undergoes automated CoA generation, sensory evaluation sign-off, and metal detector verification before being cleared for warehouse storage.",
          keyMetrics: [
            { label: "CoA Certificates Issued", val: "42 Signed", sub: "Digital QA sign-off", color: "text-emerald-600" },
            { label: "Microbiological Clearance", val: "100% Pass", sub: "Zero pathogens detected", color: "text-emerald-600" },
            { label: "Moisture Content Average", val: "2.8%", sub: "Target range: 2.5% - 3.2%", color: "text-blue-600" },
            { label: "Metal Detector Validation", val: "100% Pass", sub: "Ferrous & non-ferrous test", color: "text-purple-600" },
          ],
          bulletPoints: [
            "Digital QA signatures recorded in PostgreSQL database with ISO 22000 and HACCP audit compliance.",
            "Full forward and backward batch pedigree traceable back to supplier farm silos.",
            "Retained reference samples archived in climate-controlled quality laboratory for 12 months.",
          ],
          recommendation:
            "Archive digital batch records into compliance vault for upcoming annual food safety audit.",
        },
        {
          name: "Finished Goods Warehouse Transfer",
          tagline: "Automated stock transfer from shopfloor buffer to distribution storage bays",
          icon: Boxes,
          description:
            "Completed batches are automatically transferred from shopfloor output buffers into Warehouse Bay 3 and high-density racking via automated guided vehicles (AGV).",
          keyMetrics: [
            { label: "Pallets Transferred to Stock", val: "186 Pallets", sub: "Standard Euro pallets", color: "text-cyan-600" },
            { label: "Warehouse Bay Utilization", val: "74.2%", sub: "Bay 3 racking capacity", color: "text-blue-600" },
            { label: "Average Put-away Time", val: "14 mins", sub: "From line end to rack", color: "text-emerald-600" },
            { label: "Inventory Ledger Sync", val: "Instant", sub: "Real-time ERP ledger update", color: "text-purple-600" },
          ],
          bulletPoints: [
            "Automated stock level increment occurs simultaneously with work order completion.",
            "FIFO (First-In, First-Out) rotation logic assigned to ensure fresh product distribution.",
            "Warehouse pick lists automatically generated for outbound supermarket fulfillment trucks.",
          ],
          recommendation:
            "Ensure Bay 3 cold aisle maintains 20°C ambient temperature for chocolate-coated inventory.",
        },
        {
          name: "Standard vs Actual Cost Reconciliation",
          tagline: "Variance analysis on labor, raw material usage, and machine utility expenses",
          icon: FileSpreadsheet,
          description:
            "Financial costing reconciliation on the 42 completed orders shows favorable cost variance due to high yield efficiency and reduced scrap rates.",
          keyMetrics: [
            { label: "Standard Cost Target", val: "$0.38 / unit", sub: "BOM + labor baseline", color: "text-slate-600" },
            { label: "Actual Realized Cost", val: "$0.36 / unit", sub: "Favorable variance: -$0.02/u", color: "text-emerald-600" },
            { label: "Net Cost Savings", val: "+$2,785.00", sub: "Across 42 closed batches", color: "text-emerald-600" },
            { label: "Labor Productivity Rate", val: "385 u/man-hr", sub: "Target: 360 u/man-hr", color: "text-blue-600" },
          ],
          bulletPoints: [
            "Favorable material yield on Marie and Butter biscuits drove lower unit manufacturing costs.",
            "Energy consumption per kilogram of baked goods decreased by 4.2% on Oven 1.",
            "All work-in-progress (WIP) balances successfully cleared to finished goods inventory.",
          ],
          recommendation:
            "Submit quarterly cost variance report to Finance controller for standard cost card updates.",
        },
      ],
      relatedFilter: {
        filterType: "status",
        filterValue: "Completed",
        buttonText: "Filter Completed Orders in Table",
      },
      quickLinks: [
        { label: "Finished Goods Inventory", desc: "Inspect warehouse stock by SKU", icon: Boxes, action: "route", href: "/inventory" },
        { label: "Batch Release Certificates", desc: "Download QA CoA compliance PDFs", icon: CheckCircle, action: "tab", tabIndex: 1 },
        { label: "Order Cost Reconciliation", desc: "Review unit cost accounting ledgers", icon: FileSpreadsheet, action: "tab", tabIndex: 3 },
      ],
    },
  };

  const currentTopic = topicConfigs[topicId];
  if (!currentTopic) return null;

  const Icon = currentTopic.icon;
  const currentTab = currentTopic.tabs[activeTab] || currentTopic.tabs[0];
  const TabIcon = currentTab.icon;

  const handleApplyFilter = () => {
    if (onApplyFilter) {
      onApplyFilter(
        currentTopic.relatedFilter.filterType,
        currentTopic.relatedFilter.filterValue
      );
      if (onShowNotification) {
        onShowNotification(
          `Filtered production orders by ${currentTopic.relatedFilter.filterType}: "${currentTopic.relatedFilter.filterValue}"`
        );
      }
      onClose();
      // Smooth scroll down to the orders table
      setTimeout(() => {
        const tableEl = document.querySelector('[aria-label="Production Orders List"]');
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-2xl border ${currentTopic.badgeBg} ${currentTopic.badgeColor} shadow-sm shrink-0 mt-0.5`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Production KPI Deep Dive
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/70 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    {currentTopic.statusTag}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentTopic.title}
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {currentTopic.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {currentTopic.value}
              </span>
              {currentTopic.unit && (
                <span className="text-sm font-semibold text-slate-500">
                  {currentTopic.unit}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                  currentTopic.isGood
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{currentTopic.change}</span>
              </span>

              <button
                onClick={handleApplyFilter}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <Filter className="w-3.5 h-3.5 text-white" />
                <span>Filter Orders Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation: Related Topics */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 pt-2 shrink-0 overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 min-w-max">
            {currentTopic.tabs.map((tab, idx) => {
              const TabNavIcon = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
                    isActive
                      ? "bg-white text-blue-700 border-slate-200 shadow-xs translate-y-[1px]"
                      : "bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60"
                  }`}
                >
                  <TabNavIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-white">
          {/* Active Topic Tagline & Description */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <TabIcon className="w-4 h-4 text-blue-600" />
              <span>{currentTab.tagline}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentTab.description}
            </p>
          </div>

          {/* Key Metric Highlights for this Topic */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentTab.keyMetrics.map((met, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 transition"
              >
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">
                  {met.label}
                </span>
                <div
                  className={`text-lg sm:text-xl font-extrabold font-mono tracking-tight ${
                    met.color || "text-slate-900"
                  }`}
                >
                  {met.val}
                </div>
                {met.sub && (
                  <span className="text-[10px] text-slate-500 block font-medium leading-tight">
                    {met.sub}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Key Topic Insights & Operating Points */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Operational Breakdown & Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentTab.bulletPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SOP & Operational Recommendation Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              Standard Operating Procedure (SOP) Recommendation
            </div>
            <p className="text-slate-800 leading-relaxed pl-6">
              {currentTab.recommendation}
            </p>
          </div>

          {/* Related System Modules & Quick Links */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Connected Manufacturing Topics & Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentTopic.quickLinks.map((link, idx) => {
                const LinkIcon = link.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition group flex items-start gap-3 cursor-pointer shadow-xs active:scale-[0.98]"
                    onClick={() => {
                      if (link.action === "tab" && typeof link.tabIndex === "number") {
                        setActiveTab(link.tabIndex);
                        if (onShowNotification) {
                          onShowNotification(`Switched to "${link.label}" topic tab.`);
                        }
                      } else if (link.action === "route" && link.href) {
                        onClose();
                        if (onShowNotification) {
                          onShowNotification(`Navigating to ${link.label}...`);
                        }
                        router.push(link.href);
                      } else if (link.action === "scroll" && link.target) {
                        onClose();
                        if (onShowNotification) {
                          onShowNotification(`Scrolled to ${link.label}`);
                        }
                        setTimeout(() => {
                          const el = document.querySelector(link.target!);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 150);
                      } else {
                        if (onShowNotification) {
                          onShowNotification(`Viewing context for ${link.label}`);
                        }
                      }
                    }}
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition flex items-center justify-between">
                        <span>{link.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-tight">
                        {link.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Clicking below filters the orders table directly by this metric.</span>
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
            >
              Close
            </button>

            <button
              onClick={handleApplyFilter}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-white" />
              <span>{currentTopic.relatedFilter.buttonText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
