import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare let firebase: any;

@Injectable()
export class FirebaseManager {
  constructor(private af: AngularFire) {
  }

  /********** All Get Operations ***********/

  /***** Player *****/

  /** Get basic player info by player id */
  getPlayerBasic(playerId: string) {
    return this.af.database.object(`/players/${playerId}/basic-info`);
  }

  /** Get detail player info by player id */
  getPlayerDetail(playerId: string) {
    return this.af.database.object(`/players/${playerId}/detail-info`);
  }

  /** Get all notifications of current player */
  getSelfMatchNotifications() {
    return this.af.database.list(`/players/{PLAYER_ID}/match-notifications`, {
      query: { orderByChild: 'time' }
    });
  }

  
  /***** Team *****/

  /** Get basic team info by team id */
  getTeamBasic(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/basic-info`);
  }

  /** Get detail team info by team id */
  getTeamDetail(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/detail-info`);
  }

  /** Get all chat room messages of current team */
  getSelfChatMessages() {
    return this.af.database.list(`/teams/{TEAM_ID}/chatroom`);
  }

  /** Get all players of current team */
  getSelfPlayers() {
    return this.af.database.list(`/teams/{TEAM_ID}/members`);
  }





  /********** All Add Operations ***********/

  /***** Player *****/

  /** Add a new match notification by player id. 
   *  The match id is the key after you add a new match to current team. 
   */
  addMatchNotification(playerId: string, matchID: string, notification: any) {
    this.af.database.object(`/players/${playerId}/match-notifications/${matchID}`).set(notification);
  }


  /***** Team *****/

  /** Add a new match to current team */
  addSelfMatch(match: any) {
    this.af.database.list(`/teams/{TEAM_ID}/matches`).push(match);
  }

  /** Add a new chat message to current team */
  addSelfChatMessage(message: any) {
    this.af.database.list(`/teams/{TEAM_ID}/chatroom`).push(message);
  }





  /********** All Set Operations ***********/

  /***** Player *****/

  /** Set current player's current team */
  setSelfCurrentTeam(teamId: string) {
    this.af.database.object(`/players/{PLAYER_ID}`).set({ teamId: teamId });
  }



  

  /***** Team *****/

  /** Set a new member to current team.
   *  The key should be the same as the new member's player id.
   */
  addSelfMember(playerId: string, memberInfo: any) {
    this.af.database.object(`/teams/{TEAM_ID}/members/${playerId}}`).set(memberInfo);
  }


}