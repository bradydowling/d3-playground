import * as d3 from 'd3';
import usageData from './data/usage.json';
import {
    barSpacing,
    getBandwidth,
    getPastDays,
    height,
    hoursToMinutes,
    margin,
    width,
} from './helpers'

const data = usageData.map((item, i, partData) => {
    const { avgValue: fiveDayAvg } = getPastDays(5, i, partData);
    return {
        date: new Date(item.Date),
        value: hoursToMinutes(item["Usage time"]),
        fiveDayAvg
    }
});

const dates = data.map(d => d.date);

const x = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data.map(item => item.value))]).nice()
    .range([height - margin.bottom, margin.top]);

const x_axis = d3.axisBottom()
    .scale(x);

const y_axis = d3.axisLeft(y);

const svg = d3.create('svg')
    .attr('width', x.range()[1])
    .attr('height', height + margin.top + margin.bottom)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end');

const bar = svg.selectAll('g')
    .data(data)
    .join('g');

bar.append('rect')
    .attr('fill', 'steelblue')
    .attr('x', (d, i) => x(d.date))
    .attr('y', d => y(d.value))
    .attr('width', getBandwidth(width, data, barSpacing))
    .attr('height', d => y(0) - y(d.value));

svg.append("g")
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(x_axis);

svg.append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

const line = d3.line()
    .curve(d3.curveMonotoneX)
    .defined(d => !isNaN(d.fiveDayAvg))
    .x(d => x(d.date) + + getBandwidth(width, data, barSpacing) / 2)
    .y(d => y(d.fiveDayAvg))

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#777")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

document.querySelector('body').appendChild(svg.node());