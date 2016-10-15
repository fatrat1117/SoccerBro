import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare let firebase: any;

@Injectable()
export class FirebaseManager {
  selfId: string;
  selfTeamId: string;
  totalPlayers = 0;
  totalTeams = 0;

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
      setTimeout(() => {
        //console.log(sub);
        //use timeout to prevent deadloop and ensure sub is initialized
        sub.unsubscribe();
        afPublic.update({ popularity: snapshot.popularity + 1 });
        if (success)
          success(snapshot);
      },
        250);
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
    return this.af.database.list(`/teams/${teamId}/players`);
  }

  getPlayersObj(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/players`);
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
    this.af.database.object(`/teams/${this.selfTeamId}/players/${playerId}}`).set(memberInfo);
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
      // add to team players
      this.getPlayersObj(this.selfTeamId).subscribe(snapshots => {
        console.log('addSelfMatch', snapshots);
        for (let pId in snapshots) {
          console.log('player id', pId);
          if (pId != '$key') {
            this.addMatchNotification(pId, id, {
              isRead: false,
              teamId: this.selfTeamId,
              opponentId: match.opponentId,
              time: match.time
            });
          }
        }
      });
    }).catch(err => {
      alert(err);
    });

    // update totalMatches
    this.updateTotalMatches(this.selfTeamId);
  }

  withdrawSelfMatch(matchId: string) {
    const promise = this.af.database.object(`/teams/${this.selfTeamId}/matches/${matchId}`).remove();
    promise.then(_ => {
      let subscription = this.getPlayers(this.selfTeamId).subscribe(snapshots => {
        subscription.unsubscribe();
        snapshots.forEach(snapshot => {
          this.af.database.object(`/players/${snapshot.$key}/match-notifications/${matchId}`).remove();
        });
      });
    });

    // update totalMatches
    this.updateTotalMatches(this.selfTeamId);
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

  updateTotalPlayers(teamId: string) {
    this.af.database.list(`/teams/${teamId}/players`).subscribe(snapshots => {
      this.af.database.object(`/teams/${teamId}/basic-info`).update({ totalPlayers: snapshots.length });
    })
  }

  updateTotalMatches(teamId: string) {
    this.af.database.list(`/teams/${teamId}/matches`).subscribe(snapshots => {
      this.af.database.object(`/teams/${teamId}/basic-info`).update({ totalMatches: snapshots.length });
    })
  }

  getTeamPlayers(teamId: string) {
    return this.af.database.list(`/teams/${teamId}/players`);
  }

  setNewCaptain(teamId: string, playerId: string) {
    this.af.database.object(`/teams/${teamId}/basic-info`).update({ captain: playerId });
  }

  isTeamPlayer(playerId: string, teamId) {
    return this.af.database.object(`/teams/${teamId}/players/${playerId}`);
  }





  /********** All Public Operations ***********/
  getPlayerPublic(playerId: string) {
    return this.af.database.object(`public/players/${playerId}`);
  }

  getTeamPublic(teamId: string) {
    return this.af.database.object(`public/teams/${teamId}`);
  }

  queryPublicPlayers(subject, limit) {
    return this.af.database.list(`/public/players/`, {
      query: {
        orderByChild: subject,
        limitToLast: limit
      }
    });
  }

  getPublicTeams() {
    return this.af.database.list(`/public/teams/`, {
      query: { orderByChild: 'name' }
    });
  }

  queryPublicTeams(subject, limit) {
    return this.af.database.list(`/public/teams/`, {
      query: {
        orderByChild: subject,
        limitToLast: limit
      }
    });
  }

  //League 
  getMatchList() {
    return this.af.database.list('/matches/list');
  }

  getMatch(id) {
    return this.af.database.object('/matches/list/' + id); 
  }

  queryMatches(dateSubject) {
    return this.af.database.list('/matches/list', {
      query: {
        orderByChild: 'date',
        equalTo: dateSubject
      }
    });
  }

  getMatchDates() {
    return this.af.database.list('/matches/dates');
  }

  getMatchDate(day) {
    return this.af.database.object('/matches/dates/' + day);
  }

  scheduleMatch(matchObj, success, error) {
    console.log('scheduleMatch', matchObj);
    
    this.getMatchList().push(matchObj)
    .then(newMatch=> {
      this.getMatchDate(matchObj.date).set(true);
      success();
    })
    .catch(err => error(err));
  }

  /********** All Misc Operations ***********/
  sendFeedback(content: string) {
    this.af.database.list(`/misc/feedbacks`).push({
      content: content,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      createdBy: this.selfId
    });
  }
}