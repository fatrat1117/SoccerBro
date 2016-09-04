/**
 * Created by jixiang on 4/9/16.
 */


window.onload = function() {

  console.log("program start");
  initApp();

  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;
    console.log(result);
    console.log(user);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...


  });
};

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


var _teamId;
var auth;
var _appModel = {
  teamName: ko.observable(''),
  logo: ko.observable('')
}

function initApp(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8",
    authDomain: "project-3416565325366537224.firebaseapp.com",
    databaseURL: "https://project-3416565325366537224.firebaseio.com",
    storageBucket: "project-3416565325366537224.appspot.com",
  };
  firebase.initializeApp(config);
}

function onFbLogin() {


  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);

}

  function onDefaultTeamChanged() {
    window.location = "https://stk-soccer.firebaseapp.com/";
  }

  function getTeamRef(id) {
    return firebase.database().ref("teams/" + id);
  }

  function getPlayerTeamsRef(pId, tId) {
    return firebase.database().ref("players/" + pId + "/teams/" + tId);
  }

  function getTeamPlayersRef(tId, pId) {
    return firebase.database().ref("teams/" + tId + "/players/" + pId);
  }

  function getPlayerRef (id) {
    return firebase.database().ref("players/" + id);
  }



