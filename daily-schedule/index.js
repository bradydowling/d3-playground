import * as d3 from 'd3'

const data = [
  {
    timeFrom: '2020-11-10T05:00:00.000Z',
    timeTo: '2020-11-10T12:00:00.000Z',
    title: 'Night time sleep'
  },
  {
    timeFrom: '2020-11-10T12:00:00.000Z',
    timeTo: '2020-11-10T13:30:00.000Z',
    title: 'Morning feed'
  },
  {
    timeFrom: '2020-11-10T13:30:00.000Z',
    timeTo: '2020-11-10T15:00:00.000Z',
    title: 'Morning nap'
  },
  {
    timeFrom: '2020-11-10T15:00:00.000Z',
    timeTo: '2020-11-10T16:30:00.000Z',
    title: 'Mid-morning feed'
  },
  {
    timeFrom: '2020-11-10T16:30:00.000Z',
    timeTo: '2020-11-10T18:00:00.000Z',
    title: 'Mid-morning nap'
  },
  {
    timeFrom: '2020-11-10T18:00:00.000Z',
    timeTo: '2020-11-10T19:30:00.000Z',
    title: 'Afternoon feed'
  },
  {
    timeFrom: '2020-11-10T19:30:00.000Z',
    timeTo: '2020-11-10T21:00:00.000Z',
    title: 'Afternoon nap'
  },
  {
    timeFrom: '2020-11-10T21:00:00.000Z',
    timeTo: '2020-11-10T22:30:00.000Z',
    title: 'Supper feed'
  },
  {
    timeFrom: '2020-11-10T22:30:00.000Z',
    timeTo: '2020-11-10T23:30:00.000Z',
    title: 'Witching hour nap'
  },
  {
    timeFrom: '2020-11-10T23:30:00.000Z',
    timeTo: '2020-11-11T00:30:00.000Z',
    title: 'Bath and bedtime feed'
  },
  {
    timeFrom: '2020-11-11T00:30:00.000Z',
    timeTo: '2020-11-11T05:00:00.000Z',
    title: 'Night time sleep'
  }
]

const height = 1500
const width = 230
const margin = { top: 30, right: 30, bottom: 30, left: 50 }

const barStyle = {
  color: '#F8D8D5',
  opacity: {
    default: 0.9,
    hover: 1
  },
  width: width - margin.left - margin.right,
  startPadding: 2,
  endPadding: 3,
  radius: 3
}

const dates = [...data.map(d => new Date(d.timeFrom)), ...data.map(d => new Date(d.timeTo))]

const y = d3.scaleTime()
  .domain([d3.min(dates), d3.max(dates)])
  .range([margin.top, height - margin.bottom])

const yAxis = d3.axisLeft()
  .ticks(24)
  .scale(y)

const gridLines = d3.axisRight()
  .ticks(24)
  .tickSize(barStyle.width)
  .tickFormat('')
  .scale(y)

const svg = d3.create('svg')
  .attr('width', width)
  .attr('height', height)

const bar = svg.selectAll('g')
  .data(data, 0)
  .join('g')

bar.append('rect')
  .attr('fill', barStyle.color)
  .attr('opacity', barStyle.opacity.default)
  .attr('x', margin.left)
  .attr('y', d => y(new Date(d.timeFrom)) + barStyle.startPadding)
  .attr('height', d => {
    const startPoint = y(new Date(d.timeFrom))
    const endPoint = y(new Date(d.timeTo))
    return endPoint - startPoint - barStyle.endPadding - barStyle.startPadding
  })
  .attr('width', barStyle.width)
  .attr('rx', barStyle.radius)

bar.append('text')
  .attr('font-family', 'Roboto')
  .attr('font-size', 10)
  .attr('text-anchor', 'start')
  .attr('fill', 'black')
  .attr('x', margin.left + 10)
  .attr('y', d => y(new Date(d.timeFrom)) + 20)
  .text(d => d.title)

svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .attr('opacity', 0.5)
  .call(yAxis)

svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .attr('opacity', 0.3)
  .call(gridLines)

document.querySelector('body').appendChild(svg.node())
