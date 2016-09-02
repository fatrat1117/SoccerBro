import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {FirebaseManager} from "../../providers/firebase-manager";
import {ManagePlayerPage} from '../manage-player/manage-player';

@Component({
  templateUrl: 'build/pages/my-player/my-player.html'
})
export class MyPlayerPage {
  pId: any;
  //af
  afBasic: any;
  afDetail: any;
  afPublic: any;

  constructor(private nav: NavController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager) {
    this.pId = this.navParams.get('pId');
    this.afBasic = this.fm.getPlayerBasic(this.pId);
    this.afDetail = this.fm.getPlayerDetail(this.pId);
    this.afPublic = this.fm.getPlayerPublic(this.pId);
    // this.afTeam = this.am.afGetTeam(this.tId);

    // var teamLogoURL = "";
    // //getCaptainAFObject
    // this.afTeam.subscribe(snapshot => {
    //       this.team = snapshot;
    //       var captainId= snapshot.captain;
    //       teamLogoURL = snapshot.logo;
    //       console.log(teamLogoURL);
    //       this.afTeamCaptain = this.am.afGetPlayerById(captainId);
    //       this.afTeamCaptain.subscribe(playerSnapshot => {
    //         this.teamCaptain = playerSnapshot;
    //       });
    // });
    // // this.afTeamCaptain = this.am.afGetTeamCaptain(this.afTeam.)
    // console.log("123");
    // console.log(this.afTeam);
    // console.log("456");
    // var teamAvatarImg = this.getTeamAvatar(this.teamAvatar);
    // console.log(teamAvatarImg.width);

    // this.afTeamDetail = this.fm.getTeamDetail(this.tId);
    // this.afTeamPublic = this.fm.getTeamPublic(this.tId);

    // let sub = this.afTeamPublic.subscribe(snapshot => {
    //   sub.unsubscribe();
    //   this.afTeamPublic.update({popularity: snapshot.popularity + 1});
    // });

    // var number;
    // this.afTeamPlayers = this.fm.getPlayers(this.tId);
    // let subPlayer = this.afTeamPlayers.subscribe(snapshot => {
    //     console.log(this.tId);
    //     this.teamPlayersNumber = snapshot.length;
    //     this.teamPlayers = snapshot;
    // });

    //console.log(this.teamPlayersNumber);



  }

  // editTeam() {
  //   this.nav.push(EditTeamPage,
  //     {
  //       tId: this.tId
  //     }
  //   );
  // }

  // getTeamAvatar(src){
  //   var image = new Image();
  //   image.src = src
  //   return image;
  // }

  // goManagePlayerPage() {
  //   this.nav.push(ManagePlayerPage, {tId: this.tId});
  // }
}
