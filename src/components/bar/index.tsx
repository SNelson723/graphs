import { AxisConfig, GradientConfig } from "../../types";
import { useState, useEffect } from "react";
import { quickSort } from "../../utils/sort";

export interface BarProps<T> {
  data: T[];
  x_key: keyof T;
  y_key: keyof T;
  height?: number;
  width?: number;
  svgBackgroundColor?: string;
  useBackgroundGradient?: boolean;
  backgroundBorderRadius?: number;
  background_gradient_config?: GradientConfig;
  x_Formatter?: (value: string) => string;
  y_Formatter?: (value: string) => string;
  margin?: number;
  axisCircleRadius?: number;
  axisCircleFillColor?: string;
  axisStrokeColor?: string;
  axisStrokeWidth?: number;
  axisStrokeOpacity?: number;
  axisColor?: string;
  showHorizontalLines?: boolean;
  showVerticalLines?: boolean;
  horizontalLineOpacity?: number;
  verticalLineOpacity?: number;
  x_axis_config?: AxisConfig;
  y_axis_config?: AxisConfig;
  barWidth?: number;
  barOpacity?: number;
  barColor?: string;
  barStrokeWidth?: number;
  threeD?: boolean;
  threeDWidthY?: number;
  threeDLineThickness?: number;
}

const SCREEN_WIDTH = window.screen.width;

