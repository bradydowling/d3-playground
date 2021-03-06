import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from '../data/states-albers-10m.json';
import data from '../data/us-state-capitals.json';

const width = 975;
const height = 610;

const projection = d3.geoAlbersUsa().scale(1300).translate([width / 2, height / 2]);

const path = d3.geoPath();
const svg = d3.create('svg')
  .attr('height', height)
  .attr('width', width);

const statesBackground = svg.append('path')
  .attr('fill', '#ddd')
  .attr('d', path(topojson.feature(us, us.objects.nation)));

const statesBorders = svg.append('path')
  .attr('fill', 'none')
  .attr('stroke', '#fff')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-linecap', 'round')
  .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

const stateCapitalElements = svg.selectAll('g')
  .data(data)
  .join('g');

const capitalGroups = stateCapitalElements.append('g')
  .attr('transform', ({ longitude, latitude }) => `translate(${projection([longitude, latitude]).join(",")})`);

capitalGroups.append('circle')
    .attr('r', 2);

capitalGroups.append('text')
  .attr('text-anchor', 'middle')
  .attr('font-family', 'sans-serif')
  .attr('font-size', '10')
  .attr('y', -6)
  .text(({ description }) => description);

document.body.appendChild(svg.node());
