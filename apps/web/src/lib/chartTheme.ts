import type { Theme } from "./theme.js";

export interface ChartTheme {
  grid: string;
  axis: string;
  axisLine: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  cursor: string;
}

export function chartTheme(theme: Theme): ChartTheme {
  if (theme === "dark") {
    return {
      grid: "rgb(255 255 255 / 0.08)",
      axis: "rgb(148 163 184)",
      axisLine: "rgb(255 255 255 / 0.12)",
      tooltipBg: "rgb(18 26 39)",
      tooltipBorder: "rgb(30 41 59)",
      tooltipText: "rgb(226 232 240)",
      cursor: "rgb(110 174 255 / 0.35)",
    };
  }
  return {
    grid: "rgb(226 232 239)",
    axis: "rgb(91 107 124)",
    axisLine: "rgb(226 232 239)",
    tooltipBg: "rgb(255 255 255)",
    tooltipBorder: "rgb(226 232 239)",
    tooltipText: "rgb(10 37 64)",
    cursor: "rgb(30 79 168 / 0.2)",
  };
}
