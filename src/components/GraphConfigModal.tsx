import type { DashboardGraph, GraphConfig } from "../types";

type GraphConfigModalProps = {
  graph: DashboardGraph;
  onClose: () => void;
  onConfigChange: (graphId: string, field: keyof GraphConfig, value: string) => void;
};

export function GraphConfigModal({ graph, onClose, onConfigChange }: GraphConfigModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="config-modal" role="dialog" aria-modal="true" aria-labelledby="config-title">
        <div className="config-header">
          <div>
            <p className="modal-eyebrow">Graph settings</p>
            <h2 id="config-title">{graph.label}</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="config-form">
          <label>
            <span>Select KPI</span>
            <select value={graph.config.kpi} onChange={(event) => onConfigChange(graph.id, "kpi", event.target.value)}>
              <option value="">No KPIs available yet</option>
            </select>
          </label>
        </div>

        <div className="config-actions">
          <button className="primary-action" type="button" onClick={onClose}>
            Apply
          </button>
        </div>
      </section>
    </div>
  );
}
