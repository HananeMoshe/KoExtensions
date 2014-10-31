define(['./util/configurable','./filterData'],function(configurable, filterData) {
    
    var defaultConfig = {
        xScale: null
    };

    return function(config) {
        config = config || {};
        for (var key in defaultConfig) {
            config[key] = config[key] || defaultConfig[key];
        }
        var eventLine = function(selection) {
            
            selection.each(function(data) {
                d3.select(this).selectAll('text').remove();

                d3.select(this).append('text')
                    .text(function(d) {
                        var count = filterData(d.dates, config.xScale).length;
                        return d.name + (count > 0 ? ' (' + count + ')' : '');
                    })
                    .attr('text-anchor', 'end')
                    .attr('transform', 'translate(-20)')
                    .style('fill', 'black');

                d3.select(this).selectAll('circle').remove();

                var circle = d3.select(this).selectAll('circle')
                    .data(function(d) {
                        // filter value outside of range
                        return filterData(d.dates, config.xScale);
                    });

                circle.enter()
                    .append('circle')
                    .attr('cx', function(d) {
                        return config.xScale(config.eventDate(d));
                    })
                    .attr('cy', -5)
                    .attr('r', function (d) {
                        return config.bullScale(config.eventSize(d));
                    })
                    .style('fill', config.eventColor);

                circle.exit().remove();

            });
        };

        configurable(eventLine, config);

        return eventLine;
    }
});