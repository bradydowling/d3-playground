import * as d3 from 'd3';

const data = [
  {
    timeFrom: "2020-11-10T05:00:00.000Z",
    timeTo: "2020-11-10T07:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T07:00:00.000Z",
    timeTo: "2020-11-10T09:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T09:00:00.000Z",
    timeTo: "2020-11-10T11:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T11:00:00.000Z",
    timeTo: "2020-11-10T13:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T13:00:00.000Z",
    timeTo: "2020-11-10T15:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T15:00:00.000Z",
    timeTo: "2020-11-10T17:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T17:00:00.000Z",
    timeTo: "2020-11-10T19:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T19:00:00.000Z",
    timeTo: "2020-11-10T21:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-10T21:00:00.000Z",
    timeTo: "2020-11-11T00:00:00.000Z",
    value: 20
  },
  {
    timeFrom: "2020-11-11T00:00:00.000Z",
    timeTo: "2020-11-11T05:00:00.000Z",
    value: 20
  },
];

const height = 1000;
const width = 200;
const margin = { top: 30, right: 30, bottom: 30, left: 50 };

const barStyle = {
    color: 'purple',
    opacity: {
        default: .9,
        hover: 1
    },
    width: width - margin.left - margin.right,
    padding: 10
};

const dates = data.map(d => new Date(d.timeFrom));

const y = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([margin.top, height - margin.bottom]);

const y_axis = d3.axisLeft()
    .ticks(24)
    .scale(y);

const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end');

const bar = svg.selectAll('g')
    .data(data, 0)
    .join('g');

bar.append('rect')
    .attr('fill', barStyle.color)
    .attr('opacity', barStyle.opacity.default)
    .attr('x', margin.left)
    .attr('y', d => y(new Date(d.timeFrom)))
    .attr('height', d => {
        const startPoint = y(new Date(d.timeFrom));
        const endPoint = y(new Date(d.timeTo));
        return endPoint - startPoint - barStyle.padding;
    })
    .attr('width', barStyle.width)
    .attr('rx', 5);

bar.append('text')
    .attr('fill', 'white')
    .attr('x', d => d.name || 'No text')
    .attr('y', d => y(0) - 10)
    .attr('dx', d => `0.${d.value.toString().length * 50}em`)
    .text((d, i) => data[i].value);

svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

document.querySelector('body').appendChild(svg.node());


