import * as d3 from 'd3';
import usageData from './data/usage.json';

const hoursToMinutes = (timeString) => {
    const [ hours, minutes ] = timeString.split(":");
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    return totalMinutes;
}

const getPastDaysAvg = (pastDaysNum, currentDayIndex, daysData) => {
    const pastDays = daysData.filter((innerItem, innerIndex) => innerIndex > (currentDayIndex - pastDaysNum) && innerIndex < currentDayIndex).concat(daysData[currentDayIndex]);
    const pastDaysValues = pastDays.map(item => hoursToMinutes(item["Usage time"]));
    const pastDaysTotal = pastDaysValues.reduce((total, dayValue) => total + dayValue);
    return pastDaysTotal / pastDays.length;
};

const data = usageData.reverse().map((item, i, partData) => {
    return {
        date: new Date(item.Date),
        value: hoursToMinutes(item["Usage time"]),
        fiveDayAvg: getPastDaysAvg(5, i, partData)
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
        .attr('x', (d, i) => x(d.date) + getBandwidth(data) / 2)
        .attr('y', d => y(0) - labelPadding) // Change this to y(d) + 20 (for padding from the top)
        .attr('dx', d => `0.${d.value.toString().length * 30}em`)
        .text(d => d.value);
}

const x = d3.scaleTime()
    .domain([data[0].date, data[data.length - 1].date]).nice()
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
    .attr('width', getBandwidth(data))
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
    .x(d => x(d.date) + + getBandwidth(data) / 2)
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