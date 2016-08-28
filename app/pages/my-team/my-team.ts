import {Component} from '@angular/core';
import {NavController, ModalController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {EditTeamPage} from '../edit-team/edit-team';
import {FirebaseManager} from "../../providers/firebase-manager";

@Component({
  templateUrl: 'build/pages/my-team/my-team.html'
})
export class MyTeamPage {

  //currentUser:any;
  tId: any;
  team: any;
  teamCaptain: any;
  teamAvatar:any;



  //af
  afTeam: FirebaseObjectObservable<any>;
  afTeamCaptain: FirebaseObjectObservable<any>;

  afTeamDetail:FirebaseObjectObservable<any>;


  constructor(private nav: NavController,
    private modalController: ModalController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager) {
    // this.currentTeam = this.am.getCurrentTeamSnapshot();
    this.tId = this.navParams.get('tId') || this.am.getCurrentPlayerSnapshot().teamId;
    this.afTeam = this.am.afGetTeam(this.tId);

    var teamLogoURL = "";
    //getCaptainAFObject
    this.afTeam.subscribe(snapshot => {
          this.team = snapshot;
          var captainId= snapshot.captain;
          teamLogoURL = snapshot.logo;
          console.log(teamLogoURL);
          this.afTeamCaptain = this.am.afGetPlayerById(captainId);
          this.afTeamCaptain.subscribe(playerSnapshot => {
            this.teamCaptain = playerSnapshot;
          });
    });
    // this.afTeamCaptain = this.am.afGetTeamCaptain(this.afTeam.)
    console.log("123");
    console.log(this.afTeam);
    console.log("456");
    var teamAvatarImg = this.getTeamAvatar(this.teamAvatar);
    console.log(teamAvatarImg.width);

    this.afTeamDetail = this.fm.getTeamDetail(this.tId);

  }

  editTeam() {
    this.nav.push(EditTeamPage,
      {
        tId: this.tId
      }
    );
  }

  getTeamAvatar(src){
    var image = new Image();
    image.src = src
    return image;
  }
}
