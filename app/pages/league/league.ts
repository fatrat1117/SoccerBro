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
  templateUrl: 'build/pages/league/league.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})
export class LeaguePage {

  dates: any;
  afMatches: any;
  dateSubject = new Subject();
  today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;

  constructor(private navCtrl: NavController, 
  local: Localization, 
  private modalController: ModalController,
  fm: FirebaseManager) {
fm.getMatchDates().subscribe(dates=> {
      this.dates = dates;
      console.log(dates)});
    this.afMatches = fm.queryMatches(this.dateSubject);
    console.log('today', this.today);
  }


  showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }

  showMatches(date: string) {
      console.log('showMatches', date);
      this.dateSubject.next(Number(date));
  }
}
