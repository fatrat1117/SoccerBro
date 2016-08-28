import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare let firebase: any;

@Injectable()
export class FirebaseManager {
  selfId : string;
  selfTeamId: string;

  constructor(private af: AngularFire) {
  }

  /********** All Players Operations ***********/
  getPlayerBasic(playerId: string) {
    return this.af.database.object(`/players/${playerId}/basic-info`);
  }

  getPlayerDetail(playerId: string) {
    return this.af.database.object(`/players/${playerId}/detail-info`);
  }

  getSelfMatchNotifications() {
    return this.af.database.list(`/players/${this.selfId}/match-notifications`, {
      query: { orderByChild: 'time' }
    });
  }

  getSelfTeams() {
    return this.af.database.list(`/players/${this.selfId}/teams`)
  }

  addMatchNotification(playerId: string, matchID: string, notification: any) {
    this.af.database.object(`/players/${playerId}/match-notifications/${matchID}`).set(notification);
  }

  updateDefaultTeam(teamId: string) {
    this.af.database.object(`/players/${this.selfId}`).set({ teamId: teamId });
  }

  setSelfCurrentTeam(teamId: string) {
    this.af.database.object(`/players/${this.selfId}/teams/${this.selfTeamId}`).update('false');
    this.af.database.object(`/players/${this.selfId}/teams/${teamId}`).update('true');
    this.af.database.object(`/players/${this.selfId}/basic-info/teamId`).update(teamId);
  }





  /********** All Teams Operations ***********/
  getTeam (teamId: string) {
    return this.af.database.object(`/teams/${teamId}`);
  }

  getTeamBasic(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/basic-info`);
  }

  getTeamDetail(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/detail-info`);
  }

  getSelfChatMessages(teamId: string) {
    return this.af.database.list(`/teams/${teamId}/chatroom`);
  }
  
  getPlayers(teamId: string) {
    return this.af.database.list(`/teams/${teamId}/members`);
  }

  addSelfMatch(match: any) {
    this.af.database.list(`/teams/${this.selfTeamId}/matches`).push(match);
  }

  addSelfChatMessage(teamId: string, message: string) {
    /*
    this.saveItems.push({
      content: this.newMessage,
      created_at: firebase.database.ServerValue.TIMESTAMP,
      created_by: 'Lei Zeng',
      creator_id: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      creator_img: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c137.42.527.527/s50x50/564861_2507790311879_276618826_n.jpg?oh=00e78ee4def9be67f27037883729c6fb&oe=580B5051',
    });
    */

    this.af.database.list(`/teams/${teamId}/chatroom`).push({
      content: message,
      createAt: firebase.database.ServerValue.TIMESTAMP,
      createBy: this.selfId
    });
  }

  addSelfMember(playerId: string, memberInfo: any) {
    this.af.database.object(`/teams/${this.selfTeamId}/members/${playerId}}`).set(memberInfo);
  }

  deleteTeam(tId, success, error) {
    this.getTeam(tId).remove().then(_ => {
      this.getTeamPublic(tId).remove().then(_ => {
        success();
      }).catch(err => error(err));
    }).catch(err => error(err));
  }


 


  /********** All Public Operations ***********/
  getPlayerPublic(playerId: string) {
    return this.af.database.object(`public/players/${playerId}`);
  }

  getTeamPublic(teamId: string) {
    return this.af.database.object(`public/teams/${teamId}`);
  }

  getPublicTeams() {
    return this.af.database.list(`/public/teams/`, {
      query: { orderByChild: 'name' }
    });
  }
}