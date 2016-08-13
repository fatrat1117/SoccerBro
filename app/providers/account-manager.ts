import {Modal, NavController, Page} from 'ionic-angular';
import { Injectable} from '@angular/core';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods, FirebaseListObservable, FirebaseObjectObservable
} from 'angularfire2';
import {LoginPage} from '../pages/login/login'

declare let firebase: any;

@Injectable()
export class AccountManager {
  currentUser: any;
  afTeams: FirebaseListObservable<any>;
  afCurrPlayer: FirebaseObjectObservable<any>;
  afCurrTeam: FirebaseObjectObservable<any>;
  afTeamsOfCurrPlayer: FirebaseListObservable<any>;
  afCurrentTeamId: FirebaseObjectObservable<any>;
  currPlayer: any;
  currTeam: any;
  teamsOfCurrPlayer: any;
  subscriptions: any;

  constructor(public af: AngularFire) {
    this.afTeams = this.af.database.list('/teams');
    this.teamsOfCurrPlayer = [];
    this.subscriptions = [];
  }

  //getter
  getCurrentPlayerSnapshot() {
    return this.currPlayer;
  }

  getCurrentTeamSnapshot() {
    return this.currTeam;
  }

  getTeamsOfCurrentPlayerSnapshot() {
    return this.teamsOfCurrPlayer;
  }

  initialize(user, success, error) {
    //if user is logged in first time, save default photo and name.
    let self = this;
    this.currentUser = this.getFbUser();
    this.afCurrPlayer = this.afGetCurrentPlayer();
    let sub = this.afCurrPlayer.subscribe(currPlayerData => {
      console.log("current player changed", currPlayerData);
      //player exists
      if (currPlayerData.displayName) {
        self.currPlayer = currPlayerData;
        success();
      }
      else {
        console.log("first time login");
        //todo
        self.afCurrPlayer.update({
          photoURL: user.photoURL,
          displayName: user.displayName
        }).catch(err => error(err));
      }

      //get current team
      if (currPlayerData.currentTeamId) {
        self.afCurrentTeamId = self.afGetCurrentTeamId();
        let sub1 = self.afCurrentTeamId.subscribe(_ => {
          self.afCurrTeam = self.afGetTeam(currPlayerData.currentTeamId);
          let sub2 = self.afCurrTeam.subscribe(currTeamData => {
            console.log("current team changed", currTeamData);
            self.currTeam = currTeamData;
          });
          self.subscriptions.push(sub2);
        });
        self.subscriptions.push(sub1);
      }
    });
    self.subscriptions.push(sub);


    //teams of current player 
    this.afTeamsOfCurrPlayer = this.afGetTeamsOfPlayer(user.uid);
    let sub3 = this.afTeamsOfCurrPlayer.subscribe(teamIds => {
      console.log("team of current player change ids", teamIds);
      self.teamsOfCurrPlayer = [];
      self.teamsOfCurrPlayer.length = teamIds.length;
      for (let i = 0; i < teamIds.length; ++i) {
        let tId = teamIds[i].$key;
        let afTeam = self.afGetTeam(tId);
        //console.log(tId, afTeam);
        let sub4 = afTeam.subscribe(teamSnapshot => {
          console.log("team snapshot changed", teamSnapshot);
          self.teamsOfCurrPlayer[i] = teamSnapshot;
          //console.log("teams snapshot changed", self.teamsOfCurrPlayer);
        });
        self.subscriptions.push(sub4);
      }
    });
    self.subscriptions.push(sub3);
  }

  uninitialize() {
    //must unsubscribe
    for (let i = 0; i < this.subscriptions.length; ++i) {
      this.subscriptions[i].unsubscribe();
    }
    this.subscriptions = [];
    this.afCurrPlayer = null;
    this.afCurrTeam = null;
    this.currentUser = null;
    this.currTeam = null;
    this.currPlayer = null;
    this.afTeamsOfCurrPlayer = null;
    this.afCurrentTeamId = null;
  }

  getFbUser() {
    let currentUser = firebase.auth().currentUser;
    //console.log(currentUser);
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
  afGetCurrentPlayer() {
    return this.af.database.object(this.getCurrentPlayerRef());
  }

  afGetTeamsOfPlayer(pId) {
    return this.af.database.list(this.getAllTeamsOfPlayerRef(pId));
  }

  afGetCurrentTeamId() {
    return this.af.database.object(this.getCurrentPlayerRef() + '/' + 'currentTeamId');
  }

  getPlayerRef(id) {
    return "/players/" + id;
  }

  getCurrentPlayerRef() {
    return this.getPlayerRef(this.currentUser.uid);
  }

  getAllTeamsOfPlayerRef(pId) {
    return "/teamsOfPlayer/" + pId;
  }

  getTeamsOfPlayerRef(pId, tId) {
    return "/teamsOfPlayer/" + pId + '/' + tId;
  }
  //Team
  afGetTeam(tId) {
    return this.af.database.object(this.getTeamRef(tId));
  }
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

        const promise = this.afTeams.push(teamData);
        promise
          .then(newTeam => {
            console.log('create team success', newTeam);
            let newTeamId = newTeam["key"];
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
    let player = this.afGetCurrentPlayer();
    player.update({ currentTeamId: tId })
      .then(_ => success())
      .catch(err => error(err));;
  }

  isDefaultTeam(tId) {
    return tId == this.currPlayer.currentTeamId;
  }
}
