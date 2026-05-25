import { timeRangeOptions, timelineEndMs, timelineStartMs } from "../constants";
import type { DashboardTimeRange } from "../types";

export function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDisplayDateTime(value: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getTimelineValue(clientX: number, element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  const position = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
  const timestamp = timelineStartMs + position * (timelineEndMs - timelineStartMs);

  return formatDateTimeLocal(new Date(timestamp));
}

export function getTimeRangeLabel(range: DashboardTimeRange) {
  const selectedOption = timeRangeOptions.find((option) => option.value === range.mode);

  if (range.mode !== "custom") {
    return selectedOption?.label ?? "Time range";
  }

  return `${formatDisplayDateTime(range.customStart)} - ${formatDisplayDateTime(range.customEnd)}`;
}

export function getTimelinePercent(value: string) {
  if (!value) return 0;

  return ((new Date(value).getTime() - timelineStartMs) / (timelineEndMs - timelineStartMs)) * 100;
}
