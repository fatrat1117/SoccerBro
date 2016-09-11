/**
 * Created by jixiang on 4/9/16.
 */


window.onload = function() {

  console.log("program start");
  initApp();
  firebaseRedirect();

};

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

function onEmailLogin(){
  var email = document.forms["jointeam_email_login_form"]["jointeam_email_input"].value;
  var password = document.forms["jointeam_email_login_form"]["jointeam_password_input"].value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){

      firebase.auth().signInWithEmailAndPassword(email,password).then(function(credential){

        console.log(credential);
        console.log(result.uid);
        console.log(credential.uid);
        var userId = credential.uid;
        if (userId) {

          var playerData = {};
          var updates = {};
          playerData['basic-info'] = {'displayName': result.email};
          try {
            updates = {};
            updates[userId] = playerData;
            // don't use set(updates) here
            firebase.database().ref("players/"+userId).update(updates).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // ...
              throw errorMessage;
            });
            console.log(userId,updates,playerData);

            alert(email+"!, SoccerBro 欢迎你！");
            //window.location.href = "success.html";
          }catch(e){
            alert(e);
          }

        }
      },function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });


    },function(error){
      var errorCode = error.code;
      var errorMessage = error.message;


        console.log(errorCode);
        console.log(email);
        console.log(password);

        var email_input = document.getElementsByName("jointeam_email_input");
        var password_input = document.getElementsByName("jointeam_password_input");

        empty_error_message();
        $('#jointeam_email_input_error_alert').append(errorMessage);
        $('#jointeam_email_input_error_alert').css("display","block");

    });
  return false;
}




function firebaseRedirect(){

  if (window.location.href.indexOf('#') != -1){
    close();
  }
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      console.log("redirect");
      console.log("got credential");
      _teamId = '-KL1QXqFWsC1Jbb-HXsJ';
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      var user = result.user;
      var pId = result.user.uid;
      console.log(user);

      var playerData = {};
      //var playerPublicData = {};
      playerData['basic-info'] = {'displayName': user.displayName, 'photoURL': user.photoURL , 'teamId':_teamId};
      //playerPublicData = {'name':user.displayName, 'popularity':0}
      playerData['teams'] = {_teamId:true};
      //Add userInfo into teams table
      //Add userInfo into players table
      var teamRef = getTeamRef(_teamId);
      var updates = {};
      updates['/players/' + pId] = {'goals':0,'number':11};
      teamRef.update(updates);
      console.log(pId);

      //Add new user into players table and public table
      try {
        var playersUpdates = {};
        //var publicUpdates = {};
        playersUpdates[pId] = playerData;
        //publicUpdates[pId] = playerPublicData;
        // don't use set(updates) here
        firebase.database().ref("players/").update(playersUpdates);
        //firebase.database().ref("public/players/").update(publicUpdates);
        console.log(pId);
        alert(user.displayName+"!, SoccerBro 欢迎你！");
        window.location.href = "success.html";
      }catch(e){
        alert(e);
      }


    }else{
      console.log("show");
    }

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

function empty_error_message(){
  $('#jointeam_email_input_error_alert').empty();
  $('#jointeam_email_input_error_alert').css("display","none");

}

function refreshForm(){
  empty_error_message();
}

//some firebase apis
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
  return firebase.database().ref("teams/" + tId + "/members/" + pId);
}

function getPlayerRef(id) {
  return firebase.database().ref("players/" + id);
}



//backup

// teamRef.set({
//   'basic-info':{'captain':'OqliCkGF8aeMeGOIBQNr5vJBHKU2','logo':'https://firebasestorage.googleapis.com/v0/b/stk-soccer.appspot.com/o/images%2F-KL1a8zTfCXDapavsN_L.jpg?alt=media&token=57a99f56-8f61-4888-84d4-551ca9171ae1','name':'Jixiang test'},
//   'detail-info':{'founder': 'OqliCkGF8aeMeGOIBQNr5vJBHKU2'},
//   'members':{'OqliCkGF8aeMeGOIBQNr5vJBHKU2':{'goals':0,'number':10}}});
