/*
Returns a path in the SVG path mini language, given
a radius

e.g. M -100 0 A 100 100 0 1 1 100 0 A 100 100 0 1 1 -100 0 (for radius == 100)

*/
function circularPath(radius) {
  const r = radius
  return `M -${r} 0 A ${r} ${r} 0 1 1 ${r} 0 A ${r} ${r} 0 1 1 -${r} 0 A ${r} ${r} 0 1 1 ${r} 0 A ${r} ${r} 0 1 1 -${r} 0`
}

function drawRings(rings, segments) {

  const centreElement = d3.select('#centre')

  window.centreElement = centreElement

  function clickHandler(d) {
    var svg = d3.select('svg').node()
    var scaler = d3.select('#scaler').node()
    var scale = scaler.getBoundingClientRect().width / scaler.getBBox().width
    var h = svg.clientHeight / scale
    var w = svg.clientWidth / scale

    window.centreElement = centreElement
    window.svg = svg
    window.h = h
    window.w = w

    var angle = (d.startAngle + d.endAngle) / 2

    a.classed('selected', (e) => e == d)

    centreElement
      .transition()
      .duration(1000)
      .attr('transform',`translate(${-w/2+90},${-h/2+90}) scale(0.4) rotate(${-angle})`)

    d3.select('#logoRotator')
      .transition()
      .duration(6000)
      .delay(400)
      .ease(d3.easeElastic.period(0.3))
      .attr('transform',`rotate(${angle})`)

    d3.select('#content')
      .transition()
      .duration(1000)
      .style('opacity', 1)


    var src = d.text.toLowerCase() + '.html'

    d3.select('#content iframe')
      .attr('src', src)

    d3.select('#content')
      .style('display', 'block')
      .transition()
      .duration(1000)
      .style('opacity', 1)


  }

  function homeHandler(){

    a.classed('selected', false)

    centreElement
      .transition()
      .duration(1000)
      .attr('transform',`translate(0, 0) scale(1) rotate(0)`)

    d3.select('#logoRotator')
      .transition()
      .duration(6000)
      .delay(400)
      .ease(d3.easeElastic.period(0.3))
      .attr('transform',`rotate(0)`)

    d3.select('#content')
      .transition()
      .duration(1000)
      .style('opacity', 0)
      .transition()
      .style('display', 'none')


  }


  const ringsById = {}
  for (let ring of rings){
    ringsById[ring.id] = ring
  }

  for (let segment of segments) {
    segment.startAngle = parseInt(segment.startAngle)
    segment.endAngle = parseInt(segment.endAngle)
  }

  centreElement.select('#rings').selectAll('path.ring')
    .data(rings)
    .enter()
    .append('path')
    .attr('class', 'ring')
    .attr('d', (ring) => circularPath(ring.radius))
    .attr('id', (ring) => `ring_${ring.id}`)

  const text = centreElement.selectAll('text')
    .data(segments)
    .enter()
    .append('text')
    .style('font-size', (segment) => ringsById[segment.ring].fontSize)
    .attr('text-anchor', 'middle')

  const a = text.append('a')

  a.filter((s) => s.link)
    .attr('href', (segment) => segment.link)
    .attr('target', '_new')

  a.filter((s) => !s.link)
    .style('cursor', 'pointer')
    .on('click', clickHandler)
    
  a.append('textPath')
    .attr('xlink:href', (segment) => `#ring_${segment.ring}`)
    .attr('startOffset', (s) => `${100*((s.startAngle + s.endAngle)/2+90)/720}%`)
    .append('tspan')
    .attr('dy', '-10')
    .text((segment) => segment.text)

  d3.select('#logo')
    .on('click', homeHandler)

}

const url = 'https://docs.google.com/spreadsheets/d/1vSDKHJxiHHFtiC67EBUjIazqPAYpdORO6iDq6PPBHpE/pubhtml'

function init() {

  Tabletop.init( { key: url,
                   callback: showInfo,
                   simpleSheet: false } )

}


function showInfo(data, tabletop) {
  drawRings(data.rings.elements, data.segments.elements)

  window.data = data
  console.log('data', data)

}