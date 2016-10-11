import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager'; 
import {StringToDatePipe, NumberToTimePipe} from '../../pipes/moment.pipe';
import {Subject} from 'rxjs/Subject';

@Component({
  templateUrl: 'build/pages/league-stats/league-stats.html',
  pipes: [StringToDatePipe, NumberToTimePipe]
})

export class LeagueStatsPage {
  standings: any[];
  leagueStats : string = "standings";
  dates: any;
  afMatches: any;
  dateSubject = new Subject();

  constructor(private nav: NavController,
  private fm: FirebaseManager) {
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

    fm.getMatchDates().subscribe(dates=> {
      this.dates = dates;
      console.log(dates)});
    this.afMatches = fm.queryMatches(this.dateSubject);
  }

  testClick(){
    console.log("I clicked the standing cell");
  }

  showMatches(date: string) {
      console.log('showMatches', date);
      this.dateSubject.next(Number(date));
  }
}
