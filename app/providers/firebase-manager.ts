import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare let firebase: any;

@Injectable()
export class FirebaseManager {
  constructor(private af: AngularFire) {
  }

  // player
  getPlayerBasic(id: string) {
    return this.af.database.object(`/players/${id}/basic-info`);
  }

  getPlayerDetail(id: string) {
    return this.af.database.object(`/players/${id}/detail-info`);
  }

  // team
  getTeamBasic(id: string) {
    return this.af.database.object(`/teams/${id}/basic-info`);
  }

  getTeamDetail(id: string) {
    return this.af.database.object(`/teams/${id}/detail-info`);
  }

  // notifications
  getNotificationList() {
    return this.af.database.list(`/players/{PLAYER_ID}/match-notifications`, {
      query: { orderByChild: 'time' }
    });
  }


}