import React from 'react';

import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
} from 'recharts';

const RoomHistoryChart = function(props) {
  const {data} = props;
  const chartData = [];

  const fanStatusValue = {
    'min': 20,
    'max': 24,
    'off': 16,
  }

  for(const rec of data) {
    chartData.push({
      x: new Date(rec.time).valueOf(),
      fanStatus: fanStatusValue[rec.fan],
      temperature: rec.temperature,
      humidity: rec.humidity,
    })
  }

  console.log(data, chartData);
  
  return (
    <div style={{width: '400px', height: '300px', background: 'white'}}>
      <LineChart
        width={400}
        height={300}
        data={chartData}
        margin={{top: 5, right: 5, left: 5, bottom: 5}}
      >
        <XAxis dataKey="x" tickFormatter={value => `${new Date(value).getHours()}:${String(new Date(value).getMinutes()).padStart(2, '0')}`} />
        <CartesianGrid stroke="#f5f5f5" />
        <YAxis yAxisId='left' domain={[16, 32]} />
        <YAxis yAxisId='right' orientation='right' domain={[40, 100]} />
        <Line dot={false} strokeWidth={0.2} type="monotone" dataKey="temperature" stroke="red" yAxisId='left' />
        <Line dot={false} strokeWidth={0.2} type="monotone" dataKey="fanStatus" stroke="green" yAxisId='left' />
        <Line dot={false} strokeWidth={0.2} type="monotone" dataKey="humidity" stroke="blue" yAxisId='right' />
      </LineChart>
    </div>
  );
};

export default RoomHistoryChart;
