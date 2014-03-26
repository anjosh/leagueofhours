var apiKey = "00a4dcdc-e561-4488-9ba2-c901d2350bea";
var apiKeyUrl = "api_key=" + apiKey;
var host = "https://prod.api.pvp.net/api/lol/";

var AramUnranked5x5AvgTime = 20;
var CoopVsAIAvgTime = 30;
var CoopVsAI3x3AvgTime = 20;
var OdinUnrankedAvgTime = 15;
var RankedPremade3x3AvgTime = 25;
var RankedPremade5x5AvgTime = 40;
var RankedSolo5x5AvgTime = 35;
var RankedTeam3x3AvgTime = 25;
var RankedTeam5x5AvgTime = 40;
var UnrankedAvgTime = 35;
var Unranked3x3AvgTime = 20;
var OneForAll5x5AvgTime = 35;
var FirstBlood1x1AvgTime = 5;
var FirstBlood2x2AvgTime = 10;
var SummonersRift6x6AvgTime = 35;

//$(document).ready(function() {
//  var progressBar = $('#progress-bar');
//  progressBar.on("transitionend", showHoursHideBar);
//  $('#recalculate').on("click", showFromHideHours);
//});

function getHours(region, summonerName) {
  //showBarHideForm();
  region = region.value.toLowerCase();
  summonerName = summonerName.value.toLowerCase();

  var summonerId = getSummonerId(region, summonerName);
  console.log(summonerId);
  
  //var games = getRecentGames(region, summonerId);
  //console.log(games);

  //var hours = getWeekTime(games);
  //console.log(hours);
  //$('#hours').text(Math.round(hours.toString()));

  // Get stats for Season 4
  var season = "SEASON4";
  var s4Stats = getSummonerStats(region, summonerId, season);

  // Set total hours based on Season 4 stats
  var s4WinsLosses = getWinsLosses(s4Stats);
  console.log(s4WinsLosses);

  var s4Hours = getTotalHours(s4WinsLosses);

  // Get stats for Season 3
  season = "SEASON3";
  var s3Stats = getSummonerStats(region, summonerId, season);

  // Add hours based on Season 3 stats to total hours
  var s3WinsLosses = getWinsLosses(s3Stats);
  console.log(s3WinsLosses);

  var s3Hours = getTotalHours(s3WinsLosses);

  totalHours = s3Hours + s4Hours;
  //$('#totalHours').text(Math.round(totalHours.toString()));

  return false;
}

function getTotalHours(winsLosses) {
  

}

function getWinsLosses(stats) {
  var winsLosses = new Object();
  var wins = new Object();
  var losses = new Object();

  for (var i = 0; i < stats.length; i++) {
    curr = stats[i];
    type = curr.playerStatSummaryType;
    wins[type] = curr.wins;
    losses[type] = curr.losses ? curr.losses : curr.wins;
  }

  winsLosses.wins = wins;
  winsLosses.losses = losses;

  return winsLosses;
}

function getSummonerStats(region, summonerId, season) {
  var callType = "/stats/by-summoner/";
  var version = "/v1.2";
  var url = host + region + version + callType + summonerId + "/summary" + "?" + "season=" + season + "&" + apiKeyUrl;
  var stats = JSON.parse(httpGet(url))
  return stats.playerStatSummaries;
}

function getWeekTime(games) {
  var time = 0;
  var weekInMilSec = 7 * 24 * 60 * 60 * 1000;
  console.log(weekInMilSec);
  console.log(Date.now());

  for (var i = 0; i < games.length; i++) {
    console.log(games[i].createDate);
    if (Date.now() - games[i].createDate < weekInMilSec) {
      time += games[i].stats.timePlayed;
    }
  }
  
  return time/60/60;
}

function getRecentGames(region, summonerId) {
  var callType = "/game/by-summoner/";
  var version = "/v1.3";
  var url = host + region + version + callType + summonerId + "/recent" + "?" + apiKeyUrl;
  var games = JSON.parse(httpGet(url))
  return games.games;
}

function getSummonerId(region, summonerName) {
  var callType = "/summoner/by-name/"
  var version = "/v1.3";
  var url = host + region + version + callType + summonerName + "?" + apiKeyUrl;
  var summonerObj = JSON.parse(httpGet(url));

  return summonerObj[summonerName].id;
}

function httpGet(theUrl) {
  var req = new XMLHttpRequest();
  req.open( "GET", theUrl, false );
  req.send( null );
  return req.responseText;
}

function showBarHideForm() {
  form = $('#get-hours');
  form.toggleClass("hide");

  $('#progress').toggleClass("hide");
  progressBar = $('.progress-bar');
  progressBar.width("100%");
}

function showHoursHideBar(hours) {
  $('#progress').toggleClass("hide");
  $('#progress-bar').width(0);
  $('#hours-container').toggleClass("hide");
}

function showFromHideHours() {
  $('#hours-container').toggleClass("hide");
  $('#get-hours').toggleClass("hide");
}
