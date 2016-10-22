import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager'; 
import {StringToDatePipe, NumberToTimePipe} from '../../pipes/moment.pipe';
import {Subject} from 'rxjs/Subject';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {ScheduleMatchPage} from '../schedule-match/schedule-match';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/league-stats/league-stats.html',
  pipes: [StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})

export class LeagueStatsPage {
  standings: any[];
  goals: any[];
  leagueStats : string = "standings";
  dates: any;
  afMatches: any;
  dateSubject = new Subject();
  today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
  tournamentId : any;

  constructor(private nav: NavController,
  private fm: FirebaseManager,
  private navParams: NavParams,
  private modalController: ModalController) {
    this.tournamentId = this.navParams.get('tournamentId');

    this.standings = [
      {
        Rank:"1",
        Logo:"<ion-icon name='ios-football'></ion-icon>",
        Team: "Chelsea",
        GP:"38",
        W:"26",
        D:"9",
        L:"3",
        GF:"73",
        GA:"32",
        GD:"41",
        PTS:"87",
      },
      {
        Rank:"2",
        Logo:"<ion-icon name='ios-football'></ion-icon>",
        Team: "Man. City",
        GP:"38",
        W:"26",
        D:"9",
        L:"3",
        GF:"73",
        GA:"32",
        GD:"41",
        PTS:"87",
      },
      {
        Rank:"3",
        Logo:"<ion-icon name='ios-football'></ion-icon>",
        Team: "Arsenal",
        GP:"38",
        W:"26",
        D:"9",
        L:"3",
        GF:"73",
        GA:"32",
        GD:"41",
        PTS:"87",
      },
    ];

    this.goals = [
      {
        Name: "Tianyi",
        Team: "Everpioneer FC",
        Goals: "90"
      },
    ];

    fm.getMatchDates().subscribe(dates=> {
      this.dates = dates;
      console.log(dates)});
    this.afMatches = fm.queryMatches(this.dateSubject);
    console.log('today', this.today);
  }

  testClick(){
    console.log("I clicked the standing cell");
  }

  showMatches(date: string) {
      console.log('showMatches', date);
      this.dateSubject.next(Number(date));
  }

  addTournamentMatch() {
    this.modalController.create(ScheduleMatchPage, {tournamentId: this.tournamentId}).present();
  }

  compute() {
    this.fm.computeTournamentTable(this.tournamentId);
  }
}
