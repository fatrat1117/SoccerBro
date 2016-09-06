import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare let firebase: any;

@Injectable()
export class FirebaseManager {
  selfId: string;
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

  updatePlayer(p, success, error) {
    let basic = {};
    if (p.photo)
      basic['photoURL'] = p.photo;
    if (p.name)
      basic['displayName'] = p.name.trim();

    let detail = {};
    if (p.foot)
      detail['foot'] = p.foot;
    if (p.height)
      detail['height'] = p.height;
    if (p.position)
      detail['position'] = p.position;
    if (p.weight)
      detail['weight'] = p.weight;
    if (p.description)
      detail['description'] = p.description.trim();

    console.log('updatePlayer', p, basic, detail);
    this.getPlayerBasic(p.pId).update(basic).then(_ => success()).catch(err => error(err));
    //concurrent update, return success when basic update is done. 
    //trade off: update performance exchange update integrity
    this.getPlayerDetail(p.pId).update(detail);
  }

  getPublicPlayers(subject, limit) {
    return this.af.database.list(`/public/players/`, {
      query: { orderByChild: subject,
        limitToLast: limit }
    });
  }

  getSelfMatchNotifications() {
    return this.af.database.list(`/players/${this.selfId}/match-notifications`, {
      query: { orderByChild: 'time' }
    });
  }

  getSelfTeams() {
    return this.af.database.list(`/players/${this.selfId}/teams`)
  }

  updateDefaultTeam(teamId: string) {
    this.af.database.object(`/players/${this.selfId}`).set({ teamId: teamId });
  }

  setSelfCurrentTeam(teamId: string) {
    this.af.database.object(`/players/${this.selfId}/teams/${this.selfTeamId}`).update('false');
    this.af.database.object(`/players/${this.selfId}/teams/${teamId}`).update('true');
    this.af.database.object(`/players/${this.selfId}/basic-info/teamId`).update(teamId);
  }

  addMatchNotification(playerId: string, matchID: string, notification: any) {
    this.af.database.object(`/players/${playerId}/match-notifications/${matchID}`).set(notification);
  }

  changeNotificationStatus(matchId: string, isRead: boolean) {
    this.af.database.object(`/players/${this.selfId}/match-notifications/${matchId}`).update({
      isRead: isRead
    });
  }

  //common
  increasePopularity(afPublic, success = null) {
    let sub = afPublic.subscribe(snapshot => {
      sub.unsubscribe();
      afPublic.update({ popularity: snapshot.popularity + 1 });
      if (success)
        success(snapshot);
    });
  }

  /********** All Teams Operations ***********/
  getTeam(teamId: string) {
    return this.af.database.object(`/teams/${teamId}`);
  }

  getTeamBasic(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/basic-info`);
  }

  getTeamDetail(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/detail-info`);
  }

  getPlayers(teamId: string) {
    return this.af.database.list(`/teams/${teamId}/members`);
  }

  getSelfChatMessages(teamId: string, subject: any) {
    return this.af.database.list(`/teams/${teamId}/chatroom`, {
      query: {
        limitToLast: subject
      }
    });
  }

  getMatchInfo(teamId: string, matchId: string) {
    return this.af.database.object(`/teams/${teamId}/matches/${matchId}`);
  }

  addSelfChatMessage(teamId: string, message: string) {
    this.af.database.list(`/teams/${teamId}/chatroom`).push({
      content: message,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      createdBy: this.selfId
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

  addSelfMatch(match: any) {
    match.creator = this.selfId;
    match.createdAt = firebase.database.ServerValue.TIMESTAMP;
    const promise = this.af.database.list(`/teams/${this.selfTeamId}/matches`).push(match);
    promise.then(newMatch => {
      let id = newMatch["key"];
      // add to team members
      let subscription = this.getPlayers(this.selfTeamId).subscribe(snapshots => {
        subscription.unsubscribe();
        snapshots.forEach(snapshot => {
          this.addMatchNotification(snapshot.$key, id, {
            isRead: false,
            teamId: this.selfTeamId,
            opponentId: match.opponentId,
            time: match.time
          });
        });
      });
    });
  }

  getMatchPlayers(teamId: string, matchId: string) {
    return this.af.database.list(`/teams/${teamId}/matches/${matchId}/players`);
  }

  joinMatch(teamId: string, matchId: string) {
    this.af.database.object(`/teams/${teamId}/matches/${matchId}/players/${this.selfId}`).set(true);
  }

  leaveMatch(teamId: string, matchId: string) {
    this.af.database.object(`/teams/${teamId}/matches/${matchId}/players/${this.selfId}`).remove();
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