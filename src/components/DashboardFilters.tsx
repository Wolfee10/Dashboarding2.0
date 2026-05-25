import type { DashboardFilters as DashboardFilterValues } from "../types";

type DashboardFiltersProps = {
  filters: DashboardFilterValues;
  onFilterChange: (field: keyof DashboardFilterValues, value: string) => void;
};

export function DashboardFilters({ filters, onFilterChange }: DashboardFiltersProps) {
  return (
    <section className="dashboard-filters" aria-label="Dashboard filters">
      <label>
        <span>Select Department</span>
        <select value={filters.department} onChange={(event) => onFilterChange("department", event.target.value)}>
          <option value="">All Departments</option>
        </select>
      </label>

      <label>
        <span>Select Production Line</span>
        <select value={filters.productionLine} onChange={(event) => onFilterChange("productionLine", event.target.value)}>
          <option value="">All Production Lines</option>
        </select>
      </label>

      <label>
        <span>Select Safety Area</span>
        <select value={filters.safetyArea} onChange={(event) => onFilterChange("safetyArea", event.target.value)}>
          <option value="">All Safety Areas</option>
        </select>
      </label>

      <label>
        <span>Select Sequence</span>
        <select value={filters.sequence} onChange={(event) => onFilterChange("sequence", event.target.value)}>
          <option value="">All Sequences</option>
        </select>
      </label>

      <label>
        <span>Select WorkStation</span>
        <select value={filters.workstation} onChange={(event) => onFilterChange("workstation", event.target.value)}>
          <option value="">All WorkStations</option>
        </select>
      </label>
    </section>
  );
}
