export type GraphType = "line" | "bar" | "pie" | "area" | "scatter" | "gauge" | "table" | "single-value";

export type GraphOption = {
  type: GraphType;
  label: string;
  description: string;
};

export type GraphConfig = {
  kpi: string;
};

export type DashboardGraph = GraphOption & {
  id: string;
  config: GraphConfig;
  refreshedAt: string | null;
  isRefreshing: boolean;
  width: number;
  height: number;
};

export type DashboardTimeRange = {
  mode: string;
  customStart: string;
  customEnd: string;
};

export type DashboardFilters = {
  department: string;
  productionLine: string;
  safetyArea: string;
  sequence: string;
  workstation: string;
};

export type DropPosition = "before" | "after";

export type ResizeDirection = "right" | "bottom" | "corner";
