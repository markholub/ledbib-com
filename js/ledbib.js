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
    .append('g')

  window.centreElement = centreElement

  centreElement.attr('transform','translate(0,0) scale(1) rotate(0)')

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

  a.filter((s) => !s.link)
    .style('cursor', 'pointer')
    .on('click', () => {
      centreElement
        .transition()
        .duration(1000)
        .attr('transform','translate(-100,-100) scale(0.4) rotate(180)')
    })
    
  a.append('textPath')
    .attr('xlink:href', (segment) => `#ring_${segment.ring}`)
    .attr('startOffset', (s) => `${100*((s.startAngle + s.endAngle)/2+90)/720}%`)
    .append('tspan')
    .attr('dy', '-10')
    .text((segment) => segment.text)

}

const url = 'https://docs.google.com/spreadsheets/d/1vSDKHJxiHHFtiC67EBUjIazqPAYpdORO6iDq6PPBHpE/pubhtml'

$('document').ready(function() {
  var options = { videoId: 'deuhXlqHB9I', start: 0 };
  $('#wrapper').tubular(options);

  Tabletop.init( { key: url,
                   callback: showInfo,
                   simpleSheet: false } )

})


function showInfo(data, tabletop) {
  drawRings(data.rings.elements, data.segments.elements)

  window.data = data
  console.log('data', data)

}