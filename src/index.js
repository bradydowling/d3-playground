import * as d3 from 'd3';

const data = [4, 8, 15, 16, 23, 36];

const margin = { top: 30, right: 30, bottom: 30, left: 30 };
const height = 420;
const width = 420;
const barSpacing = 1;
const labelPadding = 3;

const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data)]).nice()
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
    .attr('x', (d, i) => x(i))
    .attr('y', d => y(d))
    .attr('width', x.bandwidth() - barSpacing)
    .attr('height', d => y(0) - y(d));

bar.append('text')
    .attr('fill', 'white')
    .attr('x', (d, i) => x(i) + x.bandwidth() / 2)
    .attr('y', d => y(0) - labelPadding)
    .attr('dx', d => `0.${d.toString().length * 30}em`)
    .text(d => d);

svg.append("g")
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(x_axis);

svg.append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

document.querySelector('body').appendChild(svg.node());