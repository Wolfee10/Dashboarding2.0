import React from "react";
import ReactDOM from "react-dom/client";
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";
import "./styles.css";

type GraphType = "line" | "bar" | "pie" | "area" | "scatter" | "gauge" | "table" | "single-value";

type GraphOption = {
  type: GraphType;
  label: string;
  description: string;
};

type GraphConfig = {
  kpi: string;
};

type DashboardGraph = GraphOption & {
  id: string;
  config: GraphConfig;
  refreshedAt: string | null;
  isRefreshing: boolean;
};

type DashboardTimeRange = {
  mode: string;
  customStart: string;
  customEnd: string;
};

const graphOptions: GraphOption[] = [
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

const sidebarGraphDataType = "application/x-graph-type";
const canvasGraphDataType = "application/x-dashboard-graph-id";

const emptyGraphConfig: GraphConfig = {
  kpi: "",
};

const timeRangeOptions = [
  { value: "last-1-hour", label: "Last 1 hour" },
  { value: "last-6-hours", label: "Last 6 hours" },
  { value: "last-24-hours", label: "Last 24 hours" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
  { value: "all", label: "All available data" },
  { value: "custom", label: "Custom range" },
];

const defaultTimeRange: DashboardTimeRange = {
  mode: "last-30-days",
  customStart: "",
  customEnd: "",
};

const timelineStart = new Date("2026-01-01T00:00:00");
const timelineEnd = new Date("2026-12-31T23:59:59");
const timelineStartMs = timelineStart.getTime();
const timelineEndMs = timelineEnd.getTime();

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDisplayDateTime(value: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTimelineValue(clientX: number, element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  const position = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
  const timestamp = timelineStartMs + position * (timelineEndMs - timelineStartMs);

  return formatDateTimeLocal(new Date(timestamp));
}

function getTimeRangeLabel(range: DashboardTimeRange) {
  const selectedOption = timeRangeOptions.find((option) => option.value === range.mode);

  if (range.mode !== "custom") {
    return selectedOption?.label ?? "Time range";
  }

  return `${formatDisplayDateTime(range.customStart)} - ${formatDisplayDateTime(range.customEnd)}`;
}

function getChartOption(type: GraphType): EChartsOption {
  if (type === "gauge") {
    return {
      series: [
        {
          type: "gauge",
          data: [],
        },
      ],
    };
  }

  if (type === "pie") {
    return {
      series: [
        {
          type: "pie",
          radius: ["46%", "68%"],
          data: [],
        },
      ],
    };
  }

  return {
    grid: {
      top: 24,
      right: 18,
      bottom: 28,
      left: 36,
    },
    xAxis: {
      type: "category",
      data: [],
      axisLine: { lineStyle: { color: "#d9e1ea" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#edf1f5" } },
    },
    series: [
      {
        type: type === "area" ? "line" : type === "scatter" ? "scatter" : "bar",
        areaStyle: type === "area" ? {} : undefined,
        data: [],
      },
    ],
  };
}

function ChartPreview({ type }: { type: GraphType }) {
  const chartRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!chartRef.current) return;

    let chart: EChartsType | null = null;
    let isDisposed = false;

    async function renderChart() {
      const [
        { BarChart, GaugeChart, LineChart, PieChart, ScatterChart },
        { GridComponent },
        echarts,
        { CanvasRenderer },
      ] = await Promise.all([
        import("echarts/charts"),
        import("echarts/components"),
        import("echarts/core"),
        import("echarts/renderers"),
      ]);

      if (isDisposed || !chartRef.current) return;

      echarts.use([BarChart, GaugeChart, GridComponent, LineChart, PieChart, ScatterChart, CanvasRenderer]);
      chart = echarts.init(chartRef.current);
      chart.setOption(getChartOption(type));
    }

    const resize = () => chart?.resize();
    window.addEventListener("resize", resize);
    void renderChart();

    return () => {
      isDisposed = true;
      window.removeEventListener("resize", resize);
      chart?.dispose();
    };
  }, [type]);

  return (
    <div className="chart-shell">
      <div className="chart-preview" ref={chartRef} />
      <div className="chart-placeholder">No KPI Connected</div>
    </div>
  );
}

function GraphDiagram({ type }: { type: GraphType }) {
  if (type === "single-value") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Single value preview">
        <rect className="diagram-value-card" x="14" y="10" width="68" height="34" rx="6" />
        <path className="diagram-value-line" d="M25 21H56M25 31H72" />
      </svg>
    );
  }

  if (type === "table") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Table preview">
        <rect className="diagram-table-outline" x="14" y="10" width="68" height="34" rx="4" />
        <path className="diagram-table-line" d="M14 21H82M14 32H82M35 10V44M60 10V44" />
      </svg>
    );
  }

  if (type === "gauge") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Gauge preview">
        <path className="diagram-gauge-track" d="M25 38a23 23 0 0 1 46 0" />
        <path className="diagram-gauge-fill" d="M25 38a23 23 0 0 1 34-20" />
        <path className="diagram-gauge-needle" d="M48 38L62 24" />
        <circle className="diagram-point" cx="48" cy="38" r="3" />
      </svg>
    );
  }

  if (type === "scatter") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Scatter graph preview">
        <path className="diagram-grid" d="M10 14H88M10 30H88M10 46H88" />
        <path className="diagram-axis" d="M10 7V46H90" />
        <circle className="diagram-point" cx="24" cy="34" r="3" />
        <circle className="diagram-point" cx="36" cy="25" r="3" />
        <circle className="diagram-point" cx="50" cy="31" r="3" />
        <circle className="diagram-point" cx="61" cy="17" r="3" />
        <circle className="diagram-point" cx="76" cy="22" r="3" />
      </svg>
    );
  }

  if (type === "area") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Area graph preview">
        <path className="diagram-grid" d="M10 14H88M10 30H88M10 46H88" />
        <path className="diagram-axis" d="M10 7V46H90" />
        <path className="diagram-area" d="M14 40L30 31L45 35L62 19L84 13V46H14Z" />
        <path className="diagram-line" d="M14 40L30 31L45 35L62 19L84 13" />
      </svg>
    );
  }

  if (type === "line") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Line graph preview">
        <path className="diagram-grid" d="M10 14H88M10 30H88M10 46H88" />
        <path className="diagram-axis" d="M10 7V46H90" />
        <path className="diagram-line" d="M14 39L30 30L45 34L62 18L84 12" />
        <circle className="diagram-point" cx="14" cy="39" r="3" />
        <circle className="diagram-point" cx="30" cy="30" r="3" />
        <circle className="diagram-point" cx="45" cy="34" r="3" />
        <circle className="diagram-point" cx="62" cy="18" r="3" />
        <circle className="diagram-point" cx="84" cy="12" r="3" />
      </svg>
    );
  }

  if (type === "bar") {
    return (
      <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Bar graph preview">
        <path className="diagram-grid" d="M10 14H88M10 30H88M10 46H88" />
        <path className="diagram-axis" d="M10 7V46H90" />
        <rect className="diagram-bar" x="18" y="29" width="10" height="17" rx="2" />
        <rect className="diagram-bar" x="36" y="18" width="10" height="28" rx="2" />
        <rect className="diagram-bar" x="54" y="25" width="10" height="21" rx="2" />
        <rect className="diagram-bar" x="72" y="11" width="10" height="35" rx="2" />
      </svg>
    );
  }

  return (
    <svg className="graph-diagram" viewBox="0 0 96 54" role="img" aria-label="Pie chart preview">
      <circle className="diagram-pie-base" cx="48" cy="27" r="19" />
      <path className="diagram-pie-slice-a" d="M48 27V8a19 19 0 0 1 17.9 25.4Z" />
      <path className="diagram-pie-slice-b" d="M48 27l17.9 6.4A19 19 0 0 1 35.6 41.2Z" />
      <circle className="diagram-pie-hole" cx="48" cy="27" r="8" />
    </svg>
  );
}

