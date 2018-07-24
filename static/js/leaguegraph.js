function plotgraph2(){

    document.getElementById("graph2div").innerHTML="&nbsp";
    document.getElementById("graph2div").innerHTML="<canvas id='graph2' style='position: absolute;'></canvas>";
        
    var a_scale = document.getElementById("stat-scale-2").selectedIndex+50;
    var scale = String(document.getElementsByTagName("option")[a_scale].value);
    var stat_name = document.getElementById("stat-name-2").selectedIndex+55;
    var statname = String(document.getElementsByTagName("option")[stat_name].value);
    var url = "/stat/all/"+scale+"/"+statname;
    console.log(url);

    var getJSON = function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
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
    
    getJSON(url,function(error,jsondata){
      var data = [];
      var label = [];
      var x=0;
      var y=0;
      if(error!=null){
          alert("This is fine. *dog in burning house.jpg*");
      } else {
        var labels = [];
        labels = Object.keys(jsondata);
        console.log(labels);
        for (var i=0;i<labels.length;i++){
          for (var j=0;j<jsondata[labels[i]]["data"].length;j++){

            x = Object.entries(jsondata[labels[i]]["data"])[j](0);
            y = Object.entries(jsondata[labels[i]]["data"])[j](1);
            console.log(jsondata[labels[i]]["data"]);
            console.log(y);
            if (x>0){
              data.push({x,y});
            }
            console.log(data);
          }
          
          
        }
        
        
        
        var chartdata = {
          labels: labels,
          datasets: [
            {label: label, data: data}
            ]
        };
        
        const chart = new Chart(document.getElementById("graph2"), {
          type: "scatter",
          data: chartdata,
          
          options: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 30
              }
            },

            layout: { 

            },
            elements: {
            hoverRadius: 25
            },
            tooltips: {
              backgroundColor: "rgba(50,50,50,0.4)",
              cornerRadius: 14,
              bodyFontSize: 14,
              borderWidth: 5,
              borderColor: "rgba(27,27,27,0.7)"
            },

          }
        });  


        }

      });
    }