import { AxisConfig, GradientConfig, TooltipConfig } from "../../types";
import { useState, useEffect } from "react";
import { quickSort } from "../../utils/sort";

export interface ILine<T> {
  data: T[];
  x_key: keyof T;
  y_key: keyof T;
  height: number;
  width: number;
  svgBackgroundColor?: string;
  useBackgroundGradient?: boolean;
  backgroundBorderRadius?: number;
  background_gradient_config?: GradientConfig;
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
  lineStroke?: string;
  lineStrokeWidth?: number;
  useCurve?: boolean;
  lineCircleRadius?: number;
  lineCircleStroke?: string;
  lineCircleStrokeWidth?: number;
  lineCircleFill?: string;
  onPressItem?: (item: T) => void;
  x_Formatter?: (value: string) => string;
  y_Formatter?: (value: string) => string;
  showTooltips?: boolean;
  tooltipConfig?: TooltipConfig;
  tooltipFormatter?: (value: string) => string;
  line_gradient_config?: GradientConfig;
  useLineGradientShadow?: boolean;
}

const SCREEN_WIDTH = window.screen.width;

const Line = <T,>({
  data = [],
  x_key,
  y_key,
  margin = 20,
  x_Formatter,
  y_Formatter,
  onPressItem,
  tooltipFormatter,
  showTooltips = true,
  useCurve = true,
  useLineGradientShadow = true,
  height: containerHeight = 300,
  width: containerWidth = SCREEN_WIDTH - 50,
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
  lineStroke = "#fff",
  lineStrokeWidth = 2,
  lineCircleRadius = 5,
  lineCircleStroke = "#fff",
  lineCircleStrokeWidth = 1,
  lineCircleFill = "#0000ff",
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
  tooltipConfig = {
    tooltipHeight: 20,
    tooltipWidth: 60,
    tooltipFill: "#fff",
    tooltipBorderRadius: 7,
    fontSize: 12,
    fontWeight: "bold",
    textAnchor: "middle",
  },
  line_gradient_config = {
    stop1: {
      offset: 0,
      stopColor: "#6831ee",
      stopOpacity: 0.8,
    },
    stop2: {
      offset: 1,
      stopColor: "#35578f",
      stopOpacity: 0.2,
    },
  },
}: ILine<T>) => {
  const [yAxisLables, setYAxisLabels] = useState<string[]>([]);

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

  const calculateHeight = () => {
    const yMax = data.reduce((acc, curr) => {
      return parseFloat(curr[y_key] as string) > acc
        ? parseFloat(curr[y_key] as string)
        : acc;
    }, 0);

    const min = 0;
    // multiply by 2 to account for the top margin
    const actualHeight = containerHeight - margin * 2;
    // dont forget the zero-index length
    const gapBetweenTicks = actualHeight / (data.length - 1);
    // evenly space out the gaps
    const yValueGap = (yMax - min) / (data.length - 1);
    // return the object
    return { yMax, min, gapBetweenTicks, yValueGap };
  };

  const calculateWidth = () => {
    const chartWidth = containerWidth - margin * 2;
    const gapBetweenTicks = chartWidth / (data.length - 1);
    return { chartWidth, gapBetweenTicks };
  };

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

  const getDPath = () => {
    const { gapBetweenTicks: x_gap } = calculateWidth();
    const { gapBetweenTicks: y_gap, yMax, yValueGap } = calculateHeight();

    let dPath = "";
    let prevX = 0;
    let prevY = 0;

    data.map((item, index) => {
      const x = margin + x_gap * index;
      const y =
        (yMax - parseInt(item[y_key] as string)) * (y_gap / yValueGap) + margin;

      if (useCurve) {
        if (index === 0) {
          dPath += `M ${x}, ${y}`;
          prevX = x;
          prevY = y;
        } else {
          const xSplitter = (x - prevX) / 4;
          const ySplitter = (y - prevY) / 2;

          dPath +=
            ` Q ${prevX + xSplitter}, ${prevY}, ${prevX + xSplitter * 2}, ${
              prevY + ySplitter
            }` +
            `Q ${prevX + xSplitter * 3}, ${prevY + ySplitter * 2}, ${x}, ${y}`;

          prevX = x;
          prevY = y;
        }
      } else {
        if (index === 0) {
          dPath += `M ${x}, ${y}`;
        } else {
          dPath += ` L ${x}, ${y}`;
        }
      }
    });

    return dPath;
  };

  const render_line = () => {
    const dPath = getDPath();

    return (
      <path
        className="transition-all duration-500"
        d={dPath}
        strokeWidth={lineStrokeWidth}
        stroke={lineStroke}
        fill="transparent"
      />
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
      const x = margin + gapBetweenTicks * index;
      return (
        <g key={`vertical_line-${index}`}>
          <line
            x1={x}
            y1={containerHeight - margin}
            x2={x}
            y2={margin}
            stroke={axisColor}
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
      const x = margin + gapBetweenTicks * index;
      const y = containerHeight - margin;

      return (
        <g key={`x_axis_tick-${index}`}>
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
    const { fontSize, textAnchor, fill, fontWeight } = x_axis_config;

    return data.map((item, index) => {
      const x = margin + gapBetweenTicks * index;
      const y = containerHeight - margin + 10 + fontSize;
      return (
        <text
          key={`x_axis_label-${index}`}
          x={x}
          y={y}
          fontSize={fontSize}
          textAnchor={textAnchor}
          fill={fill}
          fontWeight={fontWeight}
        >
          {x_Formatter
            ? x_Formatter(item[x_key] as string)
            : (item[x_key] as string)}
        </text>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const { gapBetweenTicks } = calculateHeight();
    return data.map((_, index) => {
      const y = containerHeight - margin - gapBetweenTicks * index;
      return (
        <g key={`y_axis_tick-${index}`}>
          <line
            x1={margin}
            y1={y}
            x2={margin - 10}
            y2={y}
            stroke={axisColor}
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

  const render_line_circles = () => {
    const { gapBetweenTicks: x_gap } = calculateWidth();
    const { gapBetweenTicks: y_gap, yMax, yValueGap } = calculateHeight();

    const {
      tooltipWidth = 60,
      tooltipHeight = 20,
      tooltipBorderRadius = 10,
      tooltipFill = '#fff',
      fontSize = 12,
      fontWeight = 'bold',
      textAnchor = 'middle',
    } = tooltipConfig;

    return data.map((item, index) => {
      const x = margin + x_gap * index;
      const y =
        (yMax - parseInt(item[y_key] as string)) * (y_gap / yValueGap) + margin;

      return (
        <g key={`chart-circle-${index}`}>
          <circle
            cx={x}
            cy={y}
            r={lineCircleRadius}
            stroke={lineCircleStroke}
            strokeWidth={lineCircleStrokeWidth}
            fill={lineCircleFill}
            onClick={() => {
              if (onPressItem) {
                onPressItem(item);
              }
            }}
          />
          {showTooltips ? (
            <g key={`tooltip-${index}`}>
              <line
                x1={x}
                y1={y - lineCircleRadius / 2}
                x2={x}
                y2={y - lineCircleRadius / 2 - 10}
                stroke={lineCircleStroke}
                strokeWidth={lineCircleStrokeWidth}
                opacity={0.6}
              />
              <rect
                x={x - tooltipWidth / 2}
                y={y - lineCircleRadius / 2 - tooltipHeight - 10}
                width={tooltipWidth}
                height={tooltipHeight}
                fill={tooltipFill}
                rx={tooltipBorderRadius}
                opacity={1}
                onClick={() => {
                  if (onPressItem) {
                    onPressItem(item);
                  }
                }}
              />
              <text
                x={x}
                y={y - lineCircleRadius / 2 - tooltipHeight / 2 - 5}
                fontSize={fontSize}
                fontWeight={fontWeight}
                textAnchor={textAnchor}
                onClick={() => {
                  if (onPressItem) {
                    onPressItem(item);
                  }
                }}
              >
                {tooltipFormatter
                  ? tooltipFormatter(item[y_key] as string)
                  : (item[y_key] as string)}
              </text>
            </g>
          ) : null}
        </g>
      );
    });
  };

  const render_shadow = () => {
    let dPath = getDPath();

    dPath += `L ${containerWidth - margin}, ${containerHeight - margin} L ${margin}, ${containerHeight - margin} Z`
     return <path d={dPath} fill={'url(#fillshadow)'} strokeWidth={0}  />
  };


  // ORDER MATTERS
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

          <linearGradient
            id="fillshadow"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}
          >
            <stop
              offset={line_gradient_config.stop1.offset}
              stopColor={line_gradient_config.stop1.stopColor}
              stopOpacity={line_gradient_config.stop1.stopOpacity}
            />
            <stop
              offset={line_gradient_config.stop2.offset}
              stopColor={line_gradient_config.stop2.stopColor}
              stopOpacity={line_gradient_config.stop2.stopOpacity}
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
          {data && data.length > 0 && useLineGradientShadow && render_shadow()}
        {data && data.length > 0 && render_x_axis_ticks()}
        {data && data.length > 0 && render_x_axis_labels()}
        {data && data.length > 0 && render_y_axis_ticks()}
        {data && data.length > 0 && render_y_axis_labels()}
        {data && data.length > 0 && render_line()}
        {data && data.length > 0 && render_line_circles()}
      </svg>
    </div>
  );
};

export default Line;
