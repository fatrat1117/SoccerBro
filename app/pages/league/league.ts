import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {transPipe, Localization} from '../../providers/localization'
import {ScheduleMatchPage} from '../schedule-match/schedule-match';

@Component({
  templateUrl: 'build/pages/league/league.html',
  pipes: [transPipe]
})
export class LeaguePage {
  constructor(private navCtrl: NavController, local: Localization, private modalController: ModalController) {

  }


  showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }
}
