import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager'; 
/*
  Generated class for the LeagueStatsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/league-stats/league-stats.html',
})
export class LeagueStatsPage {
  standings: any[];
  leagueStats : string = "standings";
  dates: any;
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
  }

  testClick(){
    console.log("I clicked the standing cell");
  }

}
