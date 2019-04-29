function formatBytes(bytes,decimals) {
  if(bytes == 0) return '0';
  const k = 1024,
  dm = decimals <= 0 ? 0 : decimals || 2,
  sizes = ['Bytes', 'kB', 'mB', 'gB', 'tB', 'pB', 'eB', 'zB', 'yB'],
  i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function getApiData(machine) {
  let data = {};
  data.name = machine;
  data.listening = '';
  data.cpu = [];
  data.mem = [];
  data.disk_root = [];
  data.disk_app = [];
  await fetch("http://localhost/api/load/" + machine)
    .then(stream => stream.json())
    .then(mydata => {
      data.listening = mydata.slice(-1)[0]['localhost'];
      mydata.forEach(record => {
        data.cpu.push({
          y: record.cpu.idle,
          x: record.date
        });
        data.mem.push({
          y: record.phymem,
          x: record.date
        });
        data.disk_root.push({
          y: record.disk_root,
          x: record.date
        });
        data.disk_app.push({
          y: record.disk_app,
          x: record.date
        });
      });
    });
  return data;
};
    
function makeChart(machine, data, kind) {
  var ctx = document.getElementById(machine+kind);
  let maxY = 100;
  switch (kind) {
    case 'cpu':
      maxY = 100;
      break;
    case 'mem':
      maxY = 32000000000; //32gb
      break;
    case 'disk_root':
      maxY = 50000000000; //50gb
      break;
    case 'disk_app':
      maxY = 100000000000; //100gb
      break;
  }
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: kind,
        data: data[kind],
        borderWidth: 1.0,
        borderColor: 'navy',
        pointRadius: 0,
        pointHitRadius: 3,
        fill: false
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
        fontSize: 10,
        fontColor: ((data.listening === 'true' || data.listening === 'NA') ? 'green': 'red'),
        text: machine + ' (' + kind + ')',
      },
      plugins: {
        zoom:{
          zoom:{
            enabled:true,
            drag:true,
          }
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: "hour",
            displayFormats: { hour: "dddhA" },
            tooltipFormat: "MMM. DD ddd hA"
          },
          ticks: { autoSkip: false, maxTicksLimit: 5, fontSize: 8},
          position: 'bottom'
        }],
        yAxes: [{
          ticks: {
            fontSize: 8,
            suggestedMin: 0,
            suggestedMax: maxY,
            callback: function(value, index, values) {
              if (kind === 'mem' || kind === 'disk_root' || kind === 'disk_app') {
                return formatBytes(value, 1);
              } else { 
                return value 
              }
            }
          }
        }]
      }
    }
  });
  return data;
}
