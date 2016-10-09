import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the StandingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/standings/standings.html',
})
export class StandingsPage {
  standings: any[];
  leagueStats : string = "standings";
  constructor(private nav: NavController) {
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
  }

  testClick(){
    console.log("I clicked the standing cell");
  }

}
