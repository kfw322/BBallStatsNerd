from flask import Flask, jsonify, render_template, request, redirect, flash
import json
import requests
import pandas as pd
import numpy as np

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

raw_data = pd.read_csv("data/2017-18_playerBoxScore.csv", encoding="utf-8")
tot2018_df = pd.read_csv("data/player_stat_totals_2017_18.csv",encoding="utf-8")
past_seasons_totals = pd.read_csv("data/past_seasons_totals.csv", encoding="utf-8")
raw_advstats = pd.read_csv("data/raw_player_box_score_advanced_2017-18.csv", encoding="utf-8")
raw_gamesumm = pd.read_csv("data/raw_game_summary_2017-18.csv", encoding="utf-8")
merged_box_adv = pd.read_csv("data/merged.csv",encoding="utf-8")
all_data = merged_box_adv[["playDispNm","playPos","gmDate","minutes","playStat","playPTS","playTRB","playAST","playSTL","playBLK","playTO","playPF","playFGM","playFGA","play3PM","play3PA","playFTM","playFTA","playORB","teamAbbr","opptAbbr","teamLoc","teamRslt","offensiveRating","defensiveRating","netRating","assistPercentage","assistTurnOverRatio","assistRatio","offensiveReboundPercentage","defensiveReboundPercentage","reboundPercentage","teamTurnOverPercentage","effectiveFieldGoalPercentage","trueShootingPercentage","usageRate","pace","playerEstimatedImpact","comment"]]
all_data=all_data[all_data["comment"].isnull()]
date_id_dict = raw_gamesumm[["gameId","gameDate"]].astype(str).set_index("gameId").to_dict()["gameDate"]
for i,d in date_id_dict.items():
    date_id_dict[i]=d.replace("T00:00:00","")
with open("static/js/date_id_dict.js","w",encoding="utf8") as x:
    x.write("date_id_dict = [")
    json.dump(date_id_dict, x, ensure_ascii=False)
    x.write("]")

past_seasons_totals["possUsed"] = 0.96 * (past_seasons_totals["FGA"] + (0.44 * past_seasons_totals["FTA"]) + past_seasons_totals["TOV"] - past_seasons_totals["ORB"])
past_seasons_totals["possOnCourt"] = past_seasons_totals["possUsed"] / (past_seasons_totals["USG%"]/100)

team_list = sorted(all_data["teamAbbr"].astype(str).unique().tolist())
teamdata = {}
teamplayers = {}
player_list = []
teamdata["ALL"] = {}
for team in team_list:
    teamdata[team] = {}
    teamdataframe = all_data[all_data["teamAbbr"]==team]
    players = sorted(all_data[all_data["teamAbbr"]==team].playDispNm.unique().tolist())
    for p in players:
        teamdata[team][p] = teamdataframe[teamdataframe["playDispNm"]==p]
        teamdata["ALL"][p] = all_data[all_data["playDispNm"]==p]
    player_list.extend(players)
clean_list = {}
format_list = {}

def clean_names(player_list,clean_list,format_list):
    for name in player_list:
        inputname=name
        name=name.replace("Luc Mbah a Moute","LucRichardMbahAMoute")
        name=name.replace("Luc Richard Mbah a Moute","LucRichardMbahAMoute")
        name=name.replace("Nazareth","Naz")
        name=name.replace("Raulzinho","Raul")
        name=name.replace("James Webb III","James Webb")
        name=name.replace("James Web III","James Webb")
        name=name.replace("Juancho","Juan")
        name=name.replace("Patty Mills","Patrick Mills")
        name=name.replace("J.J. Barea","Jose Barea")
        name=name.replace("Ish Smith","Ishmael Smith")
        name=name.replace("Poeltl","Poltl")
        name=name.replace("Vincent Hunter","Vince Hunter")
        name=name.replace("Joe Young","Joseph Young")
        name=name.replace("Maurice Harkless","Moe Harkless")
        name=name.replace("Wes Iwundu","Wesley Iwundu")
        name=name.replace("Wesley Johnson","Wes Johnson")
        name=name.replace("Taurean Waller-Prince","Taurean Prince")
        for x in "ÀÁÂÃÄÅĀ":
            name=name.replace(x,"A")
        for x in "àáâãäåā":
            name=name.replace(x,"a")
        for x in "ëèéê":
            name=name.replace(x,"e")
        for x in "ôóøŏöò":
            name=name.replace(x,"o")
        for x in "úùüū":
            name=name.replace(x,"u")
        
        name=name.replace("ģ","g")
        name=name.replace("č","c")
        name=name.replace("ć","c")
        name=name.replace("š","s")
        name=name.replace("ņ","n")
        name=name.replace("ñ","n")
        name=name.replace("í","i")
        name=name.replace("Ž","Z")
        name=name.replace("ž","z")
        name=name.replace("ý","y")
        name=name.replace("'","")
        name=name.replace("’","")
        name=name.replace(".","")
        name=name.replace(" Jr","")
        name=name.replace("IV","")
        name=name.replace("III","")
        name=name.replace("II","")
        name=name.replace("-","")
        name=name.replace(",","")
        name=name.replace(" ","")
        name=name.replace("*","")
    
        clean_list[inputname] = name
        format_list[name] = inputname
    return player_list, clean_list, format_list

