import {Component} from '@angular/core';
import {NavController, ModalController, NavParams, Button} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {FirebaseManager} from "../../providers/firebase-manager";
import {ManagePlayerPage} from '../manage-player/manage-player';
import {EditPlayerPage} from '../edit-player/edit-player';
import {ManageTeamPage} from '../manage-team/manage-team';
import {CreateTeamPage} from '../create-team/create-team';
import {EditTeamPage} from '../edit-team/edit-team';
import {SearchPlayerPage} from '../search-player/search-player';
import {NewMatchPage} from '../new-match/new-match';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import { Clipboard } from 'ionic-native';
import globals = require('../../providers/globals');
import {transPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';

@Component({
  templateUrl: 'build/pages/my-team/my-team.html',
  pipes: [TeamBasicPipe, PlayerBasicPipe, transPipe]
})
export class MyTeamPage {

  //currentUser:any;
  pId: any;
  tId: any;
  team: any;
  //teamCaptain: any;
  teamAvatar: any;
  teamPlayers: any;
  teamPlayersNumber: any;

  //af
  afTeam: FirebaseObjectObservable<any>;
  //afTeamCaptain: FirebaseObjectObservable<any>;

  afTeamDetail: FirebaseObjectObservable<any>;
  afTeamPublic: FirebaseObjectObservable<any>;
  //afTeamPlayers:FirebaseListObservable<any>;

  // floating menu
  isTeamPlayer: any;
  isOpen: boolean;

  constructor(private nav: NavController, private modalController: ModalController,
    private am: AccountManager, private navParams: NavParams,
    private fm: FirebaseManager, private local: Localization) {
    this.pId = this.fm.selfId;
    this.tId = this.navParams.get('tId') || this.am.getCurrentPlayerSnapshot().teamId;
    this.afTeam = this.am.afGetTeam(this.tId);
    this.afTeam.subscribe(snapshot => {
      this.team = snapshot;
    });

    this.afTeamDetail = this.fm.getTeamDetail(this.tId);
    this.afTeamPublic = this.fm.getTeamPublic(this.tId);
    this.fm.increasePopularity(this.afTeamPublic);

    // floating menu
    this.isTeamPlayer = this.fm.isTeamPlayer(this.pId, this.tId);
    this.isOpen = false;
  }

  getTeamAvatar(src) {
    var image = new Image();
    image.src = src
    return image;
  }

  goManagePlayerPage() {
    this.nav.push(ManagePlayerPage, { tId: this.tId });
  }

  invitePlayer() {
    //console.log('invite player', teamName);

    if (this.team.name) {
      let link = this.am.getCurrentPlayerSnapshot().displayName +
        ' ' + 'invite you to join' + ' ' +
        this.team.name +
        '\n' +
        'https://' + globals.firebaseConfig.authDomain + '/index.html?teamId=' + this.tId;

      if (1 === globals.prod) {
        link += '&prod=1';
      }

      Clipboard.copy(link);
      
      alert(this.local.getString('InviteMsg'))
    }
  }


  searchPlayers() {
    this.nav.push(SearchPlayerPage, { teamId: this.tId, showDetail: true });
  }

  showMenu() {
    this.isOpen = !this.isOpen;
  }

  editTeam() {
    this.modalController.create(EditTeamPage).present();
  }

  addNewMatch() {
    this.modalController.create(NewMatchPage).present();
  }
}
