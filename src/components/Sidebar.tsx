import type { GraphOption } from "../types";
import { GraphDiagram } from "./GraphDiagram";

type SidebarProps = {
  graphOptions: GraphOption[];
  graphSearch: string;
  onGraphSearchChange: (value: string) => void;
  onGraphDragStart: (event: React.DragEvent<HTMLElement>, option: GraphOption) => void;
};

export function Sidebar({ graphOptions, graphSearch, onGraphSearchChange, onGraphDragStart }: SidebarProps) {
  return (
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
          onChange={(event) => onGraphSearchChange(event.target.value)}
          placeholder="Search By Graph Type"
        />
      </label>

      <div className="graph-list">
        {graphOptions.map((option) => (
          <div
            className="graph-option"
            draggable
            key={option.type}
            onDragStart={(event) => onGraphDragStart(event, option)}
            role="button"
            tabIndex={0}
          >
            <GraphDiagram type={option.type} />
            <span>{option.label}</span>
            <small>{option.description}</small>
          </div>
        ))}

        {graphOptions.length === 0 ? <p className="no-graphs-found">No Graphs Found</p> : null}
      </div>
    </aside>
  );
}
