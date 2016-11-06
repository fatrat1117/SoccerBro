import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {transPipe, Localization} from '../../providers/localization'
import {ScheduleMatchPage} from '../schedule-match/schedule-match';
import {FirebaseManager} from '../../providers/firebase-manager';
import {StringToDatePipe, NumberToTimePipe} from '../../pipes/moment.pipe';
import {Subject} from 'rxjs/Subject';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {LeagueStatsPage} from '../league-stats/league-stats';
import {CreateTournamentPage} from '../create-tournament/create-tournament';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/league/league.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})
export class LeaguePage {
  afTournaments : any;
  afWhitelist: any;

  constructor(private navCtrl: NavController,
    private local: Localization,
    private fm: FirebaseManager,
    private mc: ModalController) {

    let  self = this;
    this.afTournaments = fm.getTournamentList();
    if (fm.selfId)
      this.afWhitelist = fm.getTournamentsAdmin(fm.selfId);
  }

  addTournament() {
    let modal = this.mc.create(CreateTournamentPage);
    modal.present();
  }

  goTournament(id) {
    this.navCtrl.push(LeagueStatsPage, {tournamentId: id});
  }
}
