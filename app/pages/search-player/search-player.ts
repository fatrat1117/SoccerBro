import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseManager } from '../../providers/firebase-manager';
import { MyPlayerPage } from '../my-player/my-player';
import { transPipe } from '../../providers/localization'


@Component({
  templateUrl: 'build/pages/search-player/search-player.html',
  pipes: [transPipe]
})
export class SearchPlayerPage {
  showDetail: boolean;
  teamId: string;
  totalPlayers: any[];
  filteredPlayers: any[];
  showClose: boolean;
  constructor(private nav: NavController, private navParams: NavParams, private fm: FirebaseManager, private viewCtrl: ViewController) {
    this.teamId = this.navParams.get('teamId');
    this.showDetail = this.navParams.get('showDetail');
    this.showClose = this.navParams.get('showClose');
    this.totalPlayers = [];

    // firebase
    let subscription = this.fm.getTeamPlayers(this.teamId).subscribe(snapshots => {
      setTimeout(() => {
        subscription.unsubscribe();
        snapshots.forEach(snapshot => {
          let player: any = {};
          this.fm.getPlayerBasic(snapshot.$key).subscribe(s => {
            player.id = snapshot.$key;
            player.displayName = s.displayName;
            player.photoURL = s.photoURL;
          });
          this.totalPlayers.push(player);
        });
        this.resetFilter();
      }, 250);
    });
  }

  resetFilter() {
    this.filteredPlayers = this.totalPlayers.slice();
  }

  trackByName(player) {
    return player.id;
  }

  filterPlayers(ev: any) {
    // Reset items back to all of the items
    this.resetFilter();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredPlayers = this.filteredPlayers.filter((player) => {
        return (player.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  selectPlayer(id: string) {
    if (this.showDetail === true)
      this.nav.push(MyPlayerPage, { pId: id });
    else
      this.viewCtrl.dismiss({ playerId: id });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
