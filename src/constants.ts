import type { DashboardFilters, DashboardTimeRange, GraphConfig, GraphOption } from "./types";

export const graphOptions: GraphOption[] = [
  {
    type: "line",
    label: "Line graph",
    description: "Trend over time",
  },
  {
    type: "bar",
    label: "Bar graph",
    description: "Compare categories",
  },
  {
    type: "pie",
    label: "Pie chart",
    description: "Show proportions",
  },
  {
    type: "area",
    label: "Area graph",
    description: "Trend with volume",
  },
  {
    type: "scatter",
    label: "Scatter graph",
    description: "Find relationships",
  },
  {
    type: "gauge",
    label: "Gauge",
    description: "Show progress",
  },
  {
    type: "single-value",
    label: "Single value",
    description: "Show one KPI",
  },
  {
    type: "table",
    label: "Table",
    description: "Show rows of data",
  },
];

export const sidebarGraphDataType = "application/x-graph-type";

export const emptyGraphConfig: GraphConfig = {
  kpi: "",
};

export const defaultGraphSize = {
  width: 460,
  height: 420,
};

export const minGraphSize = {
  width: 320,
  height: 320,
};

export const maxGraphSize = {
  width: 900,
  height: 760,
};

export const timeRangeOptions = [
  { value: "last-1-hour", label: "Last 1 hour" },
  { value: "last-6-hours", label: "Last 6 hours" },
  { value: "last-24-hours", label: "Last 24 hours" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
  { value: "all", label: "All available data" },
  { value: "custom", label: "Custom range" },
];

export const defaultTimeRange: DashboardTimeRange = {
  mode: "last-30-days",
  customStart: "",
  customEnd: "",
};

export const defaultDashboardFilters: DashboardFilters = {
  department: "",
  productionLine: "",
  safetyArea: "",
  sequence: "",
  workstation: "",
};

export const timelineStart = new Date("2026-01-01T00:00:00");
export const timelineEnd = new Date("2026-12-31T23:59:59");
export const timelineStartMs = timelineStart.getTime();
export const timelineEndMs = timelineEnd.getTime();
