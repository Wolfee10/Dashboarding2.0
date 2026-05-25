import React from "react";
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";
import type { GraphType } from "../types";

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

type ChartPreviewProps = {
  type: GraphType;
};

export function ChartPreview({ type }: ChartPreviewProps) {
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
    const observer = new ResizeObserver(resize);

    observer.observe(chartRef.current);
    window.addEventListener("resize", resize);
    void renderChart();

    return () => {
      isDisposed = true;
      observer.disconnect();
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