const Bar = <T,>({
  data = [],
  x_key,
  y_key,
  x_Formatter,
  y_Formatter,
  margin = 50,
  height: containerHeight = 300,
  width: containerWidth = SCREEN_WIDTH - 50,
  barWidth = 20,
  barOpacity = 0.8,
  threeD = true,
  threeDLineThickness = 1,
  threeDWidthY = 10,
  barColor = "#d69e9e",
  barStrokeWidth = 2,
  svgBackgroundColor = "transparent",
  useBackgroundGradient = true,
  backgroundBorderRadius = 20,
  axisCircleRadius = 5,
  axisCircleFillColor = "#fff",
  axisStrokeColor = "#fff",
  axisStrokeWidth = 2,
  axisStrokeOpacity = 0.8,
  axisColor = "#fff",
  showHorizontalLines = true,
  showVerticalLines = true,
  horizontalLineOpacity = 0.3,
  verticalLineOpacity = 0.3,
  background_gradient_config = {
    stop1: {
      offset: 0,
      stopColor: "#6491d9",
      stopOpacity: 0.3,
    },
    stop2: {
      offset: 1,
      stopColor: "#35578f",
      stopOpacity: 0.8,
    },
  },
  x_axis_config = {
    fontSize: 12,
    textAnchor: "middle",
    fill: "#fff",
    fontWeight: "400",
    x_offset: 0,
    y_offset: 0,
    fontColor: "#fff",
    rotation: 0,
  },
  y_axis_config = {
    fontSize: 12,
    textAnchor: "end",
    fill: "#fff",
    fontWeight: "400",
    x_offset: 0,
    y_offset: 0,
    fontColor: "#fff",
    rotation: -45,
  },
}: BarProps<T>) => {
  const [yAxisLables, setYAxisLabels] = useState<string[]>([]);
  const x_margin = 50;
  const y_margin = 50;

  useEffect(() => {
    if (data) {
      const { yMax } = calculateHeight();
      const gap = yMax / (data.length - 1);

      const arr = Array.from({ length: data.length })
        .fill(0)
        .map((_, i) => gap * i);

      let yAxisData = quickSort(arr);

      if (y_Formatter) {
        //  @ts-expect-error type mismatch
        yAxisData = yAxisData.map((x) => y_Formatter(x as string));
      }
      setYAxisLabels(yAxisData as string[]);
    }
  }, [data]);

  const mainContainer = {
    height: containerHeight,
    width: containerWidth,
    backgroundColor: "transparent",
    margin: "0 auto",
    borderRadius: "10px",
  };

  const svgContainer = {
    backgroundColor: svgBackgroundColor,
  };

  const calculateWidth = () => {
    const chartWidth = containerWidth - x_margin * 2;
    const gapBetweenTicks = chartWidth / data.length;
    return {
      chartWidth,
      gapBetweenTicks,
    };
  };

  const calculateHeight = () => {
    const yMax = data.reduce((acc, curr) => {
      return parseFloat(curr[y_key] as string) > acc
        ? parseFloat(curr[y_key] as string)
        : acc;
    }, 0);

    const min = 0;
    const actualChartHeight = containerHeight - y_margin * 2;
    const gapBetweenTicks = actualChartHeight / (data.length - 1);
    const yValueGap = (yMax - min) / (data.length - 1);

    return { yMax, gapBetweenTicks, yValueGap, min };
  };

  // renders first
  const render_background = () => {
    return (
      <g>
        <rect
          x={0}
          y={0}
          rx={backgroundBorderRadius}
          height={containerHeight}
          width={containerWidth}
          fill={`url(#gradientback)`}
        />
      </g>
    );
  };

  // <g> => group container
  const render_x_axis = () => {
    return (
      <g key="x_axis">
        <circle
          cx={margin}
          cy={containerHeight - margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisStrokeOpacity}
        />
        <circle
          cx={containerWidth - margin}
          cy={containerHeight - margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisStrokeOpacity}
        />
        <line
          x1={margin}
          y1={containerHeight - margin}
          x2={containerWidth - margin}
          y2={containerHeight - margin}
          strokeWidth={axisStrokeWidth}
          stroke={axisColor}
        />
      </g>
    );
  };

  // cy => always starts at top when positioning for circle in g
  const render_y_axis = () => {
    return (
      <g key="y_axis">
        <circle
          cx={margin}
          cy={margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisStrokeOpacity}
        />

        <line
          x1={margin}
          y1={margin}
          x2={margin}
          y2={containerHeight - margin}
          strokeWidth={axisStrokeWidth}
          stroke={axisColor}
        />
      </g>
    );
  };

  const render_horizontal_lines = () => {
    const { gapBetweenTicks } = calculateHeight();

    return data.map((_, index) => {
      // space out evenly along y axis
      const y = containerHeight - margin - gapBetweenTicks * index;

      return (
        <g key={`horizontal_line-${index}`}>
          <line
            x1={margin}
            y1={y}
            x2={containerWidth - margin}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={horizontalLineOpacity}
          />
        </g>
      );
    });
  };

  const render_vertical_lines = () => {
    const { gapBetweenTicks } = calculateWidth();
    return data.map((_, index) => {
      const x = margin + gapBetweenTicks * index + gapBetweenTicks / 2;
      return (
        <g key={`vertical_line-${index}`}>
          <line
            x1={x}
            y1={containerHeight - margin}
            x2={x}
            y2={margin}
            stroke={"red"}
            strokeWidth={axisStrokeWidth}
            opacity={verticalLineOpacity}
          />
        </g>
      );
    });
  };

  const render_x_axis_ticks = () => {
    const { gapBetweenTicks } = calculateWidth();
    return data.map((_, index) => {
      const x = margin + gapBetweenTicks * index + gapBetweenTicks / 2;
      const y = containerHeight - y_margin;

      return (
        <g key={`x_axis-${index}`}>
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
          />
        </g>
      );
    });
  };

  const render_x_axis_labels = () => {
    const { gapBetweenTicks } = calculateWidth();
    const {
      fontSize = 12,
      fontColor = "#fff",
      textAnchor = "middle",
      fontWeight = 600,
      rotation = 0,
      x_offset = 0,
      y_offset = window.innerWidth > 500 ? 0 : 30,
    } = x_axis_config;

    return data.map((item, index) => {
      const x = margin + gapBetweenTicks * index + gapBetweenTicks / 2;
      const y = containerHeight - y_margin + 10 + fontSize;

      return (
        <g key={`x_axis_label-${index}`}>
          <text
            x={x - x_offset}
            y={y + y_offset}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}
          >
            {x_Formatter
              ? x_Formatter(item[x_key] as string)
              : (item[x_key] as string)}
          </text>
        </g>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const { gapBetweenTicks } = calculateHeight();

    return data.map((_, index) => {
      const y = containerHeight - y_margin - gapBetweenTicks * index;
      return (
        <g key={`y_axis_tick-${index}`}>
          <line
            x1={x_margin}
            y1={y}
            x2={x_margin - 10}
            y2={y}
            stroke={axisStrokeColor}
            strokeWidth={axisStrokeWidth}
          />
        </g>
      );
    });
  };

  const render_y_axis_labels = () => {
    const { gapBetweenTicks } = calculateHeight();
    const { fontSize, textAnchor, fill, fontWeight } = y_axis_config;
    const x = margin - 13;

    return yAxisLables.map((item, index) => {
      const y = containerHeight - margin - gapBetweenTicks * index;

      return (
        <g key={`y_axis_label-${index}`}>
          <text
            x={x}
            y={y + fontSize / 3}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fill={fill}
            fontSize={fontSize}
          >
            {item}
          </text>
        </g>
      );
    });
  };

  const render_bar_chart = () => {
    const { gapBetweenTicks: y_gap, yMax, yValueGap } = calculateHeight();
    const { gapBetweenTicks: x_gap } = calculateWidth();
    const y = containerHeight - y_margin;

    return data.map((item, index) => {
      // const x = x_margin * 2 + x_gap * index;
      const x = x_margin + x_gap * index + x_gap / 2;
      const height =
        (yMax - parseFloat(item[y_key] as string)) * (y_gap / yValueGap) +
        y_margin;
      const barHeight = containerHeight - y_margin - height;

      return (
        <g
          key={`bar-${index}`}
          className="group group-hover:stroke-red-500 transition-all duration-500 cursor-pointer"
        >
          {threeD ? (
            <g>
              <line
                className="group-hover:stroke-red-500 transition-all duration-500 cursor-pointer"
                x1={x - barWidth / 2}
                y1={y}
                x2={x - barWidth / 2 - threeDWidthY}
                y2={y - threeDWidthY}
                strokeWidth={threeDLineThickness}
                stroke={barColor}
              />
              <line
                className="group-hover:stroke-red-500 transition-all duration-500 cursor-pointer"
                x1={x - barWidth / 2}
                y1={y - barHeight}
                x2={x - barWidth / 2 - threeDWidthY}
                y2={y - barHeight - threeDWidthY}
                strokeWidth={threeDLineThickness}
                stroke={barColor}
              />
              <line
                className="group-hover:stroke-red-500 transition-all duration-500 cursor-pointer"
                x1={x - barWidth / 2 - threeDWidthY}
                y1={y - threeDWidthY}
                x2={x - barWidth / 2 - threeDWidthY}
                y2={y - barHeight - threeDWidthY}
                strokeWidth={threeDLineThickness}
                stroke={barColor}
              />
              <line
                className="group-hover:stroke-red-500 transition-all duration-500 cursor-pointer"
                x1={x - barWidth / 2 - threeDWidthY}
                y1={y - barHeight - threeDWidthY}
                x2={x + barWidth / 2 - threeDWidthY}
                y2={y - barHeight - threeDWidthY}
                strokeWidth={threeDLineThickness}
                stroke={barColor}
              />
              <line
                className="group-hover:stroke-red-500 transition-all duration-500 cursor-pointer"
                x1={x + barWidth / 2}
                y1={y - barHeight}
                x2={x + barWidth / 2 - threeDWidthY}
                y2={y - barHeight - threeDWidthY}
                strokeWidth={threeDLineThickness}
                stroke={barColor}
              />
            </g>
          ) : null}

          <rect
            className="hover:stroke-red-500 transition-all duration-500 cursor-pointer"
            x={x - barWidth / 2}
            y={y - barHeight}
            height={barHeight}
            width={barWidth}
            fill="transparent"
            opacity={barOpacity}
            stroke={barColor}
            strokeWidth={barStrokeWidth}
          />
        </g>
      );
    });
  };

  // ----------------------------------
  return (
    <div style={mainContainer}>
      <svg height="100%" width="100%" style={svgContainer}>
        <defs>
          <linearGradient
            id="gradientback"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}
          >
            <stop
              offset={background_gradient_config.stop1.offset}
              stopColor={background_gradient_config.stop1.stopColor}
              stopOpacity={background_gradient_config.stop1.stopOpacity}
            />
            <stop
              offset={background_gradient_config.stop2.offset}
              stopColor={background_gradient_config.stop2.stopColor}
              stopOpacity={background_gradient_config.stop2.stopOpacity}
            />
          </linearGradient>
        </defs>

        {useBackgroundGradient && render_background()}
        {render_x_axis()}
        {render_y_axis()}
        {data &&
          data.length > 0 &&
          showHorizontalLines &&
          render_horizontal_lines()}
        {data &&
          data.length > 0 &&
          showVerticalLines &&
          render_vertical_lines()}
        {data && data.length > 0 && render_x_axis_ticks()}
        {data && data.length > 0 && render_x_axis_labels()}
        {data && data.length > 0 && render_y_axis_ticks()}
        {data && data.length > 0 && render_y_axis_labels()}
        {data && data.length > 0 && render_bar_chart()}
      </svg>
    </div>
  );
};

export default Bar;
