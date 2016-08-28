/*
* File: jquery.flexisel.js
* Version: 1.0.0
* Description: Responsive carousel jQuery plugin
* Author: 9bit Studios
* Copyright 2012, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/
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

function handleServiceError (error) {
    var text = error + (error.request ? ' - ' + error.request.status : '');
    alert(text);
}

function onLoad() {
    try {
        //Invalid URL
        if (window.location.href.indexOf('#') != -1)
            return;

        var config = {
            apiKey: "AIzaSyA9L3ja5ZcViqTc5Tgz8tG6QvJGlYO-fa4",
            authDomain: "stk-soccer.firebaseapp.com",
            databaseURL: "https://stk-soccer.firebaseio.com",
            storageBucket: "stk-soccer.appspot.com",
        };
        firebase.initializeApp(config);

        _teamId = $_GET('teamId');

        auth = firebase.auth();
        auth.getRedirectResult().then(function (result) {
            if (result.user) {
                console.log('redirect');
                console.log(result);
                var pId = result.user.uid;
                var teamPlayersRef = getTeamPlayersRef(_teamId, pId);
                teamPlayersRef.set(true, function (error) {
                    if (error)
                        handleServiceError(error);
                    else {
                        var playerTeamsRef = getPlayerTeamsRef(pId, _teamId);
                        playerTeamsRef.set(true, function (error) {
                            if (error)
                                handleServiceError(error);
                            else
                                onDefaultTeamChanged();
                        });
                    }
                });
                //set currentteam
                getPlayerRef(pId).child('currentTeamId').set(_teamId);
            } else {
                console.log('show');
                document.getElementById('txt_jointeamsuccess').style.display = 'none';
                document.getElementById('div_content').style.display = 'block';
                ko.applyBindings(_appModel);

                var teamRef = getTeamRef(_teamId);
                teamRef.once("value").then(function (team) {
                    _appModel.logo(team.child("logo").val());
                    _appModel.teamName(team.child("name").val());
                });

            }
        }, handleServiceError);
    }
    catch (e) {
        alert(e);
    }
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

function onFbLogin() {
    var provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithRedirect(provider);
    // You can add additional scopes to the provider:
    // Sign in with redirect:
    //auth.signInWithPopup(provider).then(function (result) {
    //    console.log(result);
    //    var pId = result.user.uid;
    //    var teamPlayersRef = getTeamPlayersRef(_teamId, pId);
    //    teamPlayersRef.set(true, function (error) {
    //        if (error)
    //            handleServiceError(error);
    //        else {
    //            var playerTeamsRef = getPlayerTeamsRef(pId, _teamId);
    //            playerTeamsRef.set(true, function (error) {
    //                if (error) 
    //                    handleServiceError(error);
    //                else
    //                    onDefaultTeamChanged();
    //            });
    //        }
    //    })
    //}, handleServiceError);
}