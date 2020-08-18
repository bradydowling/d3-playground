import * as d3 from 'd3';
import rawData from './data/readings.json';
import {
    barSpacing,
    margin,
    getBandwidth,
} from './helpers';

const width = 1000;
const height = 500;
const animationDurationRatio = 5;

const barStyle = {
    color: 'steelblue',
    opacity: {
        default: .9,
        hover: 1
    }
};

const getStepData = (data, stepNum) => {
    return data.map((item, i) => {
        const value = i < stepNum ? item.value : 0
        return {
            ...item,
            value
        };
    });
};

const data = rawData.map(item => {
    return {
        date: new Date(item.date),
        value: item.breakfast
    }
});

const dates = data.map(d => d.date);

const x = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d.value))]).nice()
    .range([height - margin.bottom, margin.top]);

const color = d3.scaleSequential(d3.interpolateRdYlGn)
  .domain([140, 115]);
  // Got these values using trial and error
  // Still not 100% sure how this domain works

const x_axis = d3.axisBottom()
    .scale(x);

const y_axis = d3.axisLeft()
    .scale(y);

const chartWidth = x.range()[1];
const bandwidth = getBandwidth(chartWidth, data, barSpacing);

const svg = d3.create('svg')
    .attr('width', chartWidth)
    .attr('height', height)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end');

const bar = svg.selectAll('g')
    .data(getStepData(data, 0))
    .join('g');

bar.append('rect')
    .attr('fill', d => {
      return color(d.value);
    })
    .attr('opacity', barStyle.opacity.default)
    .attr('x', d => {
      return x(d.date)
    })
    .attr('y', d => y(d.value))
    .attr('width', bandwidth)
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

bar.append('text')
    .attr('fill', 'white')
    .attr('x', (d, i) => x(d.date) + bandwidth / 2)
    .attr('y', d => y(0) - 10)
    .attr('dx', d => `0.${d.value.toString().length * 50}em`)
    .text((d, i) => data[i].value);

svg.append('g')
    .attr('transform', `translate(${bandwidth / 2},${height - margin.bottom})`)
    .call(x_axis);

svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(y_axis);

document.querySelector('body').appendChild(svg.node());

function animateBars (data) {
  const bars = svg.selectAll('rect')
    .data(data);
  bars
    .transition()
    .ease(d3.easeLinear)
    .duration(d => animationDurationRatio * d.value)
      .attr('y', d => y(d.value))
      .attr('fill', d => {
        return color(d.value);
      })
      .attr('height', d => y(0) - y(d.value));
}

animateBars(data)

