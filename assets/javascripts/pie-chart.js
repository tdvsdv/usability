Raphael.fn.pieChart = function (cx, cy, r, values, border_width, labels) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    if (values[0] !== 100 && values[0] !== 0){
        var angle = 90,
            total = 0
            process = function (j) {
                var value = values[j],
                    angle_value = 360 * value / total;
                if (j === 0){
                    color = '#AFE4AD';
                    bcolor = '#63AD15';
                }
                else if (j === 1){
                    color = '#F6B3B3';
                    bcolor = '#FF4A4A';
                }
                if (value !== 0) {
                    p = sector(cx, cy, r, angle, angle + angle_value, {fill: "90-" + bcolor + "-" + color, stroke: "#fff", "stroke-width": border_width, "stroke-linejoin": "round", "stroke-opacity": 1})
                    if (angle_value <= 180) {
                        p.transform("S-1, 1, " + cx + ', ' + cy);
                    }
                    else {
                        p.transform("S-1,1");
                    }
                    if (value === 60){
                        if (j === 0){
                            p.transform("...T" + (2 + 2*Math.ceil(border_width)) + ",0");
                        }
                        else if (j === 1){
                            p.transform("...T" + (-2 - 2*Math.ceil(border_width)) + ",0");
                        }
                    }
                }
                angle += angle_value;
                chart.push(p);
            };
        for (var i = 0, ii = values.length; i < ii; i++) {
            total += values[i];
        }
        for (i = 0; i < ii; i++) {
            process(i);
        }
    }
    else {
        if (values[0] === 100){
            color = '#AFE4AD';
            bcolor = '#63AD15';
        }
        else if (values[0] === 0) {
            color = '#F6B3B3';
            bcolor = '#FF4A4A';
        }
        var circle = paper.circle(r, r, r).attr({fill: "90-" + bcolor + "-" + color, stroke: "#fff", "stroke-width": border_width, "stroke-linejoin": "round", "stroke-opacity": 1});
        chart.push(circle);
    }

    return chart;
};

