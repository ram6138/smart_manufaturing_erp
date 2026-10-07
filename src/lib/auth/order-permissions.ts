import { UserRole } from "@/types/auth";

export interface OrderPermissions {
  canView: boolean;
  canCreate: boolean;
  canUpdateStatus: boolean;
  canDelete: boolean;
  canViewFinancials: boolean;
  roleBadgeColor: string;
  roleDescription: string;
}

export function getOrderPermissions(role?: UserRole | null): OrderPermissions {
  if (!role) {
    return {
      canView: true,
      canCreate: false,
      canUpdateStatus: false,
      canDelete: false,
      canViewFinancials: false,
      roleBadgeColor: "slate",
      roleDescription: "Guest / Unauthenticated View",
    };
  }

  switch (role) {
    case "Admin":
      return {
        canView: true,
        canCreate: true,
        canUpdateStatus: true,
        canDelete: true,
        canViewFinancials: true,
        roleBadgeColor: "rose",
        roleDescription: "Full Master Access: Create, Update Status, & Hard Delete Orders",
      };

    case "Factory Manager":
      return {
        canView: true,
        canCreate: true,
        canUpdateStatus: true,
        canDelete: true,
        canViewFinancials: true,
        roleBadgeColor: "amber",
        roleDescription: "Executive Oversight: Create, Advance Status, & Cancel Orders",
      };

    case "Production Manager":
      return {
        canView: true,
        canCreate: true,
        canUpdateStatus: true,
        canDelete: false, // Production planner schedules & advances, but cannot delete active sales records
        canViewFinancials: false, // Line-level operational view
        roleBadgeColor: "blue",
        roleDescription: "Manufacturing Execution: Register Orders & Advance Production Workflows",
      };

    case "Finance Manager":
      return {
        canView: true,
        canCreate: false,
        canUpdateStatus: false,
        canDelete: false,
        canViewFinancials: true,
        roleBadgeColor: "teal",
        roleDescription: "Financial Oversight: Audit Order Revenue & Margins (Read-Only)",
      };

    case "Inventory Manager":
      return {
        canView: true,
        canCreate: false,
        canUpdateStatus: false,
        canDelete: false,
        canViewFinancials: false,
        roleBadgeColor: "emerald",
        roleDescription: "Material Supply: Stock Allocation & Packet Fulfillment (Read-Only)",
      };

    case "Procurement Manager":
      return {
        canView: true,
        canCreate: false,
        canUpdateStatus: false,
        canDelete: false,
        canViewFinancials: false,
        roleBadgeColor: "cyan",
        roleDescription: "Raw Material Sourcing: Inbound Schedule Alignment (Read-Only)",
      };

    case "Quality Manager":
      return {
        canView: true,
        canCreate: false,
        canUpdateStatus: false,
        canDelete: false,
        canViewFinancials: false,
        roleBadgeColor: "purple",
        roleDescription: "QA Auditing: Batch Inspection Requirements (Read-Only)",
      };

    case "Maintenance Manager":
    case "HR Manager":
    default:
      return {
        canView: true,
        canCreate: false,
        canUpdateStatus: false,
        canDelete: false,
        canViewFinancials: false,
        roleBadgeColor: "slate",
        roleDescription: "Standard Access: Read-Only Order Visibility",
      };
  }
}
