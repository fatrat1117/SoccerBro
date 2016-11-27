import {Component} from '@angular/core';
import {NavController, ModalController, ViewController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {transPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';
import {SearchTeamPage} from '../search-team/search-team';

@Component({
  templateUrl: 'build/pages/guide/guide.html',
  pipes: [transPipe]
})
export class GuidePage {

  constructor(private fm : FirebaseManager, 
  private nav : NavController, 
  private local: Localization, 
  private modalCtrl: ModalController,
  private viewCtrl: ViewController) {
    
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

  close() {
    this.viewCtrl.dismiss();
  }
}
