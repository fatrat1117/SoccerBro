import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {AccountManager} from '../../providers/account-manager';
import {Subject} from 'rxjs/Subject';
import {PlayerBasicPipe, PlayerDetailPipe, ReverseAndCountPlayerPipe} from '../../pipes/player-basic.pipe';
import {TeamBasicPipe, ReverseAndCountTeamPipe} from '../../pipes/team-basic.pipe';
import {MyPlayerPage} from '../my-player/my-player';
import {MyTeamPage} from '../my-team/my-team';
import {transPipe} from '../../providers/localization'
import {LeagueStatsPage} from '../league-stats/league-stats';

@Component({
  templateUrl: 'build/pages/stats/stats.html',
  pipes: [PlayerBasicPipe, PlayerDetailPipe, ReverseAndCountPlayerPipe, ReverseAndCountTeamPipe, TeamBasicPipe, transPipe]
})
export class StatsPage {
  stats: string = "teams";
  afPlayers: any;
  afTeams: any;
  //maxPlayer = 20;
  //maxTeam = 20;
  playerSize = new Subject();
  teamSize = new Subject();
  teamData = { enableScroll: true, maxTeam: 20 };
  playerData = { enableScroll: true, maxPlayer: 20 };

  constructor(private nav: NavController,
  private fm: FirebaseManager,
  private am: AccountManager) {
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
    this.am.presentLoading(4000, false);

    setTimeout(() => {
      this.teamSize.next(this.teamData.maxTeam);
    }, 500);
  }

  updatePlayerSize() {
    this.am.presentLoading(3000, false);

    setTimeout(() => {
      this.playerSize.next(this.playerData.maxPlayer);
    }, 500);
  }

  goPlayerPage(id) {
    this.nav.push(MyPlayerPage, { pId: id });
  }

  goTeamPage(id) {
    this.nav.push(MyTeamPage, { tId: id });
  }

  enterStandings() {
    this.nav.push(LeagueStatsPage);
  }

  /*
  swipeTo(name: string) {
    this.stats = name;
  }
  */

  morePlayer(infiniteScroll) {
    console.log('more player available', this.fm.totalPlayers, this.playerData);
    let enable = this.playerData.enableScroll;
    if (enable) {
      //this.afPlayers = this.fm.queryPublicPlayers('popularity', this.maxPlayer + 10);
      //this.maxPlayer += 10;
      this.playerSize.next(this.playerData.maxPlayer);
    }

    setTimeout(() => {
      infiniteScroll.enable(enable);
      infiniteScroll.complete();
    }, 500);
  }

  moreTeam(infiniteScroll) {
    console.log('more team available', this.fm.totalTeams, this.teamData);
    let enable = this.teamData.enableScroll;
    if (enable) {
      //this.afTeams = this.fm.queryPublicTeams('popularity', this.maxTeam + 10);
      //this.maxTeam += 10;
      this.teamSize.next(this.teamData.maxTeam);
    }
    setTimeout(() => {
      infiniteScroll.enable(enable);
      infiniteScroll.complete();
    }, 500);
  }
}
