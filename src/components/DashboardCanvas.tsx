import type { DashboardGraph, DashboardTimeRange, DropPosition, ResizeDirection } from "../types";
import { DashboardFilters } from "./DashboardFilters";
import { GraphCard } from "./GraphCard";
import { TimeRangeSelector } from "./TimeRangeSelector";

type DashboardCanvasProps = {
  graphs: DashboardGraph[];
  draggedGraphId: string | null;
  dropTargetGraphId: string | null;
  dropPosition: DropPosition;
  isDragOver: boolean;
  filters: Parameters<typeof DashboardFilters>[0]["filters"];
  timeRange: DashboardTimeRange;
  draftTimeRange: DashboardTimeRange;
  isTimeMenuOpen: boolean;
  customRangeStartPercent: number;
  customRangeEndPercent: number;
  onCanvasDragLeave: (event: React.DragEvent<HTMLElement>) => void;
  onCanvasDragOver: (event: React.DragEvent<HTMLElement>) => void;
  onCanvasDrop: (event: React.DragEvent<HTMLElement>) => void;
  onFilterChange: Parameters<typeof DashboardFilters>[0]["onFilterChange"];
  onOpenTimeMenu: () => void;
  onCloseTimeMenu: () => void;
  onApplyTimeRange: () => void;
  onDraftTimeRangeChange: (nextRange: Partial<DashboardTimeRange>) => void;
  onTimelinePointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onTimelinePointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onTimelinePointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
  onConfigureGraph: (graphId: string) => void;
  onGraphMoveStart: (event: React.PointerEvent<HTMLButtonElement>, graphId: string) => void;
  onGraphResizeStart: (event: React.PointerEvent<HTMLDivElement>, graph: DashboardGraph, direction: ResizeDirection) => void;
};

export function DashboardCanvas({
  graphs,
  draggedGraphId,
  dropTargetGraphId,
  dropPosition,
  isDragOver,
  filters,
  timeRange,
  draftTimeRange,
  isTimeMenuOpen,
  customRangeStartPercent,
  customRangeEndPercent,
  onCanvasDragLeave,
  onCanvasDragOver,
  onCanvasDrop,
  onFilterChange,
  onOpenTimeMenu,
  onCloseTimeMenu,
  onApplyTimeRange,
  onDraftTimeRangeChange,
  onTimelinePointerDown,
  onTimelinePointerMove,
  onTimelinePointerUp,
  onConfigureGraph,
  onGraphMoveStart,
  onGraphResizeStart,
}: DashboardCanvasProps) {
  return (
    <main
      className={`canvas ${isDragOver ? "is-drag-over" : ""}`}
      onDragLeave={onCanvasDragLeave}
      onDragOver={onCanvasDragOver}
      onDrop={onCanvasDrop}
    >
      <section className="canvas-header">
        <div>
          <h2>Dashboard canvas</h2>
          <p>Drag a graph from the sidebar and drop it here.</p>
        </div>

        <TimeRangeSelector
          timeRange={timeRange}
          draftTimeRange={draftTimeRange}
          isOpen={isTimeMenuOpen}
          customRangeStartPercent={customRangeStartPercent}
          customRangeEndPercent={customRangeEndPercent}
          onOpen={onOpenTimeMenu}
          onClose={onCloseTimeMenu}
          onApply={onApplyTimeRange}
          onDraftChange={onDraftTimeRangeChange}
          onTimelinePointerDown={onTimelinePointerDown}
          onTimelinePointerMove={onTimelinePointerMove}
          onTimelinePointerUp={onTimelinePointerUp}
        />
      </section>

      <DashboardFilters filters={filters} onFilterChange={onFilterChange} />

      {graphs.length === 0 ? (
        <section className="empty-dropzone" aria-label="Empty dashboard canvas">
          Drop graph here
        </section>
      ) : (
        <section className="graph-grid" aria-label="Dashboard graphs">
          {graphs.map((graph) => (
            <GraphCard
              graph={graph}
              isDragging={draggedGraphId === graph.id}
              isDropTarget={dropTargetGraphId === graph.id}
              dropPosition={dropPosition}
              key={graph.id}
              onConfigure={onConfigureGraph}
              onMoveStart={onGraphMoveStart}
              onResizeStart={onGraphResizeStart}
            />
          ))}
        </section>
      )}
    </main>
  );
}
