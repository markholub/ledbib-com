/*
Returns a path in the SVG path mini language, given
a radius

e.g. M -100 0 A 100 100 0 1 1 100 0 A 100 100 0 1 1 -100 0 (for radius == 100)

*/
function circularPath(radius) {
  const r = radius
  return `M -${r} 0 A ${r} ${r} 0 1 1 ${r} 0 A ${r} ${r} 0 1 1 -${r} 0 A ${r} ${r} 0 1 1 ${r} 0 A ${r} ${r} 0 1 1 -${r} 0`
}

function clickHandler(d) {

  if (d.link && d.link.length > 0){
    return
  }
  
  const centreElement = d3.select('#centre')
  const a = centreElement.selectAll('a')

  var svg = d3.select('svg').node()
  var scaler = d3.select('#scaler').node()
  var scale = scaler.getBoundingClientRect().width / scaler.getBBox().width
  
  var rect = svg.getBoundingClientRect()
  var h = rect.height / scale
  var w = rect.width / scale

  var angle = (d.startAngle + d.endAngle) / 2

  a.classed('selected', function(e){return e == d})

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

  d3.select('#content iframe').node().contentWindow.location.replace(src)

  d3.select('#content')
    .style('opacity', 0)
    .style('display', 'block')
    .transition()
    .duration(1000)
    .style('opacity', 1)

}



function drawRings(rings, segments) {

  const centreElement = d3.select('#centre')

  function linkHandler(d){
    window.open(d.link)
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

  rings.forEach(function(ring){
    ringsById[ring.id] = ring
  })

  segments.forEach(function(segment){
    segment.startAngle = parseInt(segment.startAngle)
    segment.endAngle = parseInt(segment.endAngle)
  })

  const ringElements = centreElement.select('#rings').selectAll('path.ring')
    .data(rings)
    .enter()
    .append('path')
    .attr('class', 'ring')
    .attr('d', function(ring){ return circularPath(ring.radius) })
    .attr('id', function(ring){ return 'ring_' + ring.id})
    .style('opacity', 0)

  const a = centreElement.selectAll('a')
    .data(segments)
    .enter()
    .append('a')
    .style('opacity', 0)

  const text = a.append('text')
    .style('font-size', function(segment) { 
      return ringsById[segment.ring].fontSize
    })
    .attr('text-anchor', 'middle')

  a.filter(function(s){ return s.link })
    .style('cursor', 'pointer')
    .on('click', function(d){
      window.location.hash = d.text.toLowerCase()
      linkHandler(d)
    })

  a.filter(function(s){ return !s.link })
    .style('cursor', 'pointer')
    .on('click', function(d){
      window.location.hash = d.text.toLowerCase()
      //clickHandler(d)
    })
    
  text.append('textPath')
    .attr('xlink:href', function(segment){ return '#ring_' + segment.ring })
    .attr('startOffset', function(s){ return 100*((s.startAngle + s.endAngle)/2+90)/720 + '%'})
    .append('tspan')
    .attr('dy', '-10')
    .text( function(segment) { return segment.text })

  d3.select('#logo')
    .on('click', homeHandler)

  ringElements.transition()
    .duration(1000)
    .style('opacity', 1)

  a.transition()
    .duration(1000)
    .delay(1000)
    .style('opacity', 1)

}

function init() {
  document.getElementById('video1').playbackRate = 0.5;
  d3.json('./js/rings-and-segments.json', function(data){
    drawRings(data.rings, data.segments)
    function checkHash(e) {
      if (e) {
        e.preventDefault()
      }
      var name = window.location.hash.split('#').pop().toUpperCase()
      if (name.length) {
        var segment = data.segments.filter(function(segment){
          return segment.text == name
        })
        if (segment.length) {
          segment = segment[0]
          clickHandler(segment)
        }
      }
    }
    checkHash()
    window.addEventListener("popstate", checkHash)
  })
}
