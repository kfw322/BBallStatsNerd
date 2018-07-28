function plotgraph1(){

    document.getElementById("graph1div").innerHTML="&nbsp";
    document.getElementById("graph1div").innerHTML="<canvas id='graph1' style='position: absolute;'></canvas>";
        
    var playername = String(document.getElementById("stores_the_player_name").innerText);

    var a_scale = document.getElementById("stat-scale").selectedIndex+1;
    var scale = String(document.getElementsByTagName("option")[a_scale].value);
    var stat_name = document.getElementById("stat-name").selectedIndex+6;
    var statname = String(document.getElementsByTagName("option")[stat_name].value);

    var url = "/stat/"+playername+"/total";

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
      if(error!=null){
      } else {
        
        var divisor = 0;
        var possUsed = 0;
        var possOnCourt = 0;
        var ignored = 0;
        var thestat = [];
        var labels = [];
        var years = Object.keys(jsondata[playername]);

        
        for (var i=0; i < years.length; i++) {
          if (Number(years[i])<1999){
            delete labels[i];
            delete years[i];
            delete thestat[i];
            ignored++;
          } else {
            switch (scale){
            
              case "Total": 
                divisor = 1;
                break;
              case "Per Game": 
                divisor = jsondata[playername][years[i]]["G"];
                break;
              case "Per 36 Min": 
                divisor = jsondata[playername][years[i]]["MP"]/36;
                break;
              case "Per 100 Poss": 
                possUsed = 0.96 * (jsondata[playername][years[i]]["FGA"] + (0.44 * jsondata[playername][years[i]]["FTA"]) + jsondata[playername][years[i]]["TOV"] - jsondata[playername][years[i]]["ORB"]);
                possOnCourt = possUsed / (jsondata[playername][years[i]]["USG%"]/100);
                divisor = possOnCourt/100;
                break;
            }
            console.log(statname);
            console.log(divisor);
            var result = jsondata[playername][years[i]][statname]/divisor;
            thestat.push(result);
            console.log(thestat);
            labels[i-ignored] = Number(years[i]);
            }
        }

        var chartdata = {
          labels: labels,
          datasets: [
            {label: statname, data: thestat}
            ]
        };
        
        const chart = new Chart(document.getElementById("graph1"), {
          type: "line",
          data: chartdata,
          
          options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
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