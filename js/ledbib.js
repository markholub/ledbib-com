/*
Returns a path in the SVG path mini language, given
a radius

e.g. M -100 0 A 100 100 0 1 1 100 0 A 100 100 0 1 1 -100 0 (for radius == 100)

*/
function circularPath(radius) {
  const r = radius
  return `M -${r} 0 A ${r} ${r} 0 1 1 ${r} 0 A ${r} ${r} 0 1 1 -${r} 0 A ${r} ${r} 0 1 1 ${r} 0`
}

function drawRings(rings, segments) {

  const centreElement = d3.select('#centre')

  const ringsById = {}
  for (let ring of rings){
    ringsById[ring.id] = ring
  }

  for (let segment of segments) {
    segment.startAngle = parseInt(segment.startAngle)
    segment.endAngle = parseInt(segment.endAngle)
  }

  centreElement.selectAll('path.ring')
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
    
  a.append('textPath')
    .attr('xlink:href', (segment) => `#ring_${segment.ring}`)
    .attr('startOffset', (s) => `${100*((s.startAngle + s.endAngle)/2+90)/540}%`)
    .append('tspan')
    .attr('dy', '-10')
    .text((segment) => segment.text)

}

window.onload = function() { init() };

const url = 'https://docs.google.com/spreadsheets/d/1vSDKHJxiHHFtiC67EBUjIazqPAYpdORO6iDq6PPBHpE/pubhtml'

function init() {
  Tabletop.init( { key: url,
                   callback: showInfo,
                   simpleSheet: false } )
}

function showInfo(data, tabletop) {
  drawRings(data.rings.elements, data.segments.elements)
}