import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {MyPlayerPage} from '../my-player/my-player';


@Component({
  templateUrl: 'build/pages/search-player/search-player.html',
})
export class SearchPlayerPage {
  teamId: string;
  totalPlayers: any[];
  filteredPlayers: any[];
  constructor(private nav: NavController, private navParams: NavParams, private fm: FirebaseManager) {
    this.teamId = this.navParams.get('teamId'); 
    this.totalPlayers = [];

    // firebase
    let subscription = this.fm.getTeamMembers(this.teamId).subscribe(snapshots => {
      console.log("snapshots: " + snapshots);
      
      subscription.unsubscribe();
      snapshots.forEach(snapshot => {
        let player: any = {};
        let subs = this.fm.getPlayerBasic(snapshot.$key).subscribe(s => {
          player.id = snapshot.$key;
          player.displayName = s.displayName;
          player.photoURL = s.photoURL;
        });
        this.totalPlayers.push(player);
      });
      this.resetFilter();
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

  showPlayerPage(id: string) {
    this.nav.push(MyPlayerPage, { pId: id });
  }
}
