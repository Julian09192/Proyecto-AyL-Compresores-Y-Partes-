"use client";

import React from "react";
import RechartsPrimitive from "recharts";

import { cn } from "./utils";

const THEMES = { light: "", dark: ".dark" };

const ChartContext = React.createContext(null);

function useChart() {
const context = React.useContext(ChartContext);

if (!context) {
throw new Error("useChart must be used within a <ChartContainer />");
}

return context;
}

function ChartContainer({
id,
className,
children,
config,
...props
}) {
const uniqueId = React.useId();
const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

return (
<ChartContext.Provider value={{ config }}>
<div
data-slot="chart"
data-chart={chartId}
className={cn(
"flex aspect-video justify-center text-xs",
className
)}
{...props}
> <ChartStyle id={chartId} config={config} />

    <RechartsPrimitive.ResponsiveContainer>
      {children}
    </RechartsPrimitive.ResponsiveContainer>
  </div>
</ChartContext.Provider>
);
}

const ChartStyle = ({ id, config }) => {
const colorConfig = Object.entries(config || {}).filter(
([, item]) => item?.theme || item?.color
);

if (!colorConfig.length) return null;

return (
<style
dangerouslySetInnerHTML={{
__html: Object.entries(THEMES)
.map(([theme, prefix]) => `${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item?.theme?.[theme] || item?.color;
    return color ?`--color-${key}: ${color};`: "";
  })
  .join("\n")}
}`)
.join("\n"),
}}
/>
);
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
active,
payload,
className,
indicator = "dot",
hideLabel = false,
hideIndicator = false,
label,
labelFormatter,
labelClassName,
formatter,
color,
nameKey,
labelKey,
}) {
const { config } = useChart();

const tooltipLabel = React.useMemo(() => {
if (hideLabel || !payload?.length) return null;

const item = payload[0];
const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
const itemConfig = getPayloadConfigFromPayload(config, item, key);

const value =
  typeof label === "string"
    ? config?.[label]?.label || label
    : itemConfig?.label;

if (labelFormatter) {
  return (
    <div className={cn("font-medium", labelClassName)}>
      {labelFormatter(value, payload)}
    </div>
  );
}

if (!value) return null;

return (
  <div className={cn("font-medium", labelClassName)}>
    {value}
  </div>
);

}, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

if (!active || !payload?.length) return null;

const nestLabel = payload.length === 1 && indicator !== "dot";

return (
<div
className={cn(
"bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
className
)}
>
{!nestLabel ? tooltipLabel : null}

  <div className="grid gap-1.5">
    {payload.map((item, index) => {
      const key = `${nameKey || item.name || item.dataKey || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const indicatorColor = color || item.payload?.fill || item.color;

      return (
        <div
          key={index}
          className={cn(
            "flex w-full flex-wrap items-stretch gap-2",
            indicator === "dot" && "items-center"
          )}
        >
          {formatter && item?.value !== undefined && item.name ? (
            formatter(item.value, item.name, item, index, item.payload)
          ) : (
            <>
              {itemConfig?.icon ? (
                <itemConfig.icon />
              ) : (
                !hideIndicator && (
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )
              )}

              <div className="flex flex-1 justify-between leading-none items-center">
                <div className="grid gap-1.5">
                  {nestLabel ? tooltipLabel : null}

                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                </div>

                {item.value && (
                  <span className="font-mono font-medium">
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      );
    })}
  </div>
</div>

);
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
className,
hideIcon = false,
payload,
verticalAlign = "bottom",
nameKey,
}) {
const { config } = useChart();

if (!payload?.length) return null;

return (
<div
className={cn(
"flex items-center justify-center gap-4",
verticalAlign === "top" ? "pb-3" : "pt-3",
className
)}
>
{payload.map((item, index) => {
const key = `${nameKey || item.dataKey || "value"}`;
const itemConfig = getPayloadConfigFromPayload(config, item, key);

    return (
      <div
        key={index}
        className="flex items-center gap-1.5"
      >
        {itemConfig?.icon && !hideIcon ? (
          <itemConfig.icon />
        ) : (
          <div
            className="h-2 w-2 rounded"
            style={{ backgroundColor: item.color }}
          />
        )}

        {itemConfig?.label}
      </div>
    );
  })}
</div>

);
}

function getPayloadConfigFromPayload(config, payload, key) {
if (typeof payload !== "object" || payload === null) return undefined;

const payloadData =
payload.payload && typeof payload.payload === "object"
? payload.payload
: undefined;

let configKey = key;

if (typeof payload[key] === "string") {
configKey = payload[key];
} else if (payloadData && typeof payloadData[key] === "string") {
configKey = payloadData[key];
}

return config?.[configKey] || config?.[key];
}

export {
ChartContainer,
ChartTooltip,
ChartTooltipContent,
ChartLegend,
ChartLegendContent,
ChartStyle,
};
