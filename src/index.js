import * as d3 from 'd3';

const data = [4, 8, 15, 16, 23, 36];

const height = 420;
const barWidth = 30;
const barSpacing = 1;
const labelPadding = 3;

const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, barWidth * data.length]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, height]);

const svg = d3.create('svg')
    .attr('width', x.range()[1])
    .attr('height', height)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end');

const bar = svg.selectAll('g')
    .data(data)
    .join('g')
        .attr('transform', (d, i) => `translate(${x(i)},${height - y(d)})`);

bar.append('rect')
    .attr('fill', 'steelblue')
    .attr('width', x.bandwidth() - barSpacing)
    .attr('height', y);

bar.append('text')
    .attr('fill', 'white')
    .attr('x', x.bandwidth() / 2)
    .attr('y', d => y(d) - labelPadding)
    .attr('dx', '0.35em')
    .text(d => d);

document.querySelector('body').appendChild(svg.node());