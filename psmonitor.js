$(document).ready(function(){
  var sizeformatter = function (format, val) {
    if (typeof val == 'number') {
        if (!format) {format = '%.1f';}
        if (Math.abs(val) >= 1073741824 ) {return (val / 1073741824).toFixed(1) + 'GB';}
        if (Math.abs(val) >= 1048576 ) {return (val / 1048576 ).toFixed(1) + 'MB';}
        if (Math.abs(val) >= 1024) {return (val / 1024).toFixed(1) + 'KB';}
        return String(val.toFixed(1));
    }
    else {return String(val);}
  };
  var jsonData = $.ajax({
      async: false,
      url: "http://example02/load/example01",
      dataType:"json"
    });
  var cpu_user = [jsonData.responseJSON['cpu_user']];
  var cpu_irq = [jsonData.responseJSON['cpu_irq']];
  var cpu_idle = [jsonData.responseJSON['cpu_idle']];
  var cpu_system = [jsonData.responseJSON['cpu_system']];
  var cpu_nice = [jsonData.responseJSON['cpu_nice']];
  var disk_root = [jsonData.responseJSON['disk_root_free']];
  var phymem = [jsonData.responseJSON['phymem_free']];

  $.jqplot('cpu_user',  cpu_user, {
    title: "CPU User Percent: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}}},
    series:[{lineWidth:1, showMarker: false}]
  });

  $.jqplot('cpu_irq', cpu_irq, {
    title: "CPU IRQ: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}}},
    series:[{lineWidth:1, showMarker: false}]
  });

  $.jqplot('cpu_system', cpu_system, {
    title: "CPU System Percent: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}}},
    series:[{lineWidth:1, showMarker: false}]
  });

  $.jqplot('cpu_nice', cpu_nice, {
    title: "CPU Nice Percent: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}}},
    series:[{lineWidth:1, showMarker: false}]
  });

  $.jqplot('cpu_idle', cpu_idle, {
    title: "CPU Idle Percent: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}}},
    series:[{lineWidth:1, showMarker: false}]
  });

  $.jqplot('disk_root', disk_root, {
    title: "/Root Free: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}},
          yaxis:{labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions:{formatter: sizeformatter}}},
    series:[{lineWidth:1, showMarker: false}]
  });

  $.jqplot('phymem', phymem, {
    title: "Memory Free: EXAMPLE01",
    highlighter: {show: true, sizeAdjust: 7.5},
    cursor: {show: false},
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:"%a %H:%M"}},
          yaxis:{labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions:{formatter: sizeformatter}}},
    series:[{lineWidth:1, showMarker: false}]
  });

});