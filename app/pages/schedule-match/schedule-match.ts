import {Component} from '@angular/core';
import {ViewController, ModalController, PopoverController} from 'ionic-angular';
import {MapsAPILoader} from 'angular2-google-maps/core';
import * as moment from 'moment';
import {SearchTeamPage} from '../search-team/search-team';
import {ColorPickerPage} from '../color-picker/color-picker';
import {FirebaseManager} from '../../providers/firebase-manager'
import {AccountManager} from '../../providers/account-manager'
import {transPipe} from '../../providers/localization'
declare var google: any;

@Component({
  templateUrl: 'build/pages/schedule-match/schedule-match.html',
  pipes: [transPipe]
})
export class ScheduleMatchPage {
  host: any;
  visiting: any;
  location: any;
  minDate: string;
  matchDate: string;
  matchTime: string;
  notice: string;
  pushIds = [];
  busy = false;
  constructor(private viewCtrl: ViewController, 
              private modalCtrl: ModalController,
              private popoverController: PopoverController, 
              private _loader: MapsAPILoader,
              private fm: FirebaseManager,
              private am: AccountManager) {
    this.location = {};
    this.notice  = "";
    this.minDate = moment().format("YYYY-MM-DD");
    this.matchDate = this.minDate;
    this.matchTime = "15:00"
  }

  ngOnInit() {
    this.autocomplete();
  }

  searchTeam(teamType) {
    let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
    searchTeamModal.onDidDismiss(data => {
      if (1 == teamType)
        this.host = data.team;
      else
        this.visiting = data.team;
    });
    searchTeamModal.present();
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
    this.busy = true;
    let t = moment(this.matchDate + " " + this.matchTime).unix() * 1000;
    console.log(this.matchDate, this.matchTime, t);
    
    let self = this;
    let success = () => {
      alert('schedule match successful');
      self.dismiss();
    };
    let error = () => {};

    this.fm.scheduleMatch({
      hostId: this.host.id,
      visitingId: this.visiting.id,
      date: this.matchDate,
      time: t,
      locationName: this.location.name,
      locationAddress: this.location.address,
      notice: this.notice
    }, 
    success, 
    error);
  }
}
