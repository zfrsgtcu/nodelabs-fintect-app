"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { formatCurrency } from "@/components/ui/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedSelect } from "@/components/ui/select";
import { useWorkingCapitalSeries } from "@/hooks/use-api";
import type { WorkingCapitalPeriod } from "@/services";

const TOOLTIP_SVG = "/images/icons/tooltip.svg";
const TOOLTIP_WIDTH_PX = 72;
const MAX_Y_TICKS = 5;

const PERIOD_OPTIONS = [
  { value: "7d" as const, label: "Last 7 days" },
  { value: "14d" as const, label: "Last 14 days" },
  { value: "30d" as const, label: "Last 30 days" },
] as const;

type SeriesFocus = "both" | "Income" | "Expenses";

function formatDateLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function WorkingCapitalChart() {
  const [period, setPeriod] = useState<WorkingCapitalPeriod>("7d");
  const [selectedSeries, setSelectedSeries] = useState<SeriesFocus>("both");
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const chartRef = useRef<ReactECharts>(null);

  const { data: seriesData = [], isLoading: chartLoading } = useWorkingCapitalSeries(period);
  const data = useMemo(
    () =>
      seriesData.map((p) => ({
        date: p.date,
        income: p.income ?? 0,
        expenses: p.expenses ?? 0,
      })),
    [seriesData]
  );

  // Arka plan vurgusu: tooltip genişliğinde, noktanın ortasında, grid alanında
  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance?.();
    if (!chart || data.length === 0) return;

    if (hoveredIndex < 0 || hoveredIndex >= data.length) {
      chart.setOption({ graphic: { elements: [] } }, { replaceMerge: ["graphic"] });
      return;
    }

    const xLabels = data.map((p) => formatDateLabel(p.date));
    const categoryValue = xLabels[hoveredIndex];
    const pointPx = chart.convertToPixel(
      { xAxisIndex: 0, yAxisIndex: 0 },
      [categoryValue, 0]
    ) as [number, number];
    const centerX = pointPx[0];
    const chartW = chart.getWidth();
    const chartH = chart.getHeight();
    const left = Math.max(0, centerX - TOOLTIP_WIDTH_PX / 2);
    const shape = { x: left, y: -20, width: TOOLTIP_WIDTH_PX, height: chartH };

    chart.setOption(
      {
        graphic: {
          elements: [
            {
              type: "rect",
              left: shape.x,
              top: shape.y,
              shape: {
                width: shape.width,
                height: shape.height,
                r: [0, 0, 12, 12],
              },
              style: {                
                fill: {
                  type: "linear",
                  x: 0.5,
                  y: 1,
                  x2: 0.5,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "#F2F6FC" },
                    { offset: 1, color: "#FAFBFE00" },
                  ],
                },
              },
              z: 0,
            },
          ],
        },
      },
      { replaceMerge: ["graphic"] }
    );
  }, [hoveredIndex, data]);

  const option = useMemo((): EChartsOption => {
    const xLabels = data.map((p) => formatDateLabel(p.date));
    const incomeData = data.map((p) => p.income);
    const expensesData = data.map((p) => p.expenses);

    const incomeOpacity = selectedSeries === "Expenses" ? 0.25 : 1;
    const expensesOpacity = selectedSeries === "Income" ? 0.25 : 1;

    return {
      backgroundColor: "#fff",
      tooltip: {
        trigger: "item" as const,
        confine: false,
        backgroundColor: "transparent",
        borderColor: "transparent",
        padding: 0,
        extraCssText: "box-shadow: none;",
        position: (point: number[], _params: unknown, dom: unknown) => {
          const el = dom as HTMLElement | null;
          const w = el?.offsetWidth ?? 72;
          const h = el?.offsetHeight ?? 44;
          return [point[0] - w / 2, point[1] - h - 14];
        },
        formatter: (params: unknown) => {
          const p = Array.isArray(params) ? params[0] : (params as { value?: number; data?: number });
          const value = p?.value ?? p?.data ?? 0;
          const formatted = formatCurrency(Number(value), "USD", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return `<div class="tooltip"><p>${formatted}</p></div>`;
        },
      },
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      xAxis: {
        type: "category" as const,
        boundaryGap: false,
        data: xLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: "#FFF4FE", width: 2 } },
        axisLabel: {
          color: "#929EAE",
          fontSize: 12,
          fontFamily: "Kumbh Sans",
          fontWeight: 400,
          margin: 8,
          rich: { bold: { fontWeight: 600, color: "#1B212D" } },
          formatter: (value: string, index: number) =>
            index === hoveredIndex ? `{bold|${value}}` : value,
        },
        offset: 25,
      },
      yAxis: {
        type: "value" as const,
        splitNumber: MAX_Y_TICKS - 1,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: "#929EAE",
          fontSize: 12,
          fontFamily: "Kumbh Sans",
          fontWeight: 400,
          formatter: (v: number) => v / 1000 + "K",
          margin: 8,
        },
        offset: 35,
      },
      series: [
        {
          name: "Income",
          type: "line",
          smooth: true,
          data: incomeData,
          showSymbol: true,
          symbolSize: 4,
          lineStyle: { width: 2, color: "#16a34a", opacity: incomeOpacity },
          itemStyle: { color: "#16a34a", opacity: incomeOpacity },
          emphasis: {
            focus: "series",
            scale: 3,
            itemStyle: { color: "#5243AA", borderColor: "#fff", borderWidth: 4 },
          },
          symbol: "circle",
        },
        {
          name: "Expenses",
          type: "line",
          smooth: true,
          data: expensesData,
          showSymbol: true,
          symbolSize: 4,
          lineStyle: { width: 2, color: "#a3e635", opacity: expensesOpacity },
          itemStyle: { color: "#a3e635", opacity: expensesOpacity },
          emphasis: {
            focus: "series",
            scale: 3,
            itemStyle: { color: "#5243AA", borderColor: "#fff", borderWidth: 4 },
          },
          symbol: "circle",
        },
      ],
    };
  }, [data, selectedSeries, hoveredIndex]);

  return (
    <section className="card-border working-capital-chart py-[15px] px-[25px]">
      <div className="card-border-header mb-[25px] flex flex-row flex-wrap items-center justify-between">
        <h2 className="capital-title">Working Capital</h2>
        <div className="flex flex-row items-center gap-[30px]">
          <button
            type="button"
            onClick={() =>
              setSelectedSeries((prev) => (prev === "Income" ? "both" : "Income"))
            }
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
            aria-pressed={selectedSeries === "Income"}
            aria-label="Focus Income series"
          >
            <span
              className={`h-2 w-2 rounded-full bg-[#16a34a] transition-all ${selectedSeries === "Income" ? "ring-2 ring-[#16a34a] ring-offset-1 scale-125" : ""}`}
              aria-hidden
            />
            <span
              className={`text-[12px] font-[400] ${selectedSeries === "Income" ? "text-[#1B212D] font-[500]" : "text-[#929EAE]"}`}
            >
              Income
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              setSelectedSeries((prev) => (prev === "Expenses" ? "both" : "Expenses"))
            }
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
            aria-pressed={selectedSeries === "Expenses"}
            aria-label="Focus Expenses series"
          >
            <span
              className={`h-2 w-2 rounded-full bg-[#a3e635] transition-all ${selectedSeries === "Expenses" ? "ring-2 ring-[#a3e635] ring-offset-1 scale-125" : ""}`}
              aria-hidden
            />
            <span
              className={`text-[12px] font-[400] ${selectedSeries === "Expenses" ? "text-[#1B212D] font-[500]" : "text-[#929EAE]"}`}
            >
              Expenses
            </span>
          </button>         
        </div>
        <AnimatedSelect<WorkingCapitalPeriod>
            value={period}
            options={PERIOD_OPTIONS}
            onChange={setPeriod}
            ariaLabel="Select time period"
            panelWidthPx={160}
          />
      </div>
      <div className="card-border-body">
        <div style={{ height: 200, maxHeight: 200 }} aria-busy={chartLoading} aria-label="Working capital chart">
          {chartLoading ? (
            <Skeleton width="100%" height={200} rounded="lg" className="w-full" />
          ) : (
          <ReactECharts
            ref={chartRef}
            option={option}
            style={{ height: 200 }}
            onEvents={{
              mouseover: (ev: { dataIndex?: number }) => {
                if (typeof ev?.dataIndex === "number") setHoveredIndex(ev.dataIndex);
              },
              globalOut: () => setHoveredIndex(-1),
            }}
          />
          )}
        </div>
      </div>
    </section>
  );
}

