import { Component, Input} from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { transPipe, Localization } from '../../providers/localization'
import { ScheduleMatchPage } from '../schedule-match/schedule-match';
import { FirebaseManager } from '../../providers/firebase-manager';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';
import { Subject } from 'rxjs/Subject';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import * as moment from 'moment';
//
// import {MatchesPageHeader} from '../matches/matches-header';
import {MatchesPageContent} from '../matches/matches-content';

@Component({
  templateUrl: 'build/pages/matches/matches.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe],
  directives: [MatchesPageContent]
})

export class MatchesPage {
  afWhitelist;
  currTeamId;
  pId;
  constructor(private modalController: ModalController,
  private fm : FirebaseManager) {
    this.currTeamId = fm.selfTeamId;
    this.pId = fm.selfId;
    if (fm.selfId)
      this.afWhitelist = fm.getTournamentsAdmin(fm.selfId);
  }

   showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }

  export() {
    this.fm.exportMatchesData();
  }
}
