import { ModalController, NavController, Page, ToastController, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Camera } from 'ionic-native';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods, FirebaseListObservable, FirebaseObjectObservable
} from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { MatchRatingPage } from '../pages/match-rating/match-rating';
import { FirebaseManager } from './firebase-manager';
import { Localization } from './localization';
import * as moment from 'moment';

declare let firebase: any;

@Injectable()
export class AccountManager {
  currentUser: any;
  afTeams: FirebaseListObservable<any>;
  afCurrPlayer: FirebaseObjectObservable<any>;
  afCurrTeam: FirebaseObjectObservable<any>;
  afTeamsOfCurrPlayer: FirebaseListObservable<any>;
  currPlayer: any;
  currTeam: any;
  //teamsOfCurrPlayer: any;
  subscriptions: any;
  loading: any;

  constructor(public af: AngularFire,
    private fm: FirebaseManager,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public localization: Localization,
    private popoverCtrl: PopoverController) {
    this.afTeams = this.af.database.list('/teams');
    //this.teamsOfCurrPlayer = [];
    this.subscriptions = [];
  }

  initialize(user, success, error) {
    //if user is logged in first time, save default photo and name.
    let self = this;
    this.currentUser = this.getFbUser();
    this.afCurrPlayer = this.afGetCurrentPlayer();
    this.setupListener(success, error);

    window["plugins"].OneSignal.getIds(ids => {
      self.fm.getPlayerDetail(user.uid).update({ pushId: ids.userId });
      console.log('push ids', ids)
    });

  }

  uninitialize() {
    this.unsubAll();
    this.afCurrPlayer = null;
    this.afCurrTeam = null;
    this.currentUser = null;
    this.currTeam = null;
    this.currPlayer = null;
    this.afTeamsOfCurrPlayer = null;
    this.fm.selfTeamId = "";
    this.fm.selfId = "";
  }

  unsubAll() {
    //must unsubscribe
    for (let i = 0; i < this.subscriptions.length; ++i) {
      this.subscriptions[i].unsubscribe();
    }
    this.subscriptions = [];
  }

  setupListener(success, error) {
    console.log('setupListener');

    let self = this;
    let user = firebase.auth().currentUser;
    //unsub to prevent dupliates
    this.unsubAll();
    let eventFired = false;
    let sub = this.afCurrPlayer.subscribe(currPlayerData => {
      console.log("current player changed", currPlayerData);

      if (currPlayerData) {
        //player exists
        if (currPlayerData.created) {
          self.currPlayer = currPlayerData;
          self.fm.selfTeamId = currPlayerData.teamId;
          self.fm.selfId = user.uid;
          console.log('event fired', eventFired);

          if (false === eventFired) {
            success();
            eventFired = true;
          }
        }
        else {
          console.log("first time login");
          let photoURL = user.photoURL || 'img/none.png';
          let providerData = user.providerData[0]
          if (providerData.providerId.toLowerCase().indexOf('facebook') != -1) {
            photoURL = 'https://graph.facebook.com/' + providerData.uid + '/picture';
          }
          //todo
          self.afCurrPlayer.update({
            photoURL: photoURL,
            displayName: user.displayName || user.email,
            created: true
          }).catch(err =>
            error(err)
            );
          //update player public
          self.fm.getPlayerPublic(user.uid).update({ popularity: 1 });
        }
      }
    });
    self.subscriptions.push(sub);
  }
  //firebase reference
  getRefBasic_Player(pId) {
    return "/players/" + pId + "/basic-info";
  }

  getCurrentPlayerRef() {
    //if (this.currentUser != null) {
    return this.getRefBasic_Player(this.currentUser.uid);
    // } else {
    //   //for testing
    //   let user = {
    //     uid: "4m8MsTy91qN9xZ9vjog09E9xpb22",
    //     type: 'facebook'
    //   }
    //   let player = {
    //     currentTeamId: "-KL1a8zTfCXDapavsN_L",
    //     displayName: "Jixiang Li",
    //     photoURL: "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/1002881_372442569549278_128488338_n.jpg?oh=5af23ad80fd6dc78371a7e3cea019a35&oe=5809CA24",
    //     pushId: "d6fa08ac-412b-4bee-81ab-c08c8d0ffe51",
    //   }
    //   this.currentUser = user;
    //   this.currPlayer = player;
    //   return this.getPlayerBasicRef(this.currentUser.uid);
    // }
  }

  getRefTeams_Player(pId) {
    return "/players/" + pId + "/teams";
  }

  getRefTeam_Player(pId, tId) {
    return this.getRefTeams_Player(pId) + '/' + tId;
  }

  getRefBasic_Team(tId) {
    return "/teams/" + tId + "/basic-info";
  }

  getRefPlayer_Team(pId, tId) {
    return "/teams/" + tId + '/players/' + pId;
  }

