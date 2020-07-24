import * as d3 from 'd3';
import usageData from './data/usage.json';

const hoursToMinutes = (timeString) => {
    const [ hours, minutes ] = timeString.split(":");
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    return totalMinutes;
}

const parsedData = usageData.reverse().map((item) => {
    return {
        date: new Date(item.Date),
        minutes: hoursToMinutes(item["Usage time"])
    }
});

const formatDate = d3.timeFormat('%m/%d');

const margin = { top: 30, right: 30, bottom: 30, left: 30 };
const height = 420;
const width = 1220;
const barSpacing = 1;
const labelPadding = 3;

const getBandwidth = (data) => {
    return width / data.length - barSpacing
};

const addBarText = (bar) => {
    bar.append('text')
        .attr('fill', 'white')
        .attr('x', (d, i) => x(d.date) + getBandwidth(parsedData) / 2)
        .attr('y', d => y(0) - labelPadding)
        .attr('dx', d => `0.${d.minutes.toString().length * 30}em`)
        .text(d => d.minutes);
}

const x = d3.scaleTime()
    .domain([parsedData[0].date, parsedData[parsedData.length - 1].date]).nice()
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(parsedData.map(item => item.minutes))]).nice()
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
    .data(parsedData)
    .join('g');

bar.append('rect')
    .attr('fill', 'steelblue')
    .attr('x', (d, i) => x(d.date))
    .attr('y', d => y(d.minutes))
    .attr('width', getBandwidth(parsedData))
    .attr('height', d => y(0) - y(d.minutes));

svg.append("g")
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(x_axis);

svg.append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

document.querySelector('body').appendChild(svg.node());