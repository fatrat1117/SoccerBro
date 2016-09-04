import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import{StandingsPage}from '../standings/standings';
import {FirebaseManager} from '../../providers/firebase-manager';
import {Subject} from 'rxjs/Subject';
import {PlayerBasicPipe, playerDetailPipe} from '../../pipes/player-basic.pipe';

@Component({
  templateUrl: 'build/pages/stats/stats.html',
  pipes: [PlayerBasicPipe, playerDetailPipe]
})
export class StatsPage {
  stats: string = "team";
  afPlayers: any;

  constructor(private navCtrl: NavController,
  private fm: FirebaseManager) {
    //const subject = new Subject();
    this.afPlayers = fm.getPublicPlayers('popularity');
    
    //console.log(this.afPlayers);
    
    //subject.next('popularity');
    //this.afPlayers.subscribe(data => console.log(data));
  }

  enterStandings(){
    this.navCtrl.push(StandingsPage);
  }
}
