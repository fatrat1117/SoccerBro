import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {StandingsPage}from '../standings/standings';
import {FirebaseManager} from '../../providers/firebase-manager';
import {Subject} from 'rxjs/Subject';
import {PlayerBasicPipe, PlayerDetailPipe, ReverseAndCountPlayerPipe} from '../../pipes/player-basic.pipe';
import {TeamBasicPipe, ReverseAndCountTeamPipe} from '../../pipes/team-basic.pipe';
import {MyPlayerPage} from '../my-player/my-player';
import {MyTeamPage} from '../my-team/my-team';

@Component({
  templateUrl: 'build/pages/stats/stats.html',
  pipes: [PlayerBasicPipe, PlayerDetailPipe, ReverseAndCountPlayerPipe, ReverseAndCountTeamPipe, TeamBasicPipe]
})
export class StatsPage {
  stats: string = "teams";
  afPlayers: any;
  afTeams: any;
  maxPlayer = 20;
  maxTeam = 20;
  playerSize = new Subject();
  teamSize = new Subject();

  constructor(private nav: NavController, private fm: FirebaseManager) {
    this.afPlayers = fm.queryPublicPlayers('popularity', this.playerSize);
    this.afTeams = fm.queryPublicTeams('popularity', this.teamSize);
    this.updateTeamSize();
  }

  // initialize() {
  //   setTimeout(()=>{
  //     this.playerSize.next(this.maxPlayer);
  //     this.teamSize.next(this.maxTeam);
  //   }, 500);
  // }

  updateTeamSize() {
    setTimeout(() => {
      this.teamSize.next(this.maxTeam);
    }, 500);
  }

  updatePlayerSize() {
    setTimeout(() => {
      this.playerSize.next(this.maxPlayer);
    }, 500);
  }

  goPlayerPage(id) {
    this.nav.push(MyPlayerPage, { pId: id });
  }

  goTeamPage(id) {
    this.nav.push(MyTeamPage, { tId: id });
  }

  enterStandings() {
    this.nav.push(StandingsPage);
  }

  swipeTo(name: string) {
    this.stats = name;
  }

  morePlayer(infiniteScroll) {
    console.log('more player available', this.maxPlayer, this.fm.totalPlayers);
      let enable = this.maxPlayer <= this.fm.totalPlayers;
      if (enable) {
        //this.afPlayers = this.fm.queryPublicPlayers('popularity', this.maxPlayer + 10);
        this.maxPlayer += 10;
        this.playerSize.next(this.maxPlayer);
      }

    setTimeout(() => {
      infiniteScroll.enable(enable);
      infiniteScroll.complete();
    }, 500);
  }

  moreTeam(infiniteScroll) {
    console.log('more team available', this.maxTeam, this.fm.totalTeams);
      let enable = this.maxTeam <= this.fm.totalTeams;
      if (enable) {
        //this.afTeams = this.fm.queryPublicTeams('popularity', this.maxTeam + 10);
        this.maxTeam += 10;
        this.teamSize.next(this.maxTeam);
      }
    setTimeout(() => {
      infiniteScroll.enable(enable);
      infiniteScroll.complete();
    }, 500);
  }
}
