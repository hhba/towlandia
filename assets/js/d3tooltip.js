// Developed by Antena
// ~~~~~~~~~~~~~~~~~~~
// Highly inspired by https://github.com/zmaril/d3-bootstrap-plugins

(function() {
    var fillContent = function(options, create) {
        var element = d3.select(this);

        var calculateCoordinates = function(selection) {
            var center, offsets;
            var width = selection[0][0].clientWidth, height = selection[0][0].clientHeight;
            center = [0, 0];
            if (options.type === "mouse") {
                center = [d3.event.pageX, d3.event.pageY]
                center[0] -= width/2;
            } else {
                offsets = element[0][0].getBoundingClientRect();
                center[0] = offsets.left;
                center[0] += window.scrollX;
                center[1] = offsets.top;
                center[1] += window.scrollY;

                if (options.gravity == "right") {
                    center[0] += offsets.width;
                    center[1] += offsets.height/2 - height/2;
                }
                if (options.gravity == "bottom") {
                    center[0] += offsets.width/2 - width/2;
                    center[1] += offsets.height;
                }
                if (options.gravity == "left") {
                    center[0] -= width;
                    center[1] += offsets.height/2 - height/2;
                }
                if (options.gravity == "top") {
                    center[0] += offsets.width/2 - width/2;
                    center[1] -= height;
                }
            }

            center[0] += options.displacement[0];
            center[1] += options.displacement[1];

            return center;
        };

        element.on("mouseover", function() {
            if (options.show()) {
                var tip = create();
                options.updateContent.call(null);
                var coordinates = calculateCoordinates(tip);
                tip
                    .style("left", coordinates[0] + "px")
                    .style("top", coordinates[1] + "px");
            }
        });

        if (options.type == "mouse") {
            if (options.show()) {
                element.on("mousemove", function() {
                    var tip = d3.selectAll("." + options.cssClass);
                    var coordinates = calculateCoordinates(tip);
                    tip
                        .style("left", coordinates[0] + "px")
                        .style("top", coordinates[1] + "px");
                });
            }
        }

        element.on("mouseout", function() {
            if (options.show()) {
                var tip = d3.selectAll("." + options.cssClass);
                tip.remove();
            }
        });
    };

    d3.selection.prototype.tooltip = function(f) {
        var body = d3.select('body');

        return this.each(function(d, i) {
            var create_tooltip, options;

            options = f.apply(this, arguments);
            if (!options.show) {
                options.show = function() { return true };
            }
            if (!options.updateContent) {
                options.updateContent = function() { };
            }
            if (!options.displacement) {
                options.displacement = [0,0];
            }
            if (!options.cssClass) {
                options.cssClass = "tooltip";
            }
            if (!options.gravity) {
                options.gravity = "right";
            }
            create_tooltip = function() {
                var tip = body.append("div")
                    .classed(options.cssClass, true)
                    .style("position", "absolute")
                    .style("z-index", "10001")
                    .style("display", "block")
                    .style("pointer-events", "none");

                tip.append("div")
                    .html(options.content)
                    .attr("class", "inner");

                return tip;
            }

            return fillContent.call(this, options, create_tooltip);
        });
    }

})();