clean_names(player_list,clean_list,format_list)

with open("static/js/format_names.js","w",encoding="utf8") as x:
    x.write("format_names = [")
    json.dump(clean_list, x, ensure_ascii=False)
    x.write("]")
with open("static/js/format_names2.js","w",encoding="utf8") as x:
    x.write("format_names2 = [")
    json.dump(format_list, x, ensure_ascii=False)
    x.write("]")   

modern_players = sorted(past_seasons_totals.loc[past_seasons_totals["Year"]>2017]["formatname"].unique().tolist())





@app.route("/")
def home():
    return render_template("index.html")

@app.route("/player/<playername>")
def player(playername):
    year=2018
    playergamelog = teamdata["ALL"][format_list[playername]]
    htmlgamelog = str(str(playergamelog.to_html(index=False)).replace("\n","").replace("'","").replace(",","").replace("play","").replace("dataframe","w3-hoverable w3-table-all w3-tiny"))
    return render_template("index.html", playername=playername, year=year, htmlgamelog=htmlgamelog)

@app.route("/stat/<playername>/<stattype>/<year>")
def stats(playername,stattype,year):
#"total","pergame","per36", or "per100"
    playerstats=""
    playerseasons = past_seasons_totals[past_seasons_totals["formatname"]==playername]
    playeryearstats = playerseasons[playerseasons["Year"]==float(year)]
    playerstats = playeryearstats[["formatname","G","MP","3PA","3P","AST","BLK","DRB","FGA","FG","FTA","FT","ORB","PF","PTS","STL","TOV","TRB","possUsed","possOnCourt"]]#,"possOnCourt","possUsed"]]

    gamesplayed=playerstats["G"].iloc[0]
    minutesplayed=playerstats["MP"].iloc[0]
    possplayed=playerstats["possOnCourt"].iloc[0]

    if stattype == "total":
        playertotdict = playerstats.set_index("formatname").T.fillna("").to_dict()
        return jsonify(playertotdict)
    elif stattype == "pergame":
        playerpergamestats = playerstats
        for stat in ["MP","PTS","AST","TOV","STL","BLK","PF","FGA","FG","3PA","3P","FTA","FT","ORB","DRB","TRB","possOnCourt","possUsed"]:
            playerpergamestats[stat] = playerstats[stat].iloc[0]/gamesplayed
        playerpergamedict = playerpergamestats.set_index("formatname").T.fillna("").to_dict()
        return jsonify(playerpergamedict)
    elif stattype == "per36":
        playerper36mstats = playerstats
        for stat in ["MP","PTS","AST","TOV","STL","BLK","PF","FGA","FG","3PA","3P","FTA","FT","ORB","DRB","TRB","possOnCourt","possUsed"]:
            playerper36mstats[stat] = 36 * playerstats[stat].iloc[0]/minutesplayed
        playerper36dict = playerper36mstats.set_index("formatname").T.fillna("").to_dict()
        return jsonify(playerper36dict)
    elif stattype == "per100":
        playerper100pstats = playerstats
        for stat in ["MP","PTS","AST","TOV","STL","BLK","PF","FGA","FG","3PA","3P","FTA","FT","ORB","DRB","TRB","possOnCourt","possUsed"]:
            playerper100pstats[stat] = 100 * playerstats[stat].iloc[0]/possplayed
        playerper100dict = playerper100pstats.set_index("formatname").T.fillna("").to_dict()
        return jsonify(playerper100dict)
    else:
        return "error: wrong stat-type"

@app.route("/stat/<playername>/total")
def totseasonstats(playername):
    playerstats = past_seasons_totals[past_seasons_totals["formatname"]==playername]
    playertotdict = {playername: playerstats.set_index("Year").T.fillna("").to_dict()}
    return jsonify(playertotdict)

@app.route("/stat/all/total")
def totstatsallplayers():
    allplayerstatsdict = {}
    for playername in past_seasons_totals.formatname.unique():
        playerstats = past_seasons_totals[past_seasons_totals["formatname"]==playername]
        playertotdict = playerstats.set_index("Year").T.fillna("").to_dict()
        allplayerstatsdict[str(playername)] = playertotdict
    return jsonify(allplayerstatsdict)

@app.route("/stat/all/total/<stat>")
def alltotal(stat):
    indivstat = {}
    for player in modern_players:
        year_player_df = past_seasons_totals.loc[(past_seasons_totals["MP"]> 500) & (past_seasons_totals["formatname"]==player)][["formatname","Year",stat]]
        year_player_df["data"]=year_player_df[stat]
        indivstat[player] = year_player_df[["data","Year"]].fillna("").reset_index(drop=True).T.to_dict()
    return jsonify(indivstat)

