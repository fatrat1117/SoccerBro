import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager'
import {transPipe} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/create-tournament/create-tournament.html',
  pipes: [transPipe]
})
export class CreateTournamentPage {
  name: any;
  //location: any;
  busy: boolean;
  constructor(private viewCtrl: ViewController,
    private fm: FirebaseManager) {
    this.busy = false;
    //this.location = 'SG';
    this.name = '';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doCancel() {
    this.dismiss();
  }

  doCreate() {
    let tournamentObj = {
      name: this.name.trim()
    };

    this.busy = true;
    let self = this;

    let success = function () {
      self.dismiss();
    }

    let error = function (e) {
      self.busy = false;
      alert(e);
    }
    this.fm.createTournament(tournamentObj, success, error);
  }
}
