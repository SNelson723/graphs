export interface GradientStop {
  offset: number;
  stopColor: string;
  stopOpacity: number;
}

export interface GradientConfig {
  stop1: GradientStop;
  stop2: GradientStop;
}

export interface AxisConfig {
  fontSize: number;
  textAnchor: string;
  fill: string;
  fontWeight: string;
  rotation: number;
  fontColor: string;
  x_offset: number;
  y_offset: number;
}

export interface TooltipConfig {
  tooltipHeight: number;
  tooltipWidth: number;
  tooltipFill: string;
  tooltipBorderRadius: number;
  fontSize: number;
  fontWeight: string;
  textAnchor: string;
}