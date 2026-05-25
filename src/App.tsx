import React from "react";
import {
  defaultDashboardFilters,
  defaultGraphSize,
  defaultTimeRange,
  emptyGraphConfig,
  graphOptions,
  maxGraphSize,
  minGraphSize,
  sidebarGraphDataType,
} from "./constants";
import { DashboardCanvas } from "./components/DashboardCanvas";
import { GraphConfigModal } from "./components/GraphConfigModal";
import { Sidebar } from "./components/Sidebar";
import type {
  DashboardFilters,
  DashboardGraph,
  DashboardTimeRange,
  DropPosition,
  GraphConfig,
  GraphOption,
  GraphType,
  ResizeDirection,
} from "./types";
import { getTimelinePercent, getTimelineValue } from "./utils/timeRange";

export function App() {
  const [graphs, setGraphs] = React.useState<DashboardGraph[]>([]);
  const [graphSearch, setGraphSearch] = React.useState("");
  const [dashboardFilters, setDashboardFilters] = React.useState<DashboardFilters>(defaultDashboardFilters);
  const [timeRange, setTimeRange] = React.useState<DashboardTimeRange>(defaultTimeRange);
  const [draftTimeRange, setDraftTimeRange] = React.useState<DashboardTimeRange>(defaultTimeRange);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = React.useState(false);
  const [timelineDragStart, setTimelineDragStart] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [draggedGraphId, setDraggedGraphId] = React.useState<string | null>(null);
  const [dropTargetGraphId, setDropTargetGraphId] = React.useState<string | null>(null);
  const [dropPosition, setDropPosition] = React.useState<DropPosition>("before");
  const [configuringGraphId, setConfiguringGraphId] = React.useState<string | null>(null);
  const draggedGraphIdRef = React.useRef<string | null>(null);
  const dropPositionRef = React.useRef<DropPosition>("before");

  const configuringGraph = graphs.find((graph) => graph.id === configuringGraphId) ?? null;
  const filteredGraphOptions = graphOptions.filter((option) => {
    const searchableText = `${option.label} ${option.description}`.toLowerCase();

    return searchableText.includes(graphSearch.trim().toLowerCase());
  });

  function handleGraphDragStart(event: React.DragEvent<HTMLElement>, option: GraphOption) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(sidebarGraphDataType, option.type);
  }

  function handleCanvasDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }

  function handleCanvasDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragOver(false);
    setDropTargetGraphId(null);

    const graphType = event.dataTransfer.getData(sidebarGraphDataType) as GraphType;
    const selectedOption = graphOptions.find((option) => option.type === graphType);

    if (!selectedOption) return;

    const newGraph: DashboardGraph = {
      ...selectedOption,
      config: emptyGraphConfig,
      id: crypto.randomUUID(),
      isRefreshing: false,
      refreshedAt: null,
      ...defaultGraphSize,
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

  function moveGraph(sourceGraphId: string, targetGraphId: string | null, position: DropPosition = "before") {
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

      nextGraphs.splice(position === "after" ? targetIndex + 1 : targetIndex, 0, movedGraph);
      return nextGraphs;
    });
  }

  function clearGraphMoveState() {
    draggedGraphIdRef.current = null;
    dropPositionRef.current = "before";
    setDraggedGraphId(null);
    setDropTargetGraphId(null);
    setDropPosition("before");
    setIsDragOver(false);
  }

  function getGraphDropPosition(clientX: number, clientY: number, element: HTMLElement) {
    const bounds = element.getBoundingClientRect();
    const isWideLayout = bounds.width >= bounds.height;
    const pointerOffset = isWideLayout ? clientX - bounds.left : clientY - bounds.top;
    const targetMidpoint = isWideLayout ? bounds.width / 2 : bounds.height / 2;

    return pointerOffset > targetMidpoint ? "after" : "before";
  }

  function getGraphCardFromPoint(clientX: number, clientY: number) {
    for (const element of document.elementsFromPoint(clientX, clientY)) {
      if (element instanceof HTMLElement) {
        const card = element.closest("[data-graph-id]");

        if (card instanceof HTMLElement) {
          return card;
        }
      }
    }

    return null;
  }

  function handleGraphMoveStart(event: React.PointerEvent<HTMLButtonElement>, graphId: string) {
    event.preventDefault();
    event.stopPropagation();

    draggedGraphIdRef.current = graphId;
    setDraggedGraphId(graphId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const activeGraphId = draggedGraphIdRef.current;
      const targetCard = getGraphCardFromPoint(moveEvent.clientX, moveEvent.clientY);
      const targetGraphId = targetCard?.dataset.graphId;

      if (!activeGraphId || !targetCard || !targetGraphId || targetGraphId === activeGraphId) {
        setDropTargetGraphId(null);
        return;
      }

      const nextDropPosition = getGraphDropPosition(moveEvent.clientX, moveEvent.clientY, targetCard);

      dropPositionRef.current = nextDropPosition;
      setDropTargetGraphId(targetGraphId);
      setDropPosition(nextDropPosition);
      moveGraph(activeGraphId, targetGraphId, nextDropPosition);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      clearGraphMoveState();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function resizeGraph(graphId: string, width: number, height: number) {
    setGraphs((currentGraphs) =>
      currentGraphs.map((graph) =>
        graph.id === graphId
          ? {
              ...graph,
              width: Math.min(Math.max(width, minGraphSize.width), maxGraphSize.width),
              height: Math.min(Math.max(height, minGraphSize.height), maxGraphSize.height),
            }
          : graph,
      ),
    );
  }

  function handleGraphResizeStart(
    event: React.PointerEvent<HTMLDivElement>,
    graph: DashboardGraph,
    direction: ResizeDirection,
  ) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = graph.width;
    const startHeight = graph.height;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = direction === "bottom" ? startWidth : startWidth + moveEvent.clientX - startX;
      const nextHeight = direction === "right" ? startHeight : startHeight + moveEvent.clientY - startY;

      resizeGraph(graph.id, nextWidth, nextHeight);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
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

  function updateDashboardFilter(field: keyof DashboardFilters, value: string) {
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

  return (
    <div className="app-shell">
      <Sidebar
        graphOptions={filteredGraphOptions}
        graphSearch={graphSearch}
        onGraphSearchChange={setGraphSearch}
        onGraphDragStart={handleGraphDragStart}
      />

      <DashboardCanvas
        graphs={graphs}
        draggedGraphId={draggedGraphId}
        dropTargetGraphId={dropTargetGraphId}
        dropPosition={dropPosition}
        isDragOver={isDragOver}
        filters={dashboardFilters}
        timeRange={timeRange}
        draftTimeRange={draftTimeRange}
        isTimeMenuOpen={isTimeMenuOpen}
        customRangeStartPercent={getTimelinePercent(draftTimeRange.customStart)}
        customRangeEndPercent={getTimelinePercent(draftTimeRange.customEnd)}
        onCanvasDragLeave={handleCanvasDragLeave}
        onCanvasDragOver={handleCanvasDragOver}
        onCanvasDrop={handleCanvasDrop}
        onFilterChange={updateDashboardFilter}
        onOpenTimeMenu={openTimeMenu}
        onCloseTimeMenu={() => setIsTimeMenuOpen(false)}
        onApplyTimeRange={applyTimeRange}
        onDraftTimeRangeChange={updateDraftTimeRange}
        onTimelinePointerDown={handleTimelinePointerDown}
        onTimelinePointerMove={handleTimelinePointerMove}
        onTimelinePointerUp={handleTimelinePointerUp}
        onConfigureGraph={setConfiguringGraphId}
        onGraphMoveStart={handleGraphMoveStart}
        onGraphResizeStart={handleGraphResizeStart}
      />

      {configuringGraph ? (
        <GraphConfigModal graph={configuringGraph} onClose={() => setConfiguringGraphId(null)} onConfigChange={updateGraphConfig} />
      ) : null}
    </div>
  );
}
