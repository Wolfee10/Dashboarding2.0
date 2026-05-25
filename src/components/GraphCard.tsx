import type { DashboardGraph, DropPosition, ResizeDirection } from "../types";
import { ChartPreview } from "./ChartPreview";

type GraphCardProps = {
  graph: DashboardGraph;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition: DropPosition;
  onConfigure: (graphId: string) => void;
  onMoveStart: (event: React.PointerEvent<HTMLButtonElement>, graphId: string) => void;
  onResizeStart: (event: React.PointerEvent<HTMLDivElement>, graph: DashboardGraph, direction: ResizeDirection) => void;
};

export function GraphCard({
  graph,
  isDragging,
  isDropTarget,
  dropPosition,
  onConfigure,
  onMoveStart,
  onResizeStart,
}: GraphCardProps) {
  return (
    <article
      className={`graph-card ${isDragging ? "is-dragging" : ""} ${isDropTarget ? "is-drop-target" : ""} ${
        isDropTarget ? `is-drop-${dropPosition}` : ""
      }`}
      data-graph-id={graph.id}
      style={{ width: graph.width, height: graph.height }}
    >
      <div className="graph-card-header">
        <h3>{graph.label}</h3>
        <button className="drag-handle" onPointerDown={(event) => onMoveStart(event, graph.id)} type="button">
          Drag to move
        </button>
      </div>
      <button className="configure-button" type="button" onClick={() => onConfigure(graph.id)}>
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
      <div
        className="resize-handle resize-handle-right"
        onPointerDown={(event) => onResizeStart(event, graph, "right")}
        aria-hidden="true"
      />
      <div
        className="resize-handle resize-handle-bottom"
        onPointerDown={(event) => onResizeStart(event, graph, "bottom")}
        aria-hidden="true"
      />
      <div
        className="resize-handle resize-handle-corner"
        onPointerDown={(event) => onResizeStart(event, graph, "corner")}
        aria-hidden="true"
      />
    </article>
  );
}