  //user
  getFbUser() {
    let currentUser = firebase.auth().currentUser;
    //console.log("get fb user");
    if (currentUser) {
      let user = {
        uid: currentUser.uid,
        type: currentUser.providerId
      }
      return user;
    }
    return null;
  }


  getUser() {
    return this.getFbUser();
  }

  displayLoginModal(modalController) {
    let modal = modalController.create(LoginPage);
    modal.present();
  }

  checkLogin(modalController) {
    let user = this.currentUser;
    console.log("checkLogin", user);
    if (!user) {
      this.displayLoginModal(modalController);
    }
  }

  logout() {
    this.af.auth.logout();
  }

  //player
  afGetCurrentPlayer() {
    return this.fm.getPlayerBasic(this.currentUser.uid);
  }

  afGetTeamsOfPlayer(pId) {
    return this.af.database.list(this.getRefTeams_Player(pId));
  }

  afGetCurrentTeamId() {
    return this.af.database.object(this.getCurrentPlayerRef() + '/' + 'teamId');
  }


  afGetPlayerById(pId) {
    return this.af.database.object(this.getRefBasic_Player(pId));
  }

  afGetTeamOfPlayer(pId, tId) {
    return this.af.database.object(this.getRefTeam_Player(pId, tId));
  }

  //Team
  afGetTeam(tId) {
    return this.fm.getTeamBasic(tId);
  }

  afGetPlayerOfTeam(pId, tId) {
    return this.af.database.object(this.getRefPlayer_Team(pId, tId));
  }

  afGetPlayersOfTeam(tId) {
    return this.af.database.list("/playersOfTeam/" + tId);
  }

