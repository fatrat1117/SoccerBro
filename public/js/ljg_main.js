/**
 * Created by jixiang on 4/9/16.
 */

var _teamId;
var _teamIdValid = false;

var _teamInfoModel = {
  url: ko.observable(""),
  name: ko.observable("")
}

//
// var teamPlayers = getTeamPlayersRef(_teamId);
// teamPlayers.on('value', function (snapshot) {
//
// }

window.onload = function () {

  console.log("program start");
  initApp();
  firebaseRedirect();
  _teamId = $_GET("teamId");
  if (_teamId != null) {
    teamIdValidation();
  } else {
    console.log("Error: teamId is null");
  }
};

function initApp() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8",
    authDomain: "project-3416565325366537224.firebaseapp.com",
    databaseURL: "https://project-3416565325366537224.firebaseio.com",
    storageBucket: "project-3416565325366537224.appspot.com",
  };
  firebase.initializeApp(config);
}

function teamIdValidation() {

  console.log(_teamId);

  var teamRef = getTeamRef(_teamId);
  ko.applyBindings(_teamInfoModel);
  teamRef.on('value', function (snapshot) {
    console.log(snapshot.val());
    if (snapshot.val() == null) {
      console.log("Error: invalid teamId, please check it then resend request!");
      window.location.href = "404.html";
    } else {
      console.log("Success:teamId Validation pass!");
      _teamIdValid = true;
      var teamInfo = snapshot.val()["basic-info"];
      _teamInfoModel.url(teamInfo["logo"]);
      _teamInfoModel.name(teamInfo["name"]);
      console.log(_teamInfoModel);
    }
  });
}

function insertTeamInfo() {
  if (_teamIdValid == false) {
    return;
  }


}

function onFbLogin() {
  if (_teamIdValid == false) {
    alert("teamId is not valid, please resend the request!");
    return;
  }
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}


function onEmailLogin() {

  if (_teamIdValid == false) {
    alert("teamId is not valid, please resend the request!");
    return;
  }
  var email = document.forms["jointeam_email_login_form"]["jointeam_email_input_login"].value;
  var password = document.forms["jointeam_email_login_form"]["jointeam_password_input_login"].value;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function (credential) {

    console.log(credential);
    console.log(credential.uid);
    var userId = credential.uid;
    if (userId) {
      //Add player
      insertIntoPlayerTable(credential);
      //Add team
      insertIntoTeamsTable(credential);
      alert(email + "!, SoccerBro 欢迎你！");
      window.location.href = "success.html";

    }
  }, function (error) {
    var errorMessage = error.message;
    //alert(errorMessage);
    displayLoginError(errorMessage);
  });
  return false;
}

function onEmailRegister() {

  if (_teamIdValid == false) {
    alert("teamId is not valid, please resend the request!");
    return;
  }
  var email = document.forms["jointeam_email_register_form"]["jointeam_email_input_register"];
  var password = document.forms["jointeam_email_register_form"]["jointeam_password_input_register"];

  firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function (result) {

    firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(function (credential) {

      console.log(credential);
      console.log(result.uid);
      console.log(credential.uid);
      var userId = credential.uid;
      if (userId) {

        //Add player
        insertIntoPlayerTable(credential);
        //Add team
        insertIntoTeamsTable(credential);
        alert(email.value + "!, SoccerBro 欢迎你！");
        window.location.href = "success.html";
        return true;
      }
    }, function (error) {
      var errorMessage = error.message;
      alert(errorMessage);
    });


  }, function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;


    console.log(errorCode);
    console.log(email.value);
    console.log(password.value);

    var email_input = document.getElementsByName("jointeam_email_input_register");
    var password_input = document.getElementsByName("jointeam_password_input_register");

    displayRegisterError(errorMessage);

  });
  return false;
}

function displayLoginError(error_msg){
  empty_error_message($('#jointeam_email_input_error_alert_login'));
  $('#jointeam_email_input_error_alert_login').append(error_msg);
  $('#jointeam_email_input_error_alert_login').css("display", "block");
}

function displayRegisterError(error_msg){
  empty_error_message($('#jointeam_email_input_error_alert_register'));
  $('#jointeam_email_input_error_alert_register').append(error_msg);
  $('#jointeam_email_input_error_alert_register').css("display", "block");
}


