function popsel(){
    var teams = rosterdata[0];
    const teamkeys = Object.keys(teams);
    //console.log(teamkeys);
    var el = document.getElementById("team-dropdown");
    el.innerHTML = "";
    el.innerHTML += "Select A Team";
    for(var i=0;i<teamkeys.length;i++){
        el.innerHTML += '<option value="' + teamkeys[i] + '">' + teamkeys[i] + '</option>';
    }   
}
function show(el){
    var msg = document.getElementById('msg');
    var playerinfo = document.getElementById('playerinfo');
    msg.innerHTML="";
    playerinfo="";
    var playerlist = [];
    playerlist = rosterdata[0][el.value];
    var link = "";
    var playername = "";
    for(var i=0; i<playerlist.length;i++){
        playername = format_names[0][playerlist[i]];
        console.log(playerlist[i],playername);
        msg.innerHTML += '<a style="font-size:14px;font-" href = /player/' + playername + '><i>' + playerlist[i] + '</i></a><br>';
    }
}

function printname(){
    var prname = document.getElementById('playerinfo').innerHTML;
    playerinfo.innerHTML = format_names2[0][prname];
}