  createTeam(teamObj, success, error) {
    let self = this;
    console.log("createTeam", teamObj);
    const queryObservable = this.af.database.list('/public/teams', {
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
          "basic-info":
          {
            name: teamObj.name,
            captain: this.currentUser.uid,
            logo: 'img/none.png',
            totalMatches: 0,
            totalPlayers: 1
          },
          "detail-info": {
            founder: this.currentUser.uid,
            location: teamObj.location
          }
        };

        const promise = this.afTeams.push(teamData);
        promise
          .then(newTeam => {
            console.log('create team success', newTeam);
            let newTeamId = newTeam["key"];
            //update teams list of player
            let teamsOfPlayer = this.afGetTeamOfPlayer(this.currentUser.uid, newTeamId);
            const promiseTP = teamsOfPlayer.set(true);
            promiseTP.then(_ => {
              //update players list of team
              let playersOfTeam = this.afGetPlayerOfTeam(this.currentUser.uid, newTeamId);
              const promisePT = playersOfTeam.set({ isMember: true });
              promisePT.then(_ => {
                if (teamObj.isDefault) {
                  let player = self.fm.getPlayerBasic(self.currentUser.uid);
                  player.update({ teamId: newTeamId });
                }
                //update public
                self.fm.getTeamPublic(newTeamId).update(
                  {
                    name: teamObj.name,
                    popularity: 1
                  });
                //update total
                self.fm.updateTotalPlayers(newTeamId);
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
    console.log('switchTeam to', tId);

    player.update({ teamId: tId })
      .then(_ => success())
      .catch(err => error(err));
  }

  quitTeam(tId, success, error) {
    //let teamSnapshot = this.getTeamOfCurrentPlayerSnapshot(tId);

    let self = this;
    let afTeam = this.fm.getTeamBasic(tId);
    let subTeam = afTeam.subscribe(teamSnapshot => {
      setTimeout(() => {
        subTeam.unsubscribe();
        console.log('quit team', teamSnapshot);
        if (teamSnapshot.captain != this.currentUser.uid) {
          let tOfp = self.afGetTeamOfPlayer(self.currentUser.uid, tId);
          tOfp.remove().then(_ => {
            let pOft = self.afGetPlayerOfTeam(self.currentUser.uid, tId);
            pOft.remove().then(_ => {
              //update total
              self.fm.updateTotalPlayers(tId);
              success();
            }).catch(err => error(err));
          }).catch(err => error(err));
        } else {
          //if is captain. check player count
          let psOft = self.afGetPlayersOfTeam(tId);
          let sub = psOft.subscribe(playersSnapshot => {
            sub.unsubscribe();
            if (playersSnapshot.length > 1) {
              error("captain can not quit");
            } else {
              let tOfp = self.afGetTeamOfPlayer(self.currentUser.uid, tId);
              tOfp.remove().then(_ => {
                psOft.remove().then(_ => {
                  self.fm.deleteTeam(tId, success, error);
                }).catch(err => error(err));
              }).catch(err => error(err));
            }
          });
        }
      }, 500);
    })
  }

  updateTeam(teamObj, success, error) {
    let updateObj = {};
    if (teamObj.logo)
      updateObj["logo"] = teamObj.logo;
    if (teamObj.name && teamObj.name.trim().length > 0) {
      updateObj["name"] = teamObj.name.trim();
      //update public
      this.fm.getTeamPublic(teamObj.tId).update({ name: teamObj.name });
    }

    if (teamObj.captain)
      updateObj["captain"] = teamObj.captain;

    console.log('update team', teamObj, updateObj);

    this.fm.getTeamBasic(teamObj.tId).update(updateObj).then(_ => success()).catch(err => error(err));
    if (teamObj.description)
      this.fm.getTeamDetail(teamObj.tId).update({ description: teamObj.description.trim() });
  }

  isDefaultTeam(tId) {
    return tId == this.currPlayer.teamId;
  }

  //utilities
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  selectImgGetData(success, error) {
    let self = this;
    let options = {
      quality: 75,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 256,
      targetHeight: 256
    };

    Camera.getPicture(options).then(imageData => {
      success(imageData);
    }, (err) => {
      error(err);
    });
  }

  updateImgGetUrl(imageData, imgId, success, error) {
    let self = this;
    let options = {
      quality: 75,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 256,
      targetHeight: 256
    };

    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    let contentType = 'image/jpg';
    let b64Data = imageData;

    let blob = this.b64toBlob(b64Data, contentType, 256);

    let metadata = {
      contentType: 'image/jpeg',
    };
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child('images/' + imgId + '.jpg').put(blob, metadata);;
    uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // See below for more detail
    }, error, function () {
      // Handle successful uploads on complete
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log('upload image done', downloadURL);
      success(downloadURL);
    });
  }

  //snapshot
  getCurrentPlayerSnapshot() {
    return this.currPlayer;
  }

  getCurrentTeamSnapshot() {
    return this.currTeam;
  }

  getTeamsOfPlayerSnapshot(pId, teamsSnapshot) {
    //teams of current player
    let afTeamsOfCurrPlayer = this.afGetTeamsOfPlayer(pId);
    let sub3 = afTeamsOfCurrPlayer.subscribe(teamIds => {
      sub3.unsubscribe();
      console.log("team of current player change ids", teamIds);
      for (let i = 0; i < teamIds.length; ++i) {
        let tId = teamIds[i].$key;
        let ref = firebase.database().ref(this.getRefBasic_Team(tId));
        ref.once('value').then(teamSnapshot => {
          let teamData = teamSnapshot.val();
          if (teamData) {
            teamData.$key = tId;
            teamsSnapshot.push(teamData);
            console.log("team snapshot changed", teamData);
          }
        });
      }
    });
  }

  //push
  postNotification(messageObj, pushIds, success = null, error = null) {
    console.log('push Notification', pushIds);

    let notificationObj = {
      contents: messageObj,
      include_player_ids: pushIds
    };

    window["plugins"].OneSignal.postNotification(notificationObj,
      successResponse => {
        console.log("Notification Post Success:", successResponse);
        if (success)
          success(successResponse);
      },
      failedResponse => {
        console.log("Notification Post Failed: ", failedResponse);
        //alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
        if (error)
          error(failedResponse);
      });
  }

  //misc
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  presentLoading(autoDismissTimeout = 5000, delayPresent = true) {
    if (delayPresent) {
      setTimeout(() => {
        this.createLoading();
      }, 1000);
    } else
      this.createLoading();

    //auto dismiss to prevent dead lock
    setTimeout(() => {
      this.destroyLoading();
    }, autoDismissTimeout);
  }

  dismissLoading() {
    setTimeout(() => {
      this.destroyLoading();
    }, 1000);
  }

  createLoading() {
    if (!this.loading) {
      console.log('presentLoading');
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  destroyLoading() {
    if (this.loading) {
      console.log('dismissLoading');
      this.loading.dismiss();
      this.loading = null;
    }
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: this.localization.getString('SoccerBro'),
      subTitle: msg,
      buttons: [this.localization.getString('OK')]
    });
    alert.present();
  }

  showMatchVip() {
    this.fm.getToVoteInfo().take(1).subscribe(snapshots => {
      if (snapshots.length == 0)
        return;
      // unvoted match
      this.popoverCtrl.create(
        MatchRatingPage,
        { matchDate: snapshots[0].$value, matchId: snapshots[0].$key }).present();
    });


    /*
    this.fm.checkIsVoted(1477929600000, "-KUkNLvBQG1p8H1pntYi").take(1).subscribe(snapshot => {
      if (snapshot.$value == undefined)
        this.popoverCtrl.create(
          MatchRatingPage,
          { matchDate: 1477929600000, matchId: "-KUkNLvBQG1p8H1pntYi" }).present();
    });
    */
    /*
    let popover = this.popoverCtrl.create(
      MatchRatingPage, {matchDate: 1477929600000, matchId: "-KUkNLvBQG1p8H1pntYi"});
    popover.present();
    */
  }


  //time converter
  numberToDateString(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  numberToTimeString(time) {
    return moment(time).format('HH:mm');
  }

  dateTimeStringToNumber(time) {
    return moment(time).unix() * 1000;
  }
}
