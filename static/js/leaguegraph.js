function plotgraph2(){

    document.getElementById("graph2div").innerHTML="&nbsp";
    document.getElementById("graph2div").innerHTML="<canvas id='graph2' style='position: absolute;'></canvas>";
    var a_scale = document.getElementById("stat-scale-X").selectedIndex+50;
    var scale = String(document.getElementsByTagName("option")[a_scale].value);
    var stat_name = document.getElementById("stat-name-X").selectedIndex+55;
    var statname = String(document.getElementsByTagName("option")[stat_name].value);
    var urlX = "/stat/all/"+scale+"/"+statname;
    var a_scale = document.getElementById("stat-scale-Y").selectedIndex+99;
    var scale = String(document.getElementsByTagName("option")[a_scale].value);
    var stat_name = document.getElementById("stat-name-Y").selectedIndex+104;
    var statname = String(document.getElementsByTagName("option")[stat_name].value);
    var urlY = "/stat/all/"+scale+"/"+statname;
    var a_scale = document.getElementById("stat-scale-R").selectedIndex+148;
    var scale = String(document.getElementsByTagName("option")[a_scale].value);
    var stat_name = document.getElementById("stat-name-R").selectedIndex+153;
    var statname = String(document.getElementsByTagName("option")[stat_name].value);
    var urlR = "/stat/all/"+scale+"/"+statname;
    console.log(urlX, urlY, urlR);

    var RgetJSON = function(urlR, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', urlR, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status, xhr.response);
      }};
      xhr.send();
    };
    var YgetJSON = function(urlY, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', urlY, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status, xhr.response);
      }};
      xhr.send();
    };
    var XgetJSON = function(urlX, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', urlX, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status, xhr.response);
      }};
      xhr.send();
    };
  RgetJSON(urlR,function(error,Rjsondata){
    YgetJSON(urlY,function(error,Yjsondata){
      XgetJSON(urlX,function(error,Xjsondata){
        var merged = {};
        var datasets = [];
        var data = [];
        var label = [];
        var x=0;
        var y=0;
        var r=0;
        var year=0;
        if(error!=null){
          } else {
          var labels = [];
          labels = Object.keys(Xjsondata);
          for (var i in labels){
            var name = labels[i];
            for (var j in Object.keys(labels[i])){
              try{
                if (Xjsondata[labels[i]][j]["Year"]==2018){
                  x = Math.round(Xjsondata[labels[i]][j]["data"]*1000)/1000;
                  y = Math.round(Yjsondata[labels[i]][j]["data"]*1000)/1000;
                  year = Rjsondata[labels[i]][j]["Year"];
                  r = Math.round(Rjsondata[labels[i]][j]["data"]*1000)/1000;
                  datasets.push({data:[{x:x,y:y,r:r}], label: String(name + year)});
                }
                
              } catch(e){
              }
            }

            
          }
          var chartdata = {
            datasets:datasets
          };
          const chart = new Chart(document.getElementById("graph2"), {
            type: "bubble",
            data: chartdata,
            
            options: {
              scales: {
                xAxes: [{
                  ticks: {
                    suggestMin: -100
                  }
                }]
                
              },
              legend: {
                display: false
              },
  
              layout: { 
  
              },
              elements: {
              hoverRadius: 25
              },
              tooltips: {
                label: label,
                backgroundColor: "rgba(50,50,50,0.4)",
                cornerRadius: 14,
                bodyFontSize: 14,
                borderWidth: 5,
                borderColor: "rgba(27,27,27,0.7)"
              },
  
            }
          });
        }
      })
    });
  });
}