function App() {
  const [graphs, setGraphs] = React.useState<DashboardGraph[]>([]);
  const [graphSearch, setGraphSearch] = React.useState("");
  const [dashboardFilters, setDashboardFilters] = React.useState({
    department: "",
    productionLine: "",
    safetyArea: "",
    sequence: "",
    workstation: "",
  });
  const [timeRange, setTimeRange] = React.useState<DashboardTimeRange>(defaultTimeRange);
  const [draftTimeRange, setDraftTimeRange] = React.useState<DashboardTimeRange>(defaultTimeRange);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = React.useState(false);
  const [timelineDragStart, setTimelineDragStart] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [draggedGraphId, setDraggedGraphId] = React.useState<string | null>(null);
  const [dropTargetGraphId, setDropTargetGraphId] = React.useState<string | null>(null);
  const [configuringGraphId, setConfiguringGraphId] = React.useState<string | null>(null);

  const configuringGraph = graphs.find((graph) => graph.id === configuringGraphId) ?? null;
  const filteredGraphOptions = graphOptions.filter((option) => {
    const searchableText = `${option.label} ${option.description}`.toLowerCase();

    return searchableText.includes(graphSearch.trim().toLowerCase());
  });

  function handleDragStart(event: React.DragEvent<HTMLElement>, option: GraphOption) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(sidebarGraphDataType, option.type);
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = event.dataTransfer.types.includes(canvasGraphDataType) ? "move" : "copy";
    setIsDragOver(true);
  }

  function moveGraph(sourceGraphId: string, targetGraphId: string | null) {
    setGraphs((currentGraphs) => {
      const sourceIndex = currentGraphs.findIndex((graph) => graph.id === sourceGraphId);

      if (sourceIndex === -1) return currentGraphs;

      const nextGraphs = [...currentGraphs];
      const [movedGraph] = nextGraphs.splice(sourceIndex, 1);

      if (!targetGraphId) {
        nextGraphs.push(movedGraph);
        return nextGraphs;
      }

      const targetIndex = nextGraphs.findIndex((graph) => graph.id === targetGraphId);

      if (targetIndex === -1) return currentGraphs;

      nextGraphs.splice(targetIndex, 0, movedGraph);
      return nextGraphs;
    });
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragOver(false);
    setDropTargetGraphId(null);

    if (event.dataTransfer.types.includes(canvasGraphDataType)) {
      const sourceGraphId = event.dataTransfer.getData(canvasGraphDataType);

      if (sourceGraphId) {
        moveGraph(sourceGraphId, null);
      }

      setDraggedGraphId(null);
      return;
    }

    const graphType = event.dataTransfer.getData(sidebarGraphDataType) as GraphType;
    const selectedOption = graphOptions.find((option) => option.type === graphType);

    if (!selectedOption) return;

    const newGraph: DashboardGraph = {
      ...selectedOption,
      config: emptyGraphConfig,
      id: crypto.randomUUID(),
      isRefreshing: false,
      refreshedAt: null,
    };

    setGraphs((currentGraphs) => [...currentGraphs, newGraph]);
    setConfiguringGraphId(newGraph.id);
  }

  function handleCanvasDragLeave(event: React.DragEvent<HTMLElement>) {
    const nextElement = event.relatedTarget;

    if (nextElement instanceof Node && event.currentTarget.contains(nextElement)) {
      return;
    }

    setIsDragOver(false);
  }

  function handleGraphDragStart(event: React.DragEvent<HTMLButtonElement>, graphId: string) {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(canvasGraphDataType, graphId);
    setDraggedGraphId(graphId);
  }

  function handleGraphDragOver(event: React.DragEvent<HTMLElement>, targetGraphId: string) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";

    if (draggedGraphId && draggedGraphId !== targetGraphId) {
      setDropTargetGraphId(targetGraphId);
    }
  }

  function handleGraphDrop(event: React.DragEvent<HTMLElement>, targetGraphId: string) {
    event.preventDefault();
    event.stopPropagation();

    const sourceGraphId = event.dataTransfer.getData(canvasGraphDataType);

    setDraggedGraphId(null);
    setDropTargetGraphId(null);
    setIsDragOver(false);

    if (!sourceGraphId || sourceGraphId === targetGraphId) return;

    moveGraph(sourceGraphId, targetGraphId);
  }

  function handleGraphDragEnd() {
    setDraggedGraphId(null);
    setDropTargetGraphId(null);
    setIsDragOver(false);
  }

  function updateGraphConfig(graphId: string, field: keyof GraphConfig, value: string) {
    setGraphs((currentGraphs) =>
      currentGraphs.map((graph) =>
        graph.id === graphId
          ? {
              ...graph,
              config: {
                ...graph.config,
                [field]: value,
              },
            }
          : graph,
      ),
    );
  }

  function updateDashboardFilter(field: keyof typeof dashboardFilters, value: string) {
    setDashboardFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function refreshGraphsForTimeRange(nextTimeRange: DashboardTimeRange) {
    setGraphs((currentGraphs) =>
      currentGraphs.map((graph) => ({
        ...graph,
        isRefreshing: true,
      })),
    );

    window.setTimeout(() => {
      setGraphs((currentGraphs) =>
        currentGraphs.map((graph) => ({
          ...graph,
          isRefreshing: false,
          refreshedAt: new Date().toISOString(),
        })),
      );
    }, 600);

    // Future endpoint call goes here, using nextTimeRange and each graph config.
    void nextTimeRange;
  }

  function openTimeMenu() {
    setDraftTimeRange(timeRange);
    setIsTimeMenuOpen(true);
  }

  function updateDraftTimeRange(nextRange: Partial<DashboardTimeRange>) {
    setDraftTimeRange((currentRange) => ({
      ...currentRange,
      ...nextRange,
    }));
  }

  function handleTimelinePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);

    const selectedDate = getTimelineValue(event.clientX, event.currentTarget);

    setTimelineDragStart(selectedDate);
    setDraftTimeRange({
      mode: "custom",
      customStart: selectedDate,
      customEnd: selectedDate,
    });
  }

  function handleTimelinePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!timelineDragStart) return;

    const selectedDate = getTimelineValue(event.clientX, event.currentTarget);
    const [customStart, customEnd] = [timelineDragStart, selectedDate].sort();

    updateDraftTimeRange({
      mode: "custom",
      customStart,
      customEnd,
    });
  }

  function handleTimelinePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setTimelineDragStart(null);
  }

  function applyTimeRange() {
    setTimeRange(draftTimeRange);
    setIsTimeMenuOpen(false);
    setTimelineDragStart(null);
    refreshGraphsForTimeRange(draftTimeRange);
  }

  const customRangeStartPercent = draftTimeRange.customStart
    ? ((new Date(draftTimeRange.customStart).getTime() - timelineStartMs) / (timelineEndMs - timelineStartMs)) * 100
    : 0;
  const customRangeEndPercent = draftTimeRange.customEnd
    ? ((new Date(draftTimeRange.customEnd).getTime() - timelineStartMs) / (timelineEndMs - timelineStartMs)) * 100
    : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Graph options">
        <div>
          <p className="eyebrow">SignalBoard</p>
          <h1>Dashboard builder</h1>
        </div>

        <label className="graph-search">
          <span>Search Graphs</span>
          <input
            type="search"
            value={graphSearch}
            onChange={(event) => setGraphSearch(event.target.value)}
            placeholder="Search By Graph Type"
          />
        </label>

        <div className="graph-list">
          {filteredGraphOptions.map((option) => (
            <div
              className="graph-option"
              draggable
              key={option.type}
              onDragStart={(event) => handleDragStart(event, option)}
              role="button"
              tabIndex={0}
            >
              <GraphDiagram type={option.type} />
              <span>{option.label}</span>
              <small>{option.description}</small>
            </div>
          ))}

          {filteredGraphOptions.length === 0 ? <p className="no-graphs-found">No Graphs Found</p> : null}
        </div>
      </aside>

      <main
        className={`canvas ${isDragOver ? "is-drag-over" : ""}`}
        onDragLeave={handleCanvasDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <section className="canvas-header">
          <div>
            <h2>Dashboard canvas</h2>
            <p>Drag a graph from the sidebar and drop it here.</p>
          </div>

          <div className="time-selector">
            <button className="time-selector-button" type="button" onClick={openTimeMenu}>
              <span>Time range</span>
              <strong>{getTimeRangeLabel(timeRange)}</strong>
            </button>

            {isTimeMenuOpen ? (
              <section className="time-popover" aria-label="Time range selector">
                <div className="time-presets">
                  {timeRangeOptions.map((option) => (
                    <button
                      className={draftTimeRange.mode === option.value ? "is-selected" : ""}
                      key={option.value}
                      type="button"
                      onClick={() => updateDraftTimeRange({ mode: option.value })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="time-custom-panel">
                  <div
                    className="time-timeline"
                    onPointerDown={handleTimelinePointerDown}
                    onPointerMove={handleTimelinePointerMove}
                    onPointerUp={handleTimelinePointerUp}
                    role="slider"
                    aria-label="Drag over timeline to select custom range"
                    aria-valuetext={`${formatDisplayDateTime(draftTimeRange.customStart)} to ${formatDisplayDateTime(
                      draftTimeRange.customEnd,
                    )}`}
                    tabIndex={0}
                  >
                    <div className="time-timeline-track">
                      {draftTimeRange.customStart && draftTimeRange.customEnd ? (
                        <div
                          className="time-timeline-selection"
                          style={{
                            left: `${Math.min(customRangeStartPercent, customRangeEndPercent)}%`,
                            width: `${Math.abs(customRangeEndPercent - customRangeStartPercent)}%`,
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="time-timeline-labels">
                      <span>Jan 2026</span>
                      <span>Dec 2026</span>
                    </div>
                  </div>

                  <div className="time-input-grid">
                    <label>
                      <span>From</span>
                      <input
                        type="datetime-local"
                        value={draftTimeRange.customStart}
                        onChange={(event) => updateDraftTimeRange({ mode: "custom", customStart: event.target.value })}
                      />
                    </label>
                    <label>
                      <span>To</span>
                      <input
                        type="datetime-local"
                        value={draftTimeRange.customEnd}
                        onChange={(event) => updateDraftTimeRange({ mode: "custom", customEnd: event.target.value })}
                      />
                    </label>
                  </div>

                  <div className="time-actions">
                    <button type="button" onClick={() => setIsTimeMenuOpen(false)}>
                      Cancel
                    </button>
                    <button className="time-apply-button" type="button" onClick={applyTimeRange}>
                      Apply
                    </button>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <section className="dashboard-filters" aria-label="Dashboard filters">
          <label>
            <span>Select Department</span>
            <select
              value={dashboardFilters.department}
              onChange={(event) => updateDashboardFilter("department", event.target.value)}
            >
              <option value="">All Departments</option>
            </select>
          </label>

          <label>
            <span>Select Production Line</span>
            <select
              value={dashboardFilters.productionLine}
              onChange={(event) => updateDashboardFilter("productionLine", event.target.value)}
            >
              <option value="">All Production Lines</option>
            </select>
          </label>

          <label>
            <span>Select Safety Area</span>
            <select
              value={dashboardFilters.safetyArea}
              onChange={(event) => updateDashboardFilter("safetyArea", event.target.value)}
            >
              <option value="">All Safety Areas</option>
            </select>
          </label>

          <label>
            <span>Select Sequence</span>
            <select
              value={dashboardFilters.sequence}
              onChange={(event) => updateDashboardFilter("sequence", event.target.value)}
            >
              <option value="">All Sequences</option>
            </select>
          </label>

          <label>
            <span>Select WorkStation</span>
            <select
              value={dashboardFilters.workstation}
              onChange={(event) => updateDashboardFilter("workstation", event.target.value)}
            >
              <option value="">All WorkStations</option>
            </select>
          </label>
        </section>

        {graphs.length === 0 ? (
          <section className="empty-dropzone" aria-label="Empty dashboard canvas">
            Drop graph here
          </section>
        ) : (
          <section className="graph-grid" aria-label="Dashboard graphs">
            {graphs.map((graph) => (
              <article
                className={`graph-card ${draggedGraphId === graph.id ? "is-dragging" : ""} ${
                  dropTargetGraphId === graph.id ? "is-drop-target" : ""
                }`}
                key={graph.id}
                onDragOver={(event) => handleGraphDragOver(event, graph.id)}
                onDrop={(event) => handleGraphDrop(event, graph.id)}
              >
                <div className="graph-card-header">
                  <h3>{graph.label}</h3>
                  <button
                    className="drag-handle"
                    draggable
                    onDragEnd={handleGraphDragEnd}
                    onDragStart={(event) => handleGraphDragStart(event, graph.id)}
                    type="button"
                  >
                    Drag to move
                  </button>
                </div>
                <button className="configure-button" type="button" onClick={() => setConfiguringGraphId(graph.id)}>
                  Configure graph
                </button>
                <div className="graph-refresh-status" aria-live="polite">
                  {graph.isRefreshing
                    ? "Refreshing graph data"
                    : graph.refreshedAt
                      ? `Refreshed ${new Intl.DateTimeFormat("en-GB", { timeStyle: "medium" }).format(new Date(graph.refreshedAt))}`
                      : "Waiting for data"}
                </div>
                <ChartPreview type={graph.type} />
              </article>
            ))}
          </section>
        )}
      </main>

      {configuringGraph ? (
        <div className="modal-backdrop" role="presentation">
          <section className="config-modal" role="dialog" aria-modal="true" aria-labelledby="config-title">
            <div className="config-header">
              <div>
                <p className="modal-eyebrow">Graph settings</p>
                <h2 id="config-title">{configuringGraph.label}</h2>
              </div>
              <button className="close-button" type="button" onClick={() => setConfiguringGraphId(null)}>
                Close
              </button>
            </div>

            <div className="config-form">
              <label>
                <span>Select KPI</span>
                <select
                  value={configuringGraph.config.kpi}
                  onChange={(event) => updateGraphConfig(configuringGraph.id, "kpi", event.target.value)}
                >
                  <option value="">No KPIs available yet</option>
                </select>
              </label>
            </div>

            <div className="config-actions">
              <button className="primary-action" type="button" onClick={() => setConfiguringGraphId(null)}>
                Apply
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
