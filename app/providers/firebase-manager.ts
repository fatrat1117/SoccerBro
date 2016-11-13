import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import * as moment from 'moment';
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

  getPlayerRole(id) {
    return this.af.database.object(`/players/${id}/role`);
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

  validateTeamNumber(teamId, number, success, error) {
    let subscription = this.getTeamPlayers(teamId).subscribe(players => {
      
      let isValid = true;
      players.forEach(p => {
        if (p.number == number) {
          if (p.$key == this.selfId) {
            isValid = false;
            success();
          } else {
            isValid = false;
            error("Number exists");
          }
        }
      })
      
      subscription.unsubscribe();
      if (isValid) {
        this.updateTeamNumber(teamId, this.selfId, number);
        success();
      }
    });
  }

  updateTeamNumber(teamId, playerId, number) {
      this.af.database.object(`/players/${playerId}/teams/${teamId}`).set(number);
      this.af.database.object(`/teams/${teamId}/players/${playerId}`).update({ number: number });
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

  removeMatchNotification(playerId: string, matchID: string) {
    this.af.database.object(`/players/${playerId}/match-notifications/${matchID}`).remove();
  }

  changeNotificationStatus(matchId: string, isRead: boolean) {
    this.af.database.object(`/players/${this.selfId}/match-notifications/${matchId}`).update({
      isRead: isRead
    });
  }

  getToVoteInfo() {
    return this.af.database.list(`/players/${this.selfId}/to-vote`, {
      query: {
        orderByValue: true
      }
    });
  }

  removeToVote(matchId) {
    this.af.database.object(`/players/${this.selfId}/to-vote/${matchId}`).remove();
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
    this.getTeamPlayers(this.selfTeamId).take(1).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.af.database.object(`/players/${snapshot.$key}/match-notifications/${matchId}`).remove();
        });
    });

    this.getTeamMatch(this.selfTeamId, matchId).update({
      isPosted: false
    });
  }

  /*
  withdrawSelfMatch(matchId: string) {
    const promise = this.af.database.object(`/teams/${this.selfTeamId}/matches/${matchId}`).remove();
    promise.then(_ => {
      this.getTeamPlayers(this.selfTeamId).take(1).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.af.database.object(`/players/${snapshot.$key}/match-notifications/${matchId}`).remove();
        });
      });
    });

    // update totalMatches
    this.updateTotalMatches(this.selfTeamId);
  }
  */

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

  setTeamPlayersToVote(teamId, matchId, date) {
    this.af.database.list(`/teams/${teamId}/players`).take(1).subscribe(players => {
      players.forEach(p => {
        this.af.database.object(`/players/${p.$key}/to-vote/${matchId}`).set(date);
      })
    });
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





  /********** All Matches Operations ***********/
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

  getTournamentDateByTournamentId(id){
    return this.af.database.list('/tournaments/list/'+ id + '/dates');
  }

  getTournamentMatchDate(id, day) {
    return this.af.database.object('/tournaments/list/' + id + '/dates/' + day);
  }

  getMatchesByTournamentId(id) {
    return this.af.database.list('/matches/list', {
      query: {
        orderByChild: 'tournamentId',
        equalTo: id
      }
    });
  }


  scheduleMatch(matchObj, success, error) {
    console.log('scheduleMatch', matchObj);

    this.getMatchList().push(matchObj)
      .then(newMatch => {
        this.getMatchDate(matchObj.date).set(true);
        if (matchObj.tournamentId)
          this.getTournamentMatchDate(matchObj.tournamentId, matchObj.date).set(true);

        // add to team match
        let matchId = newMatch["key"];
        let teamData = {
          time: matchObj.time,
          locationName: matchObj.locationName,
          locationAddress: matchObj.locationAddress,
          isPosted: false
        };
        // add to home team
        teamData["opponentId"] = matchObj.awayId;
        this.updateTeamMatch(matchId, teamData, matchObj.homeId);
        // add to away team
        teamData["opponentId"] = matchObj.homeId;
        this.updateTeamMatch(matchId, teamData, matchObj.awayId);

        success();
      })
      .catch(err => error(err));
  }

  updateMatch(id, matchObj, oldDate, success, error) {
    console.log('updateMatch', matchObj);
    this.getMatch(id).update(matchObj)
      .then(newMatch => {
        this.getMatchDate(matchObj.date).set(true);
        // update team match
        let teamData = {
          time: matchObj.time,
          locationName: matchObj.locationName,
          locationAddress: matchObj.locationAddress
        };
        // update home team
        teamData["opponentId"] = matchObj.awayId;
        this.updateTeamMatch(id, teamData, matchObj.homeId);
        // update away team
        teamData["opponentId"] = matchObj.homeId;
        this.updateTeamMatch(id, teamData, matchObj.awayId);

        // process raw data
        if (matchObj.homeScore && matchObj.awayScore)
          this.processMatchData(id, oldDate);

        success();
      })
      .catch(err => error(err));

  }

  updateTeamMatch(matchId: string, match: any, teamId: string) {
    match.createdAt = firebase.database.ServerValue.TIMESTAMP;
    this.getTeamMatch(teamId, matchId).update(match);
    this.getTeamMatch(teamId, matchId).take(1).subscribe(m => {
      if (m.isPosted) {
        // add to team players
        this.addToPlayerNot(teamId, matchId, m.opponentId, m.time);
      }
    });
    /*
    const promise = this.af.database.list(`/teams/${this.selfTeamId}/matches`).push(match);
    promise.then(newMatch => {
      let id = newMatch["key"];
      // add to team players
      this.getPlayersObj(teamId).subscribe(snapshots => {
        for (let pId in snapshots) {
          if (pId != '$key') {
            this.addMatchNotification(pId, id, {
              isRead: false,
              teamId: teamId,
              opponentId: match.opponentId,
              time: match.time
            });
          }
        }
      });
    }).catch(err => {
      alert(err);
    });
    */

    // update totalMatches
    this.updateTotalMatches(this.selfTeamId);
  }

  deleteTeamMatch(teamId: string, matchId: string) {
    this.getTeamMatch(teamId, matchId).take(1).subscribe(m => {
      if (m.isPosted) {
        this.removePlayerNot(teamId, matchId);
      }
      this.getTeamMatch(teamId, matchId).remove();
    });
  }

  deleteMatch(id) {
    this.getMatch(id).take(1).subscribe(snapShot => {
      this.deleteTeamMatch(snapShot.homeId, id);
      this.deleteTeamMatch(snapShot.awayId, id);
      this.getMatch(id).remove();
    })
  }


  getTeamMatch(teamId: string, matchId: string) {
    return this.af.database.object(`/teams/${teamId}/matches/${matchId}`);
  }

  getSelfUpcomingMatches() {
    let now = moment().unix() * 1000
    return this.af.database.list(`/teams/${this.selfTeamId}/matches`, {
      query: {
        orderByChild: 'time',
        startAt: now
      }
    });
  }

  updateSelfMatch(matchId, color, notice, opponentId, time) {
    this.getTeamMatch(this.selfTeamId, matchId).update({
      isPosted: true,
      color: color,
      notice: notice
    });

    this.addToPlayerNot(this.selfTeamId, matchId, opponentId, time);
  }

  addToPlayerNot(teamId, matchId, opponentId, time) {
    this.getPlayersObj(teamId).subscribe(snapshots => {
      for (let pId in snapshots) {
        if (pId != '$key') {
          this.addMatchNotification(pId, matchId, {
            isRead: false,
            teamId: this.selfTeamId,
            opponentId: opponentId,
            time: time
          });
        }
      }
    });
  }

  removePlayerNot(teamId, matchId) {
    this.getPlayersObj(teamId).subscribe(snapshots => {
      for (let pId in snapshots) {
        if (pId != '$key') {
          this.removeMatchNotification(pId, matchId);
        }
      }
    });
  }
  

  getMatchBasicData(id, date) {
    return this.af.database.object(`/matches/data/${date}/${id}/basic`)
  }

  getRefereeName(id, date) {
    return this.af.database.object(`/matches/data/${date}/${id}/referee/name`)
  }

  // post-precess raw data
  processMatchData(id, oldDate) {
    // remove old data
    console.log(oldDate);
    
    this.af.database.object(`/matches/data/${oldDate}/${id}/`).remove();
    this.getMatch(id).take(1).subscribe(data => {
      let database = `/matches/data/${data.date}/${id}/`;
      let n = 2;
      let successCallback = () => {
        if (--n == 0) {
          this.updateMVP(database);
          this.setTeamPlayersToVote(data.homeId, id, data.date);
          this.setTeamPlayersToVote(data.awayId, id, data.date);
        }
      }
      // update basic info
      let basic: any = {};
      basic.awayId = data.awayId;
      basic.homeId = data.homeId;
      basic.locationAddress = data.locationAddress;
      basic.locationName = data.locationName;
      basic.time = data.time;
      if (data.refereeName)
        basic.refereeName = data.refereeName;
      if (data.tournamentId)
        basic.tournamentId = data.tournamentId;
      this.af.database.object(database + "basic").set(basic);
      // referee
      this.getRefereeName(id, data.date).set(data.refereeName);
      // home
      this.addProcessedData(successCallback, database + "statistic/home", data.homeId, data.homeScore, data.homeGoals,
        data.homeAssists, data.homeRedCards, data.homeYellowCards);
      // away
      this.addProcessedData(successCallback, database + "statistic/away", data.awayId, data.awayScore, data.awayGoals,
        data.awayAssists, data.awayRedCards, data.awayYellowCards);
    });
  }

  addProcessedData(success, database: string, id: string, score: number, goals: Array<any>,
    assists: Array<any>, red: Array<any>, yellow: Array<any>) {
    let teamData: any = {};
    teamData.teamId = id;
    teamData.score = score;
    teamData.red = 0;
    teamData.yellow = 0;
    // create player dictionary
    let players: { [num: number]: any } = {};
    if (goals != undefined) {
      for (var p of goals) {
        if (players[p.num] == undefined)
          players[p.num] = {};
        players[p.num].goals = p.goals;
      }
    }
    if (assists != undefined) {
      for (var p of assists) {
        if (players[p.num] == undefined)
          players[p.num] = {};
        players[p.num].assists = p.assists;
      }
    }
    if (red != undefined) {
      for (var p of red) {
        if (players[p.num] == undefined)
          players[p.num] = {};
        players[p.num].red = p.cards;
        teamData.red += p.cards;
      }
    }
    if (yellow != undefined) {
      for (var p of yellow) {
        if (players[p.num] == undefined)
          players[p.num] = {};
        players[p.num].yellow = p.cards;
        teamData.yellow += p.cards;
      }
    }

    // find player id
    teamData.players = {};
    this.getTeamPlayers(id).take(1).subscribe(snapshots => {
      snapshots.forEach(p => {
        if (players[p.number] != undefined)
          teamData.players[p.$key] = players[p.number];
      })
      // add pocessed data
      this.af.database.object(database).set(teamData)
        .then(() => {
          let successCallback = () => {
            success();
          }
          this.addPlayersPosition(database, teamData.players, successCallback);
        })
        .catch(err => console.log(err));
    });
  }

  addPlayersPosition(database: string, players: any, success) {
    let n = Object.keys(players).length;
    if (n == 0) {
      success();
      return;
    }

    for (let key in players) {
      this.getPlayerDetail(key).take(1).subscribe(p => {
        if (p.position != undefined) {
          this.af.database.object(database + '/players/' + key).update({ position: p.position })
            .then(() => {
              if (--n == 0) {
                //done, add success callback here
                success();
              }
            });
        } else {
          if (--n == 0) {
            //done, add success callback here
            success();
          }
        }
      })
    }
  }





  /********** MVP ***********/
  updateMVP(database: string) {
    this.af.database.object(database + "statistic").take(1).subscribe(data => {
      let homeStats = data.home;
      let awayStats = data.away;
      let isHomeWon = homeStats.score >= awayStats.score;
      let wonStats = isHomeWon ? homeStats : awayStats;
      let lostStats = isHomeWon ? awayStats : homeStats;
      //this.calculateMVP(wonStats, lostStats);
      let mvp = this.calculateMVP(wonStats, lostStats);
      this.af.database.object(database + "/mvp/candidates").set(mvp);
    })
  }

  calculateMVP(wonStats: any, lostStats: any) {
    // filter out yellow/red cards
    let candidates = Array<any>();
    let spliter = 0;
    for (let key in wonStats.players) {
      let p = wonStats.players[key];
      if (p.yellow > 0 || p.red > 0)
        continue;
      p.id = key;
      candidates.push(p);
      spliter++;
    }
    for (let key in lostStats.players) {
      let p = lostStats.players[key];
      if (p.yellow > 0 || p.red > 0)
        continue;
      p.id = key;
      candidates.push(p);
    }

    // find mvp for different positions
    // goals
    let goalsMvp = this.getGoalsMvp(candidates);
    // assists
    let assistsMvp = this.getAssistsMvp(candidates);
    // gk
    let minScore = 2;
    let gkMvp = Array<any>();
    if (wonStats.score < minScore && lostStats.score < minScore)
      gkMvp = this.getGkMvp(candidates);
    else if (wonStats.score < minScore) // lost gk mvp
      gkMvp = this.getGkMvp(candidates.slice(spliter));
    else if (lostStats.score < minScore) // won gk mvp
      gkMvp = this.getGkMvp(candidates.slice(0, spliter));
    // def
    let averageScore = 3;
    let defMvp = Array<any>();
    if (wonStats.score < averageScore && lostStats.score < averageScore)
      defMvp = this.getDefMvp(candidates);
    else if (wonStats.score < averageScore) // lost def mvp
      defMvp = this.getDefMvp(candidates.slice(spliter));
    else if (lostStats.score < averageScore) // won def mvp
      defMvp = this.getDefMvp(candidates.slice(0, spliter));

    // summarize
    let mvp = {};
    while (goalsMvp.length != 0 || assistsMvp.length != 0 || gkMvp.length != 0 || defMvp.length != 0) {
      // best goals
      if (goalsMvp.length > 0) {
        let p = goalsMvp.shift();
        mvp[p.id] = {};
        mvp[p.id].description = p.goals + " Goals";
      }
      if (Object.keys(mvp).length > 3)
        break;

      // best assists
      if (assistsMvp.length > 0) {
        let p = assistsMvp.shift();
        if (mvp[p.id] == undefined) {
          mvp[p.id] = {};
          mvp[p.id].description = p.assists + " Assists";
        }
        else
          mvp[p.id].description += ", " + p.assists + "Assists";
      }
      if (Object.keys(mvp).length > 3)
        break;

      // best gk
      if (gkMvp.length > 0) {
        let p = gkMvp.shift();
        if (mvp[p.id] == undefined) {
          mvp[p.id] = {};
          mvp[p.id].description = "? Saves";
        }
        else
          mvp[p.id].description += ", " + "? Saves";
      }
      if (Object.keys(mvp).length > 3)
        break;

      // best def
      if (defMvp.length > 0) {
        let p = defMvp.shift();
        if (mvp[p.id] == undefined) {
          mvp[p.id] = {};
          mvp[p.id].description = "? Blockings";
        }
        else
          mvp[p.id].description += ", " + "? Blockings";
      }
      if (Object.keys(mvp).length > 3)
        break;

    }

    return mvp;
  }

  getGoalsMvp(candidates: Array<any>) {
    let minGoals = 2;
    let result = Array<any>();
    for (let p of candidates) {
      if (p.goals != undefined && p.goals >= minGoals)
        result.push(p);
    }
    result.sort((p1, p2) => p1.goals - p2.goals);
    return result;
  }

  getAssistsMvp(candidates: Array<any>) {
    let minAssists = 2;
    let result = Array<any>();
    for (let p of candidates) {
      if (p.assists != undefined && p.assists >= minAssists)
        result.push(p);
    }
    result.sort((p1, p2) => p1.assists - p2.assists);
    return result;
  }

  getGkMvp(candidates: Array<any>) {
    let result = Array<any>();
    for (let p of candidates) {
      if (p.position != undefined && p.position.toUpperCase() == "GK")
        result.push(p);
    }
    this.shuffle(result);
    return result;
  }

  getDefMvp(candidates: Array<any>) {
    let result = Array<any>();
    let positions = ["CB", "SB", "DMF"];
    for (let p of candidates) {
      if (p.position == undefined)
        continue;
      let pos = p.position.toUpperCase();
      if (positions.indexOf(pos) >= 0)
        result.push(p);
    }
    this.shuffle(result);
    return result;
  }

  shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  getMVPCandidates(date: number, matchId: string) {
    return this.af.database.list(`/matches/data/${date}/${matchId}/mvp/candidates`);
  }

  getMVPCandidateVotes(date: number, matchId: string, pId: string) {
    return this.af.database.list(`/matches/data/${date}/${matchId}/mvp/candidates/${pId}/votes`);
  }

  getMVPWinner(date: number, matchId: string) {
    return this.af.database.object(`/matches/data/${date}/${matchId}/mvp/winner`);
  }

  voteReferee(date, matchId, rating, tags) {
    let data:any = {}
    data.score = rating;
    //this.af.database.object(`/matches/data/${date}/${matchId}/referee/ratings/${this.selfId}/score`).set(rating);
    tags.forEach(t => {
      data[t] = rating;
    })
    this.af.database.object(`/matches/data/${date}/${matchId}/referee/ratings/${this.selfId}`).set(data);
  }

  voteMvp(date: number, matchId: string, playerId: string) {
    let promise = this.af.database.object(`/matches/data/${date}/${matchId}/mvp/candidates/${playerId}/votes/${this.selfId}`).set(true);
    promise.then(_ => {
      //this.removeToVote(matchId);
      this.updateMVPWinner(date, matchId);
    })
  }

  updateMVPWinner(date: number, matchId: string) {
    let max = 0;
    let winnerId = '';
    this.getMVPCandidates(date, matchId).take(1).subscribe(snapshots => {
      snapshots.forEach(s => {
        this.getMVPCandidateVotes(date, matchId, s.$key).take(1).subscribe(votes => {
          console.log(votes);
          let count = votes.length;
          if (count >= 5 && count > max) {
            max = count;
            winnerId = s.$key;
          }
        })
      })
      if (max >= 5)
        this.getMVPWinner(date, matchId).set(winnerId);
    });
  }





  /********** All Tournament Operations ***********/
  getTournamentList() {
    return this.af.database.list('/tournaments/list');
  }

  getTournamentTable(id) {
    return this.af.database.object('/tournaments/list/' + id + '/table');
  }

  getTournamentTableList(id) {
    return this.af.database.list('/tournaments/list/' + id + '/table');
  }

  getTournament(id) {
    return this.af.database.object('/tournaments/list/' + id);
  }

  getTournamentInfo(id) {
    return this.af.database.object('/tournaments/list/' + id + '/info');
  }

  removeTournament(id) {
    this.getTournament(id).remove();
  }
  
  getTournamentsAdmin(id) {
    return this.af.database.object('/tournaments/whitelist/' + id);
  }

  getTournamentAdmin(id) {
    return this.af.database.object('/tournaments/list/' + id + '/whitelist/' + this.selfId);
  }

  createTournament(tournamentObj, success, error) {
    console.log('createTournament', tournamentObj);

    this.getTournamentList().push({ name: tournamentObj.name })
      .then(newTournament => success())
      .catch(err => error(err));
  }

  computeTournamentTable(id) {
    console.log('computeTournamentTable');
    this.af.database.list('/matches/list', {
      query: {
        orderByChild: 'tournamentId',
        equalTo: id
      }
    }).subscribe(rawData => {
      console.log('raw data', rawData);
      let tableData = {};
      rawData.forEach(match => {
        if (match.homeScore && match.awayScore) {
          this.computeOneMatch(tableData, match.homeId, match.awayId, match.homeScore, match.awayScore);
          this.computeOneMatch(tableData, match.awayId, match.homeId, match.awayScore, match.homeScore);
        }
      })
      //console.log(tableData);
      this.getTournamentTable(id).set(tableData).then(() => console.log('computeTournamentTable done'));
    });
  }

  computeOneMatch(result, teamId1, teamId2, score1, score2) {
    if (!result[teamId1]) {
      result[teamId1] = {
        W: 0,
        L: 0,
        D: 0,
        P: 0,
        PTS: 0,
        GA: 0,
        GS: 0
      }
    }

    ++result[teamId1].P;
    result[teamId1].GS = result[teamId1].GS + score1;
    result[teamId1].GA = result[teamId1].GA + score2;
    if (score1 > score2) {
      ++result[teamId1].W;
      result[teamId1].PTS = result[teamId1].PTS + 3;
    }
    else if (score1 < score2) {
      ++result[teamId1].L;
    }
    else {
      ++result[teamId1].D;
      result[teamId1].PTS = result[teamId1].PTS + 1;
    }
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
