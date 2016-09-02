import {Component} from '@angular/core';
import {NavController, ModalController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {EditTeamPage} from '../edit-team/edit-team';
import {FirebaseManager} from "../../providers/firebase-manager";
import {ManagePlayerPage} from '../manage-player/manage-player';

@Component({
  templateUrl: 'build/pages/my-player/my-player.html'
})
export class MyPlayerPage {
  pId: any;
  team: any;
  teamCaptain: any;
  teamAvatar:any;
  teamPlayers:any;
  teamPlayersNumber:any;



  //af
  afTeam: FirebaseObjectObservable<any>;
  afTeamCaptain: FirebaseObjectObservable<any>;

  afTeamDetail:FirebaseObjectObservable<any>;
  afTeamPublic:FirebaseObjectObservable<any>;
  afTeamPlayers:FirebaseListObservable<any>;


  constructor(private nav: NavController,
    private modalController: ModalController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager) {
    // this.currentTeam = this.am.getCurrentTeamSnapshot();
    this.pId = this.navParams.get('pId');
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
