import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { FirebaseManager } from '../../providers/firebase-manager';
import { PlayerBasicPipe } from '../../pipes/player-basic.pipe';
import { transPipe } from '../../providers/localization'


@Component({
  templateUrl: 'build/pages/manage-number/manage-number.html',
  pipes: [PlayerBasicPipe, transPipe]
})
export class ManageNumberPage {
  teamId: string;
  players: any[];
  numberChanged = false;

  constructor(private fm: FirebaseManager, private navParams: NavParams, private viewCtrl: ViewController) {
    this.teamId = this.navParams.get('teamId');
    fm.getTeamPlayers(this.teamId).take(1).subscribe(snapshots => {
      this.players = snapshots;
    })
  }

  save() {
    if (this.findDuplicate()) {
      alert("Duplicated number found!");
      this.numberChanged = false;
    }
    else {
      this.players.forEach(p => {
        let num = p.number;
        if (num)
          this.fm.updateTeamNumber(this.teamId, p.$key, num);
      })
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }



  findDuplicate() {
    let numbers = [];
    for (let p of this.players) {
      let num = p.number;
      if (num) {
        if (numbers.indexOf(num) >= 0)
          return true;
        else
          numbers.push(num);
      }
    }
    return false;
  }
}
