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


@Component({
  templateUrl: 'build/pages/my-team/my-team.html',
  pipes: [TeamBasicPipe, PlayerBasicPipe]
})
export class MyTeamPage {

  //currentUser:any;
  pId: any;
  tId: any;
  team: any;
  teamCaptain: any;
  teamAvatar: any;
  teamPlayers: any;
  teamPlayersNumber: any;

  //af
  afTeam: FirebaseObjectObservable<any>;
  afTeamCaptain: FirebaseObjectObservable<any>;

  afTeamDetail: FirebaseObjectObservable<any>;
  afTeamPublic: FirebaseObjectObservable<any>;
  //afTeamPlayers:FirebaseListObservable<any>;

  // floating menu
  isTeamPlayer: any;
  isOpen: boolean;

  constructor(private nav: NavController,
    private modalController: ModalController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager) {
    // this.currentTeam = this.am.getCurrentTeamSnapshot();
    this.pId = this.fm.selfId;
    this.tId = this.navParams.get('tId') || this.am.getCurrentPlayerSnapshot().teamId;
    this.afTeam = this.am.afGetTeam(this.tId);

    var teamLogoURL = "";
    //getCaptainAFObject
    this.afTeam.subscribe(snapshot => {
      this.team = snapshot;
      var captainId = snapshot.captain;
      teamLogoURL = snapshot.logo;
      console.log(teamLogoURL);
      this.afTeamCaptain = this.am.afGetPlayerById(captainId);
      this.afTeamCaptain.subscribe(playerSnapshot => {
        this.teamCaptain = playerSnapshot;
      });
    });

    this.afTeamDetail = this.fm.getTeamDetail(this.tId);
    this.afTeamPublic = this.fm.getTeamPublic(this.tId);
    this.fm.increasePopularity(this.afTeamPublic);
    // var number;
    // let afTeamPlayers = this.fm.getPlayers(this.tId);
    // let subPlayer = afTeamPlayers.subscribe(snapshot => {
    //   console.log(this.tId);
    //   this.teamPlayersNumber = snapshot.length;
    //   this.teamPlayers = snapshot;
    // });

    //console.log(this.teamPlayersNumber);

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
