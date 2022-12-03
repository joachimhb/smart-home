import React, {useEffect} from 'react';

import {connect} from 'react-redux';

import moment from 'moment';

import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import {getStatusHistory} from '../actions/roomStatusHistory';

const RoomHistoryChart = function(props) {
  const {
    dispatch,
    id,
    roomStatusHistory = {},
  } = props;

  console.log(roomStatusHistory);

  const storePart = roomStatusHistory[id] || {};

  useEffect(() => {
    dispatch(getStatusHistory(id));
  }, [id])

  if(storePart.loading) {
    return <div>Loading chart data</div>;
  }

  const fanStatusValue = {
    'min': 20,
    'max': 24,
    'off': 12,
  }

  const windowStatusValue = {
    'open': 28,
    'closed': 12,
  }

  const renderChart = type => {
    const data = _.get(storePart, ['data', type], []);

    if(!data.length) {
      return <div key={type}>No {type} data</div>;
    }

    const chartData = [];

    let temperatureSum = 0;
    let humiditySum = 0;

    let usedPoints = 0;

    for(const rec of data) {
      if(!rec.temperature || !rec.humidity) {
        continue;
      }

      chartData.push({
        // x: rec.time,
        // x: new Date(rec.time).valueOf(),
        x: moment(rec.time).valueOf(),
        fanStatus: fanStatusValue[rec.fan] || 12,
        windowStatus: windowStatusValue[rec.window] || 12,
        temperature: rec.temperature,
        humidity: rec.humidity,
      })

      temperatureSum += rec.temperature;
      humiditySum += rec.humidity;
      usedPoints++;
    }

    const temperatureAvg = Math.round((temperatureSum * 10 / usedPoints)) / 10;
    const humidityAvg = Math.round(humiditySum / usedPoints);

    const tickFormatter = value => moment(value).format('HH:mm');

    const referenceLines = [];

    const ticks = [];

    if(type === 'long') {
      let mom = moment(moment().format('YYYY-MM-DD'));

      // console.log({mom}, mom)

      while(referenceLines.length < 14) {
        const label = mom.format('DD.MM.');

        const x = mom.valueOf();

        referenceLines.push(
          <ReferenceLine 
            yAxisId='left' 
            key={x} 
            x={x} 
            // segment={[{x, y: 12}, {x, y: 30}]}
            stroke='black' 
            label={label} 
            strokeWidth={0.2}
          />
        );

        mom = mom.subtract(1, 'day');
      }
    } else {
      let mom = moment(moment().format('YYYY-MM-DD HH'));

      // console.log({mom}, mom)

      while(ticks.length < 6) {
        const label = mom.format('HH');

        const x = mom.valueOf();

        console.log({x, label});

        referenceLines.push(
          <ReferenceLine 
            yAxisId='left' 
            key={x} 
            x={x} 
            // segment={[{x, y: 12}, {x, y: 30}]}
            stroke='black' 
            label={label} 
            strokeWidth={0.2}
          />
        );

        ticks.push(x);

        mom.subtract(1, 'hour');
      }
    }
  
    return (
      <div className='room__history-chart' key={type}>
        <ResponsiveContainer width='98%' height={300}>
          <LineChart
            data={chartData}
            margin={{top: 5, right: -30, left: -30, bottom: 0}}
          >
            <XAxis dataKey='x' tickFormatter={tickFormatter} type='number' domain={['dataMin', 'dataMax']} tickCount={24} />
            <CartesianGrid stroke='#f5f5f5' />
            <YAxis yAxisId='left' domain={[12, 32]} />
            <YAxis yAxisId='right' orientation='right' domain={[40, 100]} />
            <Line dot={false} strokeWidth={0.5} type='monotone' dataKey='temperature' stroke='red' yAxisId='left' />
            <Line dot={false} strokeWidth={0.5} type='monotone' dataKey='fanStatus' stroke='green' yAxisId='left' />
            <Line dot={false} strokeWidth={0.5} type='monotone' dataKey='windowStatus' stroke='cyan' yAxisId='left' />
            <Line dot={false} strokeWidth={0.5} type='monotone' dataKey='humidity' stroke='blue' yAxisId='right' />
            {referenceLines}
            <ReferenceLine yAxisId='left' y={temperatureAvg} label={`Avg: ${temperatureAvg}C`} stroke='red' strokeDasharray='3 3' strokeWidth={0.2} />
            <ReferenceLine yAxisId='right' y={humidityAvg} label={`Avg: ${humidityAvg}%`} stroke='blue' strokeDasharray='3 3' strokeWidth={0.2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return [
    <div key='header'>Charts</div>,
    renderChart('recent'),
    renderChart('long'),
  ]
};
  
const mapStateToProps = state => ({
  roomStatusHistory: state.roomStatusHistory,
});

export default connect(mapStateToProps)(RoomHistoryChart);
