import {Component} from '@angular/core';
import {ViewController, ModalController, PopoverController} from 'ionic-angular';
import {MapsAPILoader} from 'angular2-google-maps/core';
import * as moment from 'moment';

import {SearchTeamPage} from '../search-team/search-team';
import {ColorPickerPage} from '../color-picker/color-picker';
import {FirebaseManager} from '../../providers/firebase-manager'

declare var google: any;

@Component({
  templateUrl: 'build/pages/new-match/new-match.html',
})
export class NewMatchPage {
  opponent: any;
  jerseyColor: string;
  location: any;
  minDate: string;
  matchDate: Date;
  matchTime: Date;
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController,
    private popoverController: PopoverController, private _loader: MapsAPILoader,
    private fm: FirebaseManager) {

    this.jerseyColor = 'transparent';
    this.location = {};
    this.minDate = moment().format("YYYY-MM-DD");;

  }

  ngOnInit() {
    this.autocomplete();
  }

  searchTeam() {
    let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
    searchTeamModal.onDidDismiss(data => {
      this.opponent = data.team;
      console.log(this.opponent);
      
    });
    searchTeamModal.present();
  }

  pickColor() {
    let popover = this.popoverController.create(ColorPickerPage);
    popover.onDidDismiss(data => {
      if (data != null)
        this.jerseyColor = data.color;
    });
    popover.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // Google places
  autocomplete() {
    this._loader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        let place = autocomplete.getPlace();
        this.location.name = place.name;
        this.location.address = place.formatted_address;
      });
    });
  }

  // post
  postNewMatch() {
    let time = moment(this.matchDate.valueOf() + " " + this.matchTime.valueOf()).unix() * 1000;
    this.fm.addSelfMatch({
      //timestamp: firebase.database.ServerValue.TIMESTAMP,
      creatorId: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      teamId: '-KLBMI-QFYiaW5nSqOjR',
      opponentId: this.opponent.id,
      time: time,
      color: this.jerseyColor,
      locationName: this.location.name,
      locationAdderess: this.location.address,
      content: 'this is a test notification'
    });

/*
    this.af.database.list('/matches').push({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      creator_id: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      team_id: '-KLBMI-QFYiaW5nSqOjR',
      opponent_id: this.opponent.id,
      time: time,
      color: this.jerseyColor,
      location_name: this.location.name,
      location_adderess: this.location.address,
      content: 'this is a test notification'
    }).then(item => {
      // add to self
      this.addNotification(item["key"], '-KLBMI-QFYiaW5nSqOjR', this.opponent.id, time);

      // add to opponent
      this.addNotification(item["key"], this.opponent.id, '-KLBMI-QFYiaW5nSqOjR', time);
    });
    */
  }

  addNotification

/*
  addNotification(_key: string, _teamId: string, _opponentId: string, _time: number) {
    let subscriptions = this.af.database.list('/playersOfTeam/' + _teamId).subscribe(players => {
      subscriptions.unsubscribe();
      players.forEach(p => {
        this.af.database.object('/match-notifications/' + p.$key + '/' + _key).set({
          isRead: false,
          time: _time,
          location_name: this.location.name,
          opponent_id: this.opponent.id
        });
      });
    })
  }
*/
}
