import * as d3 from 'd3';
import usageData from './data/usage.json';
import {
    barSpacing,
    getPastDays,
    height,
    hoursToMinutes,
    margin,
    width,
    getBandwidth,
} from './helpers';

const barStyle = {
    color: 'steelblue',
    opacity: {
        default: .7,
        hover: 1
    }
};

const data = usageData.map((item, i, partData) => {
    return {
        date: new Date(item.Date),
        value: hoursToMinutes(item["Usage time"])
    }
});

const { days: thirtyDayData } = getPastDays(30, data.length - 1, data);

const dates = thirtyDayData.map(d => d.date);

const x = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(thirtyDayData.map(d => d.value))])
    .range([height - margin.bottom, margin.top]);

const x_axis = d3.axisBottom()
    .scale(x);

const y_axis = d3.axisLeft()
    .scale(y);

const svg = d3.create('svg')
    .attr('width', x.range()[1])
    .attr('height', height);

const bar = svg.selectAll('g')
    .data(thirtyDayData)
    .join('g');

bar.append('rect')
    .attr('fill', barStyle.color)
    .attr('opacity', barStyle.opacity.default)
    .attr('x', d => x(d.date))
    .attr('y', d => y(d.value))
    .attr('width', getBandwidth(width, thirtyDayData, barSpacing))
    .attr('height', d => y(0) - y(d.value))
    .on('mouseover', function() {
        d3.select(this)
            .transition(30)
            .attr('opacity', barStyle.opacity.hover);
        })
        .on('mouseout', function() {
            d3.select(this)
            .transition()
            .attr('opacity', barStyle.opacity.default);
    });

// bar.append('text')
//     .attr('fill', 'black')
//     .attr('x', (d, i) => x(d.date))
//     .attr('y', d => y(0))
//     .attr('dx', d => `0.${d.value.toString().length * 30}em`)
//     .text(d => d.value);

svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(x_axis);

svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

document.querySelector('body').appendChild(svg.node());