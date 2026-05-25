import type { GraphType } from "../types";

type GraphDiagramProps = {
  type: GraphType;
};

export function GraphDiagram({ type }: GraphDiagramProps) {
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
