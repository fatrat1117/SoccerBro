import { Component} from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ScheduleMatchPage } from '../schedule-match/schedule-match';


@Component({
  selector: 'matches-header',
  templateUrl: 'build/pages/matches/matches-header.html'
})

export class MatchesPageHeader {

  constructor(
              private modalController: ModalController,
            ) {
  }
  showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }
}