function firebaseRedirect() {

  if (window.location.href.indexOf('#') != -1) {
    close();
  }
  firebase.auth().getRedirectResult().then(function (result) {
    if (result.credential) {
      console.log("redirect");
      console.log("got credential");
      // _teamId = '-KL1QXqFWsC1Jbb-HXsJ';
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      var user = result.user;
      var pId = result.user.uid;
      console.log(user);

      insertIntoPlayerTable(user);
      insertIntoTeamsTable(user);

    } else {
      console.log("show");
    }

  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}


function $_GET(param) {
  var vars = {};
  window.location.href.replace(location.hash, '').replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function (m, key, value) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );

  if (param) {
    return vars[param] ? vars[param] : null;
  }
  return vars;
}


//some event

function empty_error_message(selector) {
  selector.empty();
  selector.css("display", "none");

}

function refreshForm(){
  $('#jointeam_email_input_error_alert_login').empty();
  $('#jointeam_email_input_error_alert_login').css("display", "none");

  $('#jointeam_email_input_error_alert_register').empty();
  $('#jointeam_email_input_error_alert_register').css("display","none");

}

//some firebase apis
function onDefaultTeamChanged() {
  window.location = "https://stk-soccer.firebaseapp.com/";
}

function getTeamRef(id) {
  return firebase.database().ref("teams/" + id);
}

function getTeamRefBasicInfo(id){
  return firebase.database().ref("teams/" + id +"/basic-info");
}

function getTeamRefPlayer(id){
  return firebase.database().ref("teams/" + id + "/players");
}

function getPlayerTeamsRef(pId, tId) {
  return firebase.database().ref("players/" + pId + "/teams/" + tId);
}

function getTeamPlayersRef(tId, pId) {
  return firebase.database().ref("teams/" + tId + "/players/" + pId);
}

function getPlayerRef(id) {
  return firebase.database().ref("players/" + id);
}


//backup

// teamRef.set({
//   'basic-info':{'captain':'OqliCkGF8aeMeGOIBQNr5vJBHKU2','logo':'https://firebasestorage.googleapis.com/v0/b/stk-soccer.appspot.com/o/images%2F-KL1a8zTfCXDapavsN_L.jpg?alt=media&token=57a99f56-8f61-4888-84d4-551ca9171ae1','name':'Jixiang test'},
//   'detail-info':{'founder': 'OqliCkGF8aeMeGOIBQNr5vJBHKU2'},
//   'members':{'OqliCkGF8aeMeGOIBQNr5vJBHKU2':{'goals':0,'number':10}}});





function insertIntoPlayerTable(user){

  var userId = user.uid;
  var playerData = {};
  var updates = {};
  var playerRef = getPlayerRef(userId);
  playerData['basic-info'] = { 'displayName': user.email, 'photoURL': user.photoURL, 'teamId': _teamId};
  var playerTeamIdObj = {};
  playerTeamIdObj[_teamId] = "true";
  playerData['teams']= playerTeamIdObj;
  try {
    updates[userId] = playerData;
    // don't use set(updates) here
    playerRef.update(updates).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var  errorMessage = error.message;
      // ...
      throw errorMessage;
    });
    console.log(userId, updates, playerData);
  } catch (e) {
    alert(e);
    return;
  }
}

function insertIntoTeamsTable(user){

  var userId = user.uid;
  //Add team
  try {
    var teamRef_basic_info = getTeamRefBasicInfo(_teamId);
    var teamRef_players = getTeamRefPlayer(_teamId);
    var updates_basic_info = {};
    var updates_players = {};

    //update total players

    teamRef_players.on('value', function (snapshot) {
      console.log(snapshot.val());
      var players = snapshot.val();
      var size = Object.keys(players).length;
      console.log(size);
      if (!(userId in players)){
        updates_basic_info['totalPlayers'] = size + 1;
      }else{
        updates_basic_info['totalPlayers'] = size ;
      }
      updates_players[userId] = {'goals': 0, 'number': 0};
      teamRef_basic_info.update(updates_basic_info).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        throw errorMessage;
      });

      teamRef_players.update(updates_players).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        throw errorMessage;
      });


    });
    console.log(userId);
  } catch (e) {
    alert(e);
    return;
  }
}

function onTestNewFeature(){

  var teamPlayerRef = getTeamRefPlayer(_teamId);
  teamPlayerRef.on('value', function (snapshot) {
    console.log(snapshot.val());
    var players = snapshot.val();
    var size = Object.keys(players).length;
    console.log(size);
  });
}
