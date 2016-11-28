import {Component} from '@angular/core';
import {NavController, ModalController, ViewController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {transPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';
import {SearchTeamPage} from '../search-team/search-team';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';

@Component({
  templateUrl: 'build/pages/guide/guide.html',
  pipes: [transPipe, TeamBasicPipe]
})
export class GuidePage {
  teams;
  needNumber = false;
  options = {pager: true};

  constructor(private fm : FirebaseManager, 
  private nav : NavController, 
  private local: Localization, 
  private modalCtrl: ModalController,
  private viewCtrl: ViewController) {
    console.log('Guide poped up');
    
    this.fm.getSelfTeams().subscribe(snapShots => {
      //console.log('getSelfTeams', snapShots);
      this.needNumber = false;
      this.teams = snapShots;
      snapShots.forEach(s => {
        if (true === s.$value) {
            this.needNumber = true;
        }
      })
    });
  }

joinTeam() {
    let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
    searchTeamModal.onDidDismiss(data => {
      console.log('search team result', data);
      if (data) {
        this.fm.joinTeam(data.team.id);
      }
      //this.opponent = data.team;
    });
    searchTeamModal.present();
  }

  UpdateNumber() {
    this.teams.forEach(t => {
      let success = () => {};
      let error = err => {
        alert(err);
      };
      this.fm.validateTeamNumber(t.$key, Number(t.$value), success, error);
    })
    
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
