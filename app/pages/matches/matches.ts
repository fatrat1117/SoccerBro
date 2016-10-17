import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {transPipe, Localization} from '../../providers/localization'
import {ScheduleMatchPage} from '../schedule-match/schedule-match';
import {FirebaseManager} from '../../providers/firebase-manager';
import {StringToDatePipe, NumberToTimePipe} from '../../pipes/moment.pipe';
import {Subject} from 'rxjs/Subject';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/matches/matches.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})
export class MatchesPage {

  dates: any;
  afMatches: any;
  dateSubject = new Subject();
  today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;

  constructor(private navCtrl: NavController,
    local: Localization,
    private modalController: ModalController,
    fm: FirebaseManager) {

    let  self = this;
    fm.getMatchDates().subscribe(dates => {
      self.dates = dates;
      //console.log(dates);
      setTimeout(function() {
        console.log('show today', self.today);
        self.dateSubject.next(self.today);
      }, 1000);
    });
    this.afMatches = fm.queryMatches(this.dateSubject);
  }


  showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }

  showMatches(date: string) {
    console.log('showMatches', date);
    this.dateSubject.next(Number(date));
  }

  popupUpdateSchedulePage(matchId) {
    this.modalController.create(ScheduleMatchPage, {
      mId: matchId
    }).present();
  } 
}
