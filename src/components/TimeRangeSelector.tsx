import { timeRangeOptions } from "../constants";
import type { DashboardTimeRange } from "../types";
import { formatDisplayDateTime, getTimeRangeLabel } from "../utils/timeRange";

type TimeRangeSelectorProps = {
  timeRange: DashboardTimeRange;
  draftTimeRange: DashboardTimeRange;
  isOpen: boolean;
  customRangeStartPercent: number;
  customRangeEndPercent: number;
  onOpen: () => void;
  onClose: () => void;
  onApply: () => void;
  onDraftChange: (nextRange: Partial<DashboardTimeRange>) => void;
  onTimelinePointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onTimelinePointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onTimelinePointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
};

export function TimeRangeSelector({
  timeRange,
  draftTimeRange,
  isOpen,
  customRangeStartPercent,
  customRangeEndPercent,
  onOpen,
  onClose,
  onApply,
  onDraftChange,
  onTimelinePointerDown,
  onTimelinePointerMove,
  onTimelinePointerUp,
}: TimeRangeSelectorProps) {
  return (
    <div className="time-selector">
      <button className="time-selector-button" type="button" onClick={onOpen}>
        <span>Time range</span>
        <strong>{getTimeRangeLabel(timeRange)}</strong>
      </button>

      {isOpen ? (
        <section className="time-popover" aria-label="Time range selector">
          <div className="time-presets">
            {timeRangeOptions.map((option) => (
              <button
                className={draftTimeRange.mode === option.value ? "is-selected" : ""}
                key={option.value}
                type="button"
                onClick={() => onDraftChange({ mode: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="time-custom-panel">
            <div
              className="time-timeline"
              onPointerDown={onTimelinePointerDown}
              onPointerMove={onTimelinePointerMove}
              onPointerUp={onTimelinePointerUp}
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
                  onChange={(event) => onDraftChange({ mode: "custom", customStart: event.target.value })}
                />
              </label>
              <label>
                <span>To</span>
                <input
                  type="datetime-local"
                  value={draftTimeRange.customEnd}
                  onChange={(event) => onDraftChange({ mode: "custom", customEnd: event.target.value })}
                />
              </label>
            </div>

            <div className="time-actions">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="time-apply-button" type="button" onClick={onApply}>
                Apply
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
