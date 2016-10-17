import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {transPipe, Localization} from '../../providers/localization'
import {ScheduleMatchPage} from '../schedule-match/schedule-match';
import {FirebaseManager} from '../../providers/firebase-manager';
import {StringToDatePipe, NumberToTimePipe} from '../../pipes/moment.pipe';
import {Subject} from 'rxjs/Subject';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {LeagueStatsPage} from '../league-stats/league-stats';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/league/league.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})
export class LeaguePage {
  afTournaments : any;

  constructor(private navCtrl: NavController,
    private local: Localization,
    private fm: FirebaseManager) {

    let  self = this;
    // fm.getMatchDates().subscribe(dates => {
    //   self.dates = dates;
    //   //console.log(dates);
    //   setTimeout(function() {
    //     console.log('show today', self.today);
    //     self.dateSubject.next(self.today);
    //   }, 1000);
    // });
    // this.afMatches = fm.queryMatches(this.dateSubject);
  }

  addTournament() {
    //this.fm.addTournament({name: })
  }

  goTournament(id) {
    this.navCtrl.push(LeagueStatsPage, {tournamentId: id});
  }
}
