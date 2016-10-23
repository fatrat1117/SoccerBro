import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseManager } from '../../providers/firebase-manager';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';
import { Subject } from 'rxjs/Subject';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import { ScheduleMatchPage } from '../schedule-match/schedule-match';
import * as moment from 'moment';
import { MatchesPageTemplate } from '../matches/matches-template';

@Component({
  templateUrl: 'build/pages/league-stats/league-stats.html',
  pipes: [StringToDatePipe, NumberToTimePipe, TeamBasicPipe],
  directives: [MatchesPageTemplate]
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
  tournamentId: any;

  constructor(private nav: NavController,
    private fm: FirebaseManager,
    private navParams: NavParams,
    private modalController: ModalController) {
    this.tournamentId = this.navParams.get('tournamentId');
    let self = this;
    fm.getTournamentTableList(this.tournamentId).subscribe(tables => {
      console.log('getTournamentTable', tables);
        self.standings = tables;
      })

    this.standings = [
      {
        Rank: "1",
        Logo: "<ion-icon name='ios-football'></ion-icon>",
        Team: "Chelsea",
        GP: "38",
        W: "26",
        D: "9",
        L: "3",
        GF: "73",
        GA: "32",
        GD: "41",
        PTS: "87",
      },
      {
        Rank: "2",
        Logo: "<ion-icon name='ios-football'></ion-icon>",
        Team: "Man. City",
        GP: "38",
        W: "26",
        D: "9",
        L: "3",
        GF: "73",
        GA: "32",
        GD: "41",
        PTS: "87",
      },
      {
        Rank: "3",
        Logo: "<ion-icon name='ios-football'></ion-icon>",
        Team: "Arsenal",
        GP: "38",
        W: "26",
        D: "9",
        L: "3",
        GF: "73",
        GA: "32",
        GD: "41",
        PTS: "87",
      },
    ];
    // this.standings = [
    //   {
    //     Rank:"1",
    //     Logo:"<ion-icon name='ios-football'></ion-icon>",
    //     Team: "Chelsea",
    //     GP:"38",
    //     W:"26",
    //     D:"9",
    //     L:"3",
    //     GF:"73",
    //     GA:"32",
    //     GD:"41",
    //     PTS:"87",
    //   },
    //   {
    //     Rank:"2",
    //     Logo:"<ion-icon name='ios-football'></ion-icon>",
    //     Team: "Man. City",
    //     GP:"38",
    //     W:"26",
    //     D:"9",
    //     L:"3",
    //     GF:"73",
    //     GA:"32",
    //     GD:"41",
    //     PTS:"87",
    //   },
    //   {
    //     Rank:"3",
    //     Logo:"<ion-icon name='ios-football'></ion-icon>",
    //     Team: "Arsenal",
    //     GP:"38",
    //     W:"26",
    //     D:"9",
    //     L:"3",
    //     GF:"73",
    //     GA:"32",
    //     GD:"41",
    //     PTS:"87",
    //   },
    // ];

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

    console.log(this.tournamentId);

    this.afMatchesBytournamentId = fm.getMatchesByTournamentId(this.tournamentId);

    this.afMatchesBytournamentId.subscribe(matches => {
      console.log(matches);
      matches.forEach(match => {
        console.log(match.date);
      });
    });





    // for (let tournament in this.afMatchesBytournamentId){
    //   console.log("Matches",tournament);
    // }

    //console.log('byIdMatcheList', this.afMatchesBytournamentId);
    console.log('today', this.today);
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
    // if (this.datesColorArray.length > 0){
    //   this.datesColorArray[0] = "#2E9008";
    // }
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
}
