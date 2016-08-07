import {Modal, NavController, Page} from 'ionic-angular';
import { Injectable} from '@angular/core';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods, FirebaseListObservable
} from 'angularfire2';
import {LoginPage} from '../pages/login/login'

declare let firebase: any;

@Injectable()
export class AccountManager {
  currentUser: any;
  teams: FirebaseListObservable<any>;

  constructor(public af: AngularFire) {
    let self = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.currentUser = self.getFbUser();
        console.log("User is signed in", self.currentUser);
      } else {
        console.log("logout");
        self.currentUser = null;
      }
    });

    this.teams = this.af.database.list('/teams');
  }

  getFbUser() {
    //console.log(firebase.auth());
    let currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    if (currentUser) {
      let user = {
        uid: currentUser.uid,
        type: 'facebook'
      }
      return user;
    }
    return null;
  }


  getUser() {
    return this.getFbUser();
  }

  displayLoginModal(nav) {
    let loginPage = Modal.create(LoginPage);
    nav.present(loginPage);
  }

  checkLogin(nav) {
    let user = this.currentUser;
    console.log(user);
    if (!user) {
      this.displayLoginModal(nav);
    }
  }

  logout() {
    this.af.auth.logout();
  }

  //player
  getPlayerRef(id) {
    return "/players/" + id;
  }

  getCurrentPlayerRef() {
    return this.getPlayerRef(this.currentUser.uid);
  }

  getTeamsOfPlayerRef(pId, tId) {
    return "/teamsOfPlayer/" + pId + '/' + tId;
  }
  //Team
  getTeamRef(id) {
    return "/teams/" + id;
  }

  getPlayersOfTeamRef(pId, tId) {
    return "/playersOfTeam/" + tId + '/' + pId;
  }

  createTeam(teamObj, success, error) {
    console.log("createTeam", teamObj);
    const queryObservable = this.af.database.list('/teams', {
      query: {
        orderByChild: 'name',
        equalTo: teamObj.name
      }
    });

    let subscription = queryObservable.subscribe(queriedItems => {
      console.log("check team name", queriedItems);
      //stopping monitoring changes
      subscription.unsubscribe();
      if (0 === queriedItems.length) {
        let teamData = {
          name: teamObj.name,
          location: teamObj.location,
          founder: this.currentUser.uid,
          captain: this.currentUser.uid,
          logo: 'https://firebasestorage.googleapis.com/v0/b/stk-soccer.appspot.com/o/teamDefault.png?alt=media&token=6d669a7b-8a91-4d1e-9bc9-6be456a7505c'
        };

        const promise = this.teams.push(teamData);
        promise
          .then(newTeam => {
            let newTeamId = newTeam["key"];
            console.log('create team success', newTeamId);
            //update teams list of player
            let teamsOfPlayer = this.af.database.object(this.getTeamsOfPlayerRef(this.currentUser.uid, newTeamId));
            const promiseTP = teamsOfPlayer.set(true);
            promiseTP.then(_ => {
              //update players list of team
              let playersOfTeam = this.af.database.object(this.getPlayersOfTeamRef(this.currentUser.uid, newTeamId));
              const promisePT = playersOfTeam.set(true);
              promisePT.then(_ => {
                if (teamObj.isDefault) {
                  let player = this.af.database.object(this.getCurrentPlayerRef());
                  player.update({ currentTeamId: newTeamId });
                }
                success();
              }).catch(err => error(err));
            }).catch(err => error(err));
          }).catch(err => error(err));
      } else {
        error("Team exists");
      }
    });
  }

  switchTeam(tId, success, error) {
      let player = this.af.database.object(this.getCurrentPlayerRef());
      player.update({currentTeamId: tId})
      .then(_ => success())
      .catch(err => error(err));;
  }
}
