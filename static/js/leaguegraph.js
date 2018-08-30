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

    var datasets = [];
    var label = [];
    var cluster = "";
    var x=0;
    var y=0;
    var r=0;
    var backgroundcolor = "";

  RgetJSON(urlR,function(error,Rjsondata){
    YgetJSON(urlY,function(error,Yjsondata){
      XgetJSON(urlX,function(error,Xjsondata){

        if(error!=null){
          } else {
          var labels = [];
          labels = Object.keys(Xjsondata);
          for (var i in labels){
            var name = labels[i];
            for (var j in Object.keys(labels[i])){
              try{
                if (Xjsondata[labels[i]][j]["Year"]==2018){
                  console.log(Xjsondata[labels[i]][j]["cluster"]);
                  x = Xjsondata[labels[i]][j]["data"];
                  y = Yjsondata[labels[i]][j]["data"];
                  r = Rjsondata[labels[i]][j]["data"];
                  if (Xjsondata[labels[i]][j]["cluster"] == "7") {
                    backgroundcolor = "rgba(255,0,0,.75)";
                    cluster = "All Scoring, No Defense";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "6") {
                    backgroundcolor = "rgba(255,128,0,.75)";
                    cluster = "Interior Scorer";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "5") {
                    backgroundcolor = "rgba(255,255,0,.75)";
                    cluster = "Defense First";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "4") {
                    backgroundcolor = "rgba(128,255,0,.75)";
                    cluster = "Rim Protector";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "3") {
                    backgroundcolor = "rgba(0,128,128,.75)";
                    cluster = "Outside Shooter";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "2") {
                    backgroundcolor = "rgba(0,128,255,.75)";
                    cluster = "Ball Hogging Scorer";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "1") {
                    backgroundcolor = "rgba(128,0,255,.75)";
                    cluster = "Two-Way Forward";
                  } else if (Xjsondata[labels[i]][j]["cluster"] == "0") {
                    backgroundcolor = "rgba(255,0,255,.75)";
                    cluster = "Primary Ballhandler";
                  } else {
                    backgroundcolor = "rgba(0,0,0,0)";
                    cluster = "";
                  }
                  
                  datasets.push({
                    data:[{x:x,y:y,r:r}], 
                    label: String("Player:" + name + " (" + Xjsondata[labels[i]][j]["cluster"] + cluster + ")\n"),
                    backgroundColor: backgroundcolor
                  });
                }
              }
              catch{
                  console.log("");
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
              
              legend: {
                display: false
              },
  
              layout: { 
  
              },
              elements: {
                borderColor: "rgba(25,25,25,.25)"
              },
              tooltips: {
                label: label,
                backgroundColor: "rgba(50,50,50,0.4)",
                cornerRadius: 14,
                bodyFontSize: 14,
                borderWidth: 5,
                borderColor: backgroundcolor
              },
  
            }
          });
        }
      })
    });
  });
}