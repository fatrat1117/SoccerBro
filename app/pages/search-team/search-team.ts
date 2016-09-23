import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';


@Component({
  templateUrl: 'build/pages/search-team/search-team.html'
})
export class SearchTeamPage {
  totalTeams: any[];
  filteredTeams: any[];
  constructor(private viewCtrl: ViewController, private fm: FirebaseManager) {
    this.totalTeams = [];

    // firebase
    let subscription = this.fm.getPublicTeams().subscribe(snapshots => {
      subscription.unsubscribe();
      snapshots.forEach(snapshot => {
        let team: any = {};
        let subs = this.fm.getTeamBasic(snapshot.$key).subscribe(s => {
          team.id = snapshot.$key;
          team.name = s.name;
          team.logo = s.logo;
        });
        this.totalTeams.push(team);
      });
      this.resetFilter();
    });


    /*
        // firebase
        let teamItems = af.database.list('/teams', {
          query: { orderByChild: 'name' }
        });
        let subscription = teamItems.subscribe(snapshots => {
          subscription.unsubscribe();
          snapshots.forEach(snapshot => {
            let team: any = {};
            
            team.id = snapshot.$key;
            team.name = snapshot.name;
            team.logo = snapshot.logo;
            this.totalTeams.push(team);
          });
          this.resetFilter();
        });
    */

  }

  resetFilter() {
    this.filteredTeams = this.totalTeams.slice();
  }

  trackByName(team) {
    return team.id;
  }

  filterTeams(ev: any) {
    // Reset items back to all of the items
    this.resetFilter();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredTeams = this.filteredTeams.filter((team) => {
        return (team.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  dismiss(team: any) {
    this.viewCtrl.dismiss({ team: team });
  }
}
