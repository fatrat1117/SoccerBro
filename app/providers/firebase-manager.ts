import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare let firebase: any;

@Injectable()
export class FirebaseManager {
  constructor(private af: AngularFire) {
  }

  /********** All Get Operations ***********/

  // player info
  getPlayerBasic(id: string) {
    return this.af.database.object(`/players/${id}/basic-info`);
  }
  getPlayerDetail(id: string) {
    return this.af.database.object(`/players/${id}/detail-info`);
  }

  // team info
  getTeamBasic(id: string) {
    return this.af.database.object(`/teams/${id}/basic-info`);
  }
  getTeamDetail(id: string) {
    return this.af.database.object(`/teams/${id}/detail-info`);
  }

  // player: notifications
  getMatchNotifications() {
    return this.af.database.list(`/players/{PLAYER_ID}/match-notifications`, {
      query: { orderByChild: 'time' }
    });
  }

  // team: chatroom
  getChatMessages() {
    return this.af.database.list(`/teams/{TEAM_ID}/chatroom`);
  }



  /********** All Add Operations ***********/

  // player: match notification
  addMatchNotification(playerId: string, notificationKey:string, notification: any) {
    this.af.database.object(`/players/${playerId}/match-notifications/${notificationKey}`).set(notification);
  }

  // team: new match
  addNewMatch(match: any) {
    this.af.database.list(`/teams/{TEAM_ID}/matches`).push(match);
  }

  // team: new chat message
  addNewChatMessage(message: any) {
    this.af.database.list(`/teams/{TEAM_ID}/chatroom`).push(message);
  }

}