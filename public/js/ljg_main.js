/**
 * Created by jixiang on 4/9/16.
 */

var _teamId;
var _teamIdValid = false;

var _teamInfoModel = {
  url: ko.observable(""),
  name: ko.observable("")
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

window.onload = function () {
  console.log("program start");
  _teamId = $_GET("teamId");
  console.log('join team', _teamId)
  initApp();
  firebaseRedirect();
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

function firebaseRedirect() {

  // if (window.location.href.indexOf('#') != -1) {
  //   close();
  // }
  firebase.auth().getRedirectResult().then(function (result) {
    if (result.credential) {
      var user = result.user;
      console.log('redirect', user);

      //Add player
      //Add team
      updateFirebase(user).then(function(result){
        //alert(user.email + "!, SoccerBro 欢迎你！");
        //window.location.href = "success.html";
      },function(error){
        var errorMessage = error.message;
        alert(errorMessage);
      });

    } else {
      console.log("show");
      if (_teamId != null) {
        teamIdValidation();
      } else {
        console.log("Error: teamId is null");
      }
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


function onEmailLogin() {

  if (_teamIdValid == false) {
    alert("teamId is not valid, please resend the request!");
    return;
  }
  // var email = document.forms["jointeam_email_login_form"]["jointeam_email_input_login"].value;
  // var password = document.forms["jointeam_email_login_form"]["jointeam_password_input_login"].value;
  var email = document.getElementById("Username");
  var password = document.getElementById("Password");

  console.log(email.value);
  console.log(password.value);

  firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(function (credential) {

    console.log(credential);
    console.log(credential.uid);
    var userId = credential.uid;
    if (userId) {
      //Add player
      insertIntoPlayerTable(credential);
      //Add team
      insertIntoTeamsTable(credential);
      //alert(email.value + "!, SoccerBro 欢迎你！");
      //window.location.href = "success.html";

    }
  }, function (error) {
    var errorMessage = error.message;
    alert(errorMessage);
    displayLoginError(errorMessage);
  });
  return false;

}

function onEmailRegister() {

  if (_teamIdValid == false) {
    alert("teamId is not valid, please resend the request!");
    return;
  }
  // var email = document.forms["jointeam_email_register_form"]["jointeam_email_input_register"];
  // var password = document.forms["jointeam_email_register_form"]["jointeam_password_input_register"];
  var email = document.getElementById("Username");
  var password = document.getElementById("Password");

  firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function (result) {

    firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(function (credential) {

      console.log(credential);
      console.log(result.uid);
      console.log(credential.uid);
      var userId = credential.uid;
      if (userId) {

        //Add player
        //Add team
        updateFirebase(credential).then(function(result){
        },function(error){
          var errorMessage = error.message;
          alert(errorMessage);
        });
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

    displayLoginError(errorMessage);

  });
  return false;
}


function displayLoginError(error_msg) {
  empty_error_message($('#jointeam_email_input_error_alert_login'));
  $('#jointeam_email_input_error_alert_login').append(error_msg);
  $('#jointeam_email_input_error_alert_login').css("display", "block");
}

//some event

function empty_error_message(selector) {
  selector.empty();
  selector.css("display", "none");

}

function refreshForm() {
  $('#jointeam_email_input_error_alert_login').empty();
  $('#jointeam_email_input_error_alert_login').css("display", "none");
}


function getTeamRef(id) {
  return firebase.database().ref("teams/" + id);
}

function getTeamRefBasicInfo(id) {
  return firebase.database().ref("teams/" + id + "/basic-info");
}

function getTeamRefPlayer(id) {
  return firebase.database().ref("teams/" + id + "/players");
}

function getPlayerRefBasicInfo(id){
  return firebase.database().ref("players/" + id + "/basic-info");
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


function getTeamPlayerSize() {
  var teamPlayerRef = getTeamRefPlayer(_teamId);
  teamPlayerRef.on('value', function (snapshot) {
    console.log(snapshot.val());
    var players = snapshot.val();
    var size = Object.keys(players).length;
    console.log(size);
  });
}

function handleServiceError(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  throw errorMessage;
}

function updateFirebase(credential){
  //Add player
  insertIntoPlayerTable(credential);
  //Add team
  insertIntoTeamsTable(credential);
}

function insertIntoPlayerTable(user) {
  var userId = user.uid;
  //var playerData = {};
  //var updates = {};
  var playerTeamsRef = getPlayerTeamsRef(userId, _teamId);
  console.log('update player teams', userId, playerTeamsRef);
  //playerData['basic-info'] = { 'displayName': user.email, 'photoURL': user.photoURL, 'teamId': _teamId };
  //var playerTeamIdObj = {};
  //playerTeamIdObj[_teamId] = "true";
  //playerData['teams'] = playerTeamIdObj;
  try {
    //updates[_teamId] = true;
    // don't use set(updates) here
    playerTeamsRef.set(true, function (error) {
      if (error)
        handleServiceError(error);
      else{
        onDefaultTeamChanged(user);
      }

    });
  } catch (e) {
    alert(e);
  }
}



//some firebase apis
function onDefaultTeamChanged(user) {

  var userId = user.uid;
  var playerBasicInfoRef = getPlayerRefBasicInfo(userId);
  var playerData = {};
  playerData['teamId'] = _teamId;

  try{
    playerBasicInfoRef.update(playerData , function (error) {

      console.log(error);
      if (error){
        handleServiceError(error);
      }
    })
  } catch (e) {
    alert(e);
  }


}

function insertIntoTeamsTable(user) {
  var userId = user.uid;
  //Add team
  try {
    var teamPlayersRef = getTeamPlayersRef(_teamId, userId);
    teamPlayersRef.once('value', function (snapshot) {
      if (snapshot.val()) {
       alert('user already joined');
      }
      else {
        teamPlayersRef.update({isMember: true},function(error) {
          if (error) {
            console.log("Error updating data:", error);
          }else{
            updateTotalPlayers();
          }
        });

      }
    });
  } catch (e) {
    alert(e);
  }
}

function onTestNewFeature() {

  var teamPlayerRef = getTeamRefPlayer(_teamId);
  teamPlayerRef.on('value', function (snapshot) {
    console.log(snapshot.val());
    var players = snapshot.val();
    var size = Object.keys(players).length;
    console.log(size);
  });
}

function updateTotalPlayers() {
  //update total players
  var teamRef_basic_info = getTeamRefBasicInfo(_teamId);
  var teamRef_players = getTeamRefPlayer(_teamId);
  var updates_basic_info = {};
  var updates_players = {};

  try{
    teamRef_players.once('value', function (snapshot) {
      console.log(snapshot.val());
      var players = snapshot.val();
      var size = Object.keys(players).length;

      updates_basic_info['totalPlayers'] = size;
      //updates_players[userId] = { 'goals': 0, 'number': 0 };
      console.log(size, updates_basic_info, teamRef_basic_info);
      teamRef_basic_info.update(updates_basic_info, function (error) {
        // Handle Errors here.

        console.log(error);
        if (error)
          handleServiceError(error);
        else
          goDownloadPage();
      });
    });
  }catch(e){
    alert(e);
  }

  //console.log(userId);
}

function goDownloadPage() {
  window.location.href = "success.html";
}

function onTestNewFeature() {

  var teamPlayerRef = getTeamRefPlayer(_teamId);
  teamPlayerRef.on('value', function (snapshot) {
    console.log(snapshot.val());
    var players = snapshot.val();
    var size = Object.keys(players).length;
    console.log(size);
  });
}
