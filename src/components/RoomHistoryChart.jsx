import React from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  LineSeriesCanvas
} from 'react-vis';

const RoomHistoryChart = function(props) {
  const {data} = props;

  const temperature = [];
  const humidity    = [];

  console.log(data);

  for(const rec of data) {
    temperature.push({
      x: new Date(rec.time).valueOf(),
      y: rec.temperature,
    });

    humidity.push({
      x: new Date(rec.time).valueOf(),
      y: rec.humidity,
    });
  }
  
  return (
    <div style={{width: '300px', height: '150px', background: 'white'}}>
      <XYPlot width={300} height={150}>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis style={{text: {fontSize: '8px'}}} tickFormat={value => `${new Date(value).getHours()}:${String(new Date(value).getMinutes()).padStart(2, '0')}`} />
        <YAxis style={{text: {fontSize: '8px'}}}  />
        {/* <YAxis id='right' orientation="right" title="humidity"/> */}
        <LineSeries data={temperature} color='red' />
        <LineSeries data={humidity} />
      </XYPlot>
    </div>
  );
};

export default RoomHistoryChart;
