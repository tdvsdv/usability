$(document).ready(function () {
  $('div.progress-bar-pie-chart').each(function(){
    var radius = this.getAttribute('data-radius');
    var pcts = this.getAttribute('data-pcts');
    $(this).highcharts({
       chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 1,
            plotShadow: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                dataLabels: { enabled: false }
            }
        },
        series: [{
            type: 'pie',
            data: pcts
        }]
    });
  });
});