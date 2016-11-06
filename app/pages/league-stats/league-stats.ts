import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseManager } from '../../providers/firebase-manager';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';
import { Subject } from 'rxjs/Subject';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import { ScheduleMatchPage } from '../schedule-match/schedule-match';
import * as moment from 'moment';
import { MatchesPageContent } from '../matches/matches-content';

@Component({
  templateUrl: 'build/pages/league-stats/league-stats.html',
  pipes: [StringToDatePipe, NumberToTimePipe, TeamBasicPipe],
  directives: [MatchesPageContent]
})

export class LeagueStatsPage {
  standings: any;
  goals: any[];
  leagueStats: string = "standings";
  dates: any;
  datesColorArray: any;
  currentSelectedDateIndex = 0;
  afMatches: any;
  afMatchesBytournamentId: any;
  dateSubject = new Subject();
  today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
  tournamentId : any;
  afTournamentInfo: any;
  tournamentDescription: any;
  afWhitelist: any;

  constructor(private nav: NavController,
    private fm: FirebaseManager,
    private navParams: NavParams,
    private modalController: ModalController) {
    this.tournamentId = this.navParams.get('tournamentId');
    console.log('tournamentId', this.tournamentId);
    let self = this;
    fm.getTournamentTableList(this.tournamentId).subscribe(tables => {
      console.log('getTournamentTable', tables);
        self.standings = tables;
      });

    this.goals = [
      {
        Name: "Tianyi",
        Team: "Everpioneer FC",
        Goals: "90"
      },
    ];

    fm.getMatchDates().subscribe(dates => {
      self.dates = dates;
      self.initialDatesColorArray(self.dates);
      //console.log(dates);
      setTimeout(function () {
        console.log('show today', self.today);
        self.dateSubject.next(self.today);
      }, 1000);
    });

    this.afMatches = fm.queryMatches(this.dateSubject);
    this.afMatchesBytournamentId = fm.getMatchesByTournamentId(this.tournamentId);
    this.afTournamentInfo = fm.getTournamentInfo(this.tournamentId);
    this.afTournamentInfo.subscribe(info => {
      if (info.description)
        this.tournamentDescription = info.description;
    })

    this.afWhitelist = fm.getTournamentAdmin(this.tournamentId);
  }

  testClick() {
    console.log("I clicked the standing cell");
  }

  // showMatches(date: string) {
  //     console.log('showMatches', date);
  //     this.dateSubject.next(Number(date));
  // }

  addTournamentMatch() {
    this.modalController.create(ScheduleMatchPage, { tournamentId: this.tournamentId }).present();
  }

  compute() {
    this.fm.computeTournamentTable(this.tournamentId);
  }

  showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }

  showMatches(date: string, i: number) {
    console.log('currentSelectedDate', date);
    console.log('lastSelectedDate', this.dates[this.currentSelectedDateIndex].$key);

    if (this.dates[this.currentSelectedDateIndex].$key === date) {
      return;
    }
    this.dateSubject.next(Number(date));
    this.setDatesColorArray(i);
    this.currentSelectedDateIndex = i;
  }

  popupUpdateSchedulePage(matchId) {
    this.modalController.create(ScheduleMatchPage, {
      mId: matchId
    }).present();
  }

  initialDatesColorArray(dates: any) {
    this.datesColorArray = new Array(dates.length);

    for (var i = 0; i < this.datesColorArray.length; i++) {
      if (this.dates[i].$key === this.today) {
        this.datesColorArray[i] = "#2E9008";
        this.currentSelectedDateIndex = i;
      }
      this.datesColorArray[i] = "none";
    }
  }

  setDatesColorArray(index: number) {
    for (var i = 0; i < this.datesColorArray.length; i++) {
      if (index === i) {
        this.datesColorArray[i] = "#2E9008";
      } else {
        this.datesColorArray[i] = "none";
      }
    }
  }

  getDateTabBGColor(date: string) {
    for (let i in this.dates) {
      if (this.dates[i] === date) {
        return this.datesColorArray[i];
      }
    }
    return;
  }

  remove() {
    this.fm.removeTournament(this.tournamentId);
    this.nav.pop();
  }

  updateTournamentInfo() {
    this.afTournamentInfo.update({description: this.tournamentDescription});
  }
 }
