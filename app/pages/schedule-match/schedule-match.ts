import {Component} from '@angular/core';
import {ViewController, ModalController, PopoverController, NavParams} from 'ionic-angular';
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
  //pushIds = [];
  busy = false;
  mId: any;
  hostScore = 0;
  visitingScore = 0;
  constructor(private viewCtrl: ViewController, 
              private modalCtrl: ModalController,
              private popoverController: PopoverController, 
              private _loader: MapsAPILoader,
              private fm: FirebaseManager,
              private am: AccountManager,
              params: NavParams) {
    this.location = {};
    this.notice  = "";
    this.minDate = moment().format("YYYY-MM-DD");
    this.matchDate = this.minDate;
    this.matchTime = "15:00";
    this.mId = params.get('mId');
    let self = this;
    if (this.mId) {
      console.log('match id', this.mId);
      fm.getMatch(this.mId).subscribe(matchSnapshot=> {
        console.log(matchSnapshot);
        self.host = {};
        self.visiting = {};
        self.location = {};
        self.host["id"] = matchSnapshot.hostId;
        self.visiting["id"] = matchSnapshot.visitingId;
        self.location["name"] = matchSnapshot.locationName;
        self.location["address"] = matchSnapshot.locationAddress;
        self.matchDate = am.numberToDateString(matchSnapshot.date);
        self.matchTime = am.numberToTimeString(matchSnapshot.time);
        console.log(self.matchTime);
        self.notice = matchSnapshot.notice;
        if (matchSnapshot.hostScore)
          self.hostScore = matchSnapshot.hostScore;
        if (matchSnapshot.visitingScore)
          self.visitingScore = matchSnapshot.visitingScore;

        fm.getTeamBasic(matchSnapshot.hostId).subscribe(teamSnapshot=> self.host["name"] = teamSnapshot.name);
        fm.getTeamBasic(matchSnapshot.visitingId).subscribe(teamSnapshot=> self.visiting["name"] = teamSnapshot.name);
      });
    }
  }

  ngOnInit() {
    this.autocomplete();
  }

  updateUI() {
    //console.log(document.getElementById("autocompleteInput"));
    
    //document.getElementById("autocompleteInput").textContent = "2";
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
    let t = this.am.dateTimeStringToNumber(this.matchDate + " " + this.matchTime);
    let tDate = this.am.dateTimeStringToNumber(this.matchDate);
    //console.log(this.matchDate, this.matchTime, t, tDate);
    
    let self = this;
    let success = () => {
      alert('schedule match successful');
      self.dismiss();
    };
    let error = err => {
      alert(err);
    };

    this.fm.scheduleMatch({
      hostId: this.host.id,
      visitingId: this.visiting.id,
      date: tDate,
      time: t,
      locationName: this.location.name,
      locationAddress: this.location.address,
      notice: this.notice
    }, 
    success, 
    error);
  }

  UpdateMatch() {
    let t = this.am.dateTimeStringToNumber(this.matchDate + " " + this.matchTime);
    let tDate = this.am.dateTimeStringToNumber(this.matchDate);

    let updateMatchData = {date: tDate,
      time: t,
      locationName: this.location.name,
      locationAddress: this.location.address,
      notice: this.notice,
      hostScore: this.hostScore,
      visitingScore: this.visitingScore
    }

    let self = this;
    let success = () => {
      //alert('update match successful');
      self.dismiss();
    };
    let error = err => {
      alert(err);
    };

    this.fm.updateMatch(this.mId, updateMatchData, 
    success, 
    error);
  }
}
