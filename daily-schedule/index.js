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

const width = 1000;
const height = 200;
const margin = { top: 30, right: 30, bottom: 30, left: 30 };

const barStyle = {
    color: 'purple',
    opacity: {
        default: .9,
        hover: 1
    },
    height: height - margin.bottom,
    padding: 10
};

const dates = data.map(d => new Date(d.timeFrom));

const x = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, 10]) // TODO: How do I hide all ticks?
    .range([height - margin.bottom, margin.top]);

const x_axis = d3.axisBottom()
    .scale(x);

const y_axis = d3.axisLeft()
    .scale(y);

const chartWidth = x.range()[1];

const svg = d3.create('svg')
    .attr('width', chartWidth)
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
    .attr('x', d => x(new Date(d.timeFrom)))
    .attr('y', 0)
    .attr('width', d => {
        const startPoint = x(new Date(d.timeFrom));
        const endPoint = x(new Date(d.timeTo));
        return endPoint - startPoint - barStyle.padding;
    })
    .attr('height', barStyle.height);

bar.append('text')
    .attr('fill', 'white')
    .attr('x', (d, i) => x(d.date))
    .attr('y', d => y(0) - 10)
    .attr('dx', d => `0.${d.value.toString().length * 50}em`)
    .text((d, i) => data[i].value);

svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(x_axis);

svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

document.querySelector('body').appendChild(svg.node());


