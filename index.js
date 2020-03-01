
/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 *
 * Outline:
 * 1. show how to load multiple files of data
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */

const m = {
    width: 800,
    height: 600
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

    svg.append('text')
        .attr('x', 400)
        .attr('y', 22)
        .attr('font-size','30px')
        .text('Airbnb in NYC')

const g = svg.append('g')

d3.json('nygeo.json').then(function(data) {

    d3.csv('data.csv').then(function(pointData) {

        const albersProj = d3.geoAlbers()
            .scale(70000)
            .rotate([74, 0])
            .center([0, 40.7])
            .translate([m.width/2, m.height/2]);

        const geoPath = d3.geoPath()
        .projection(albersProj)

        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('fill', 'grey')
            .attr('stroke', 'black')
            .attr('d', geoPath)

        g.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
                .attr('cx', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', 3)
                .attr('fill', 'steelblue')
                .on( "click", function(){
                  d3.select(this)
                    .attr("opacity",1)
                    .transition()
                    .duration( 1300 )
                    .attr("cx", 800)
                    .attr("cy", 600)
                    .attr("opacity", 0 )
                    .on("end",function(){
                      d3.select(this).remove();
                    })
                })


    })

})