@app.route("/stat/all/pergame/<stat>")
def allpergame(stat):
    indivstat = {}
    for player in modern_players:
        year_player_df = past_seasons_totals.loc[(past_seasons_totals["MP"]> 500) & (past_seasons_totals["formatname"]==player)][["formatname","Year","G",stat]]
        year_player_df["data"]=year_player_df[stat]/(year_player_df["G"])
        indivstat[player] = year_player_df[["data","Year"]].fillna("").reset_index(drop=True).T.to_dict()
    return jsonify(indivstat)

@app.route("/stat/all/per36/<stat>")
def allper36(stat):
    indivstat = {}
    for player in modern_players:
        year_player_df = past_seasons_totals.loc[(past_seasons_totals["MP"]> 500) & (past_seasons_totals["formatname"]==player)][["formatname","Year","MP",stat]]
        year_player_df["data"]=year_player_df[stat]/(year_player_df["MP"]/36)
        indivstat[player] = year_player_df[["data","Year"]].fillna("").reset_index(drop=True).T.to_dict()
    return jsonify(indivstat)

@app.route("/stat/all/per100/<stat>")
def allper100(stat):
    indivstat = {}
    for player in modern_players:
        year_player_df = past_seasons_totals.loc[(past_seasons_totals["MP"]> 500) & (past_seasons_totals["formatname"]==player)][["formatname","Year","possOnCourt",stat]]
        year_player_df["data"]=year_player_df[stat]/(year_player_df["possOnCourt"]/100)
        indivstat[player] = year_player_df[["data","Year"]].fillna("").reset_index(drop=True).T.to_dict()
    return jsonify(indivstat)





#generates HTML. don't need right now, might later
# @app.route("/player/<playername>/seasonstats/<year>")
# def seasonstats(playername,year):
#     year=2018

#     playertotstats = tot2018_df[tot2018_df["formatname"]==playername]
#     htmltotstats = str(str(playertotstats.to_html(index=False)).replace("\n","").replace("'","").replace(",","").replace("play","").replace("dataframe","w3-hoverable w3-table-all w3-tiny"))

#     gamesplayed = playertotstats["games"]
#     playerpergamestats = playertotstats
#     for stat in ["minutes","playPTS","playAST","playTO","playSTL","playBLK","playPF","playFGA","playFGM","play3PA","play3PM","playFTA","playFTM","playORB","playDRB","playTRB","possOnCourt","possUsed"]:
#         playerpergamestats[stat] = playerpergamestats[stat]/gamesplayed
#     htmlpergamestats = str(str(playerpergamestats.to_html(index=False)).replace("\n","").replace("'","").replace(",","").replace("play","").replace("dataframe","w3-hoverable w3-table-all w3-tiny"))

#     minutesplayed = playertotstats["minutes"]
#     playerper36mstats = playertotstats
#     for stat in ["playPTS","playAST","playTO","playSTL","playBLK","playPF","playFGA","playFGM","play3PA","play3PM","playFTA","playFTM","playORB","playDRB","playTRB","possOnCourt","possUsed"]:
#         playerper36mstats[stat] = 36 * playerper36mstats[stat]/minutesplayed
#     htmlper36mstats = str(str(playerper36mstats.to_html(index=False)).replace("\n","").replace("'","").replace(",","").replace("play","").replace("dataframe","w3-hoverable w3-table-all w3-tiny"))
    
#     possessionsplayed = playertotstats["possOnCourt"]
#     playerper100pstats = playertotstats
#     for stat in ["minutes","playPTS","playAST","playTO","playSTL","playBLK","playPF","playFGA","playFGM","play3PA","play3PM","playFTA","playFTM","playORB","playDRB","playTRB","possUsed","possOnCourt"]:
#         playerper100pstats[stat] = 100 * playerper100pstats[stat]/possessionsplayed
#     htmlper100pstats = str(str(playerper100pstats.to_html(index=False)).replace("\n","").replace("'","").replace(",","").replace("play","").replace("dataframe","w3-hoverable w3-table-all w3-tiny"))   

#     return "\n\nTOTALS\n\n" + htmltotstats + "\n\nPER GAME\n\n" + htmlpergamestats + "\n\nPER 36 MINUTES\n\n" + htmlper36mstats + "\n\nPER 100 POSSESSIONS\n\n" + htmlper100pstats

# @app.route("/player/<playername>/gamelog/<year>")
# def gamelog(playername,year):
#     year=2018
#     playergamelog = teamdata["ALL"][format_list[playername]]
#     htmlgamelog = str(str(playergamelog.to_html(index=False)).replace("\n","").replace("'","").replace(",","").replace("play","").replace("dataframe","w3-hoverable w3-table-all w3-tiny"))
#     return render_template("index.html", playername=playername, year=year, htmlgamelog=htmlgamelog)

if __name__ == "__main__":
    app.run(debug=True)