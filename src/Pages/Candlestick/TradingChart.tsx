import React from "react";
import ReactDOM from "react-dom";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize
} from "react-financial-charts";

import sma from "@react-financial-charts/indicators/lib/calculator/sma";
import rsi from "@react-financial-charts/indicators/lib/calculator/rsi";
import macd from "@react-financial-charts/indicators/lib/calculator/macd";

interface Props {
  initialData: any[];
}

const TradingChart = ({initialData}: Props) => {
  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => new Date(d.time)
  );
  const height = 700;
  const width = 900;
  const margin = { left: 0, right: 48, top: 0, bottom: 24 };

  const smaData = rsi().options({ windowSize: 10, sourcePath: "close" })(
    initialData
  );
  console.log(initialData.map(({ close }, i) => [close, smaData[i]]));

  const macdData = macd().options({
    fast: 5,
    slow: 25,
    signal: 25,
    sourcePath: "close"
  })(initialData);
  console.log(macdData);

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 4 })
    .merge((d: any, c: any) => {
      d.ema12 = c;
    })
    .accessor((d: any) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 8 })
    .merge((d: any, c: any) => {
      d.ema26 = c;
    })
    .accessor((d: any) => d.ema26);

  const elder = elderRay();

  const calculatedData = elder(ema26(ema12(initialData)));
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(
    initialData
  );
  const pricesDisplayFormat = format(".2f");
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;

  const elderRayHeight = 100;
  const elderRayOrigin = (x: any, h: any) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (x: any, h: any) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;
  const yExtents = (data: any) => {
    return [data.high, data.low];
  };
  const dateTimeFormat = "%d %b";
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  const barChartExtents = (data: any) => {
    return data.volume;
  };

  const candleChartExtents = (data: any) => {
    return [data.high, data.low];
  };

  const yEdgeIndicator = (data: any) => {
    return data.close;
  };

  // const volumeColor = (data: any) => {
  //   return data.close > data.open
  //     ? "rgba(38, 166, 154, 0.3)"
  //     : "rgba(239, 83, 80, 0.3)";
  // };

  // const volumeSeries = (data: any) => {
  //   return data.volume;
  // };

  const openCloseColor = (data: any) => {
    return data.close > data.open ? "#26a69a" : "#ef5350";
  };

  return (
    <ChartCanvas
      height={height}
      ratio={3}
      width={width}
      margin={margin}
      data={data}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      {/* <Chart
        id={2}
        height={barChartHeight}
        origin={barChartOrigin}
        yExtents={barChartExtents}
      >
        <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
      </Chart> */}
      <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
        <XAxis showGridLines showTickLabel={false} />
        <YAxis showGridLines tickFormat={pricesDisplayFormat} />
        <CandlestickSeries />
        <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
        {/* <CurrentCoordinate
          yAccessor={ema26.accessor()}
          fillStyle={ema26.stroke()}
        /> */}
        <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
        {/* <CurrentCoordinate
          yAccessor={ema12.accessor()}
          fillStyle={ema12.stroke()}
        /> */}
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={pricesDisplayFormat}
          yAccessor={yEdgeIndicator}
        />
        {/* <MovingAverageTooltip
          origin={[8, 24]}
          options={[
            {
              yAccessor: ema26.accessor(),
              type: "EMA",
              stroke: ema26.stroke(),
              windowSize: ema26.options().windowSize
            },
            {
              yAccessor: ema12.accessor(),
              type: "EMA",
              stroke: ema12.stroke(),
              windowSize: ema12.options().windowSize
            }
          ]}
        /> */}

        <ZoomButtons />
        <OHLCTooltip origin={[8, 16]} />
      </Chart>
      
      <CrossHairCursor />
    </ChartCanvas>
  );
};


export default TradingChart;
