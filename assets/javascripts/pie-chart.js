Raphael.fn.pieChart = function (cx, cy, r, values, labels) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, + (endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    if (values[0] !== 100 && values[0] !== 0){
        var angle = 0,
            total = 0,
            start = 0,
            process = function (j) {
                var value = values[j],
                    hue,
                    angleplus = 360 * value / total;

                    if (j === 0){
                      color = '#82C528';
                      bcolor = '#63AD15';
                    }
                    else if (j === 1){
                      color = '#FF3F3F';
                      bcolor = '#FF3030';
                    }
                    if (value !== 0) {
                        p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: "none"})
                    }
                angle += angleplus;
                chart.push(p);
                start += .1;
            };
        for (var i = 0, ii = values.length; i < ii; i++) {
            total += values[i];
        }
        for (i = 0; i < ii; i++) {
            process(i);
        }
    }
    else{
        if (values[0] === 100){
            color = '#82C528';
            bcolor = '#63AD15';
        }
        else if (values[0] === 0) {
            color = '#FF3F3F';
            bcolor = '#FF3030';
        }
        var circle = paper.circle(r, r, r).attr({fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 0});
        chart.push(circle);
    }

    return chart;
};

