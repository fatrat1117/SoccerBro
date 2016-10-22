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
  home: any;
  away: any;
  location: any;
  minDate: string;
  matchDate: string;
  matchTime: string;
  notice: string;
  //pushIds = [];
  busy = false;
  mId: any;
  homeScore = 0;
  awayScore = 0;
  homeGoals = [];
  homeAssists = [];
  homeYellowCards = [];
  homeRedCards = [];
  awayGoals = [];
  awayAssists = [];
  awayYellowCards = [];
  awayRedCards = [];
  tournamentId = [];

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
    this.tournamentId = params.get('tournamentId');

    let self = this;
    if (this.mId) {
      console.log('match id', this.mId);
      fm.getMatch(this.mId).subscribe(matchSnapshot=> {
        console.log(matchSnapshot);
        self.home = {};
        self.away = {};
        self.location = {};
        self.home["id"] = matchSnapshot.homeId;
        self.away["id"] = matchSnapshot.awayId;
        self.location["name"] = matchSnapshot.locationName;
        self.location["address"] = matchSnapshot.locationAddress;
        self.matchDate = am.numberToDateString(matchSnapshot.date);
        self.matchTime = am.numberToTimeString(matchSnapshot.time);
        //console.log(self.matchTime);
        self.notice = matchSnapshot.notice;
        if (matchSnapshot.homeScore)
          self.homeScore = matchSnapshot.homeScore;
        if (matchSnapshot.awayScore)
          self.awayScore = matchSnapshot.awayScore;

        if (matchSnapshot.homeGoals)
          self.homeGoals = matchSnapshot.homeGoals;
        if (matchSnapshot.homeAssists)
          self.homeAssists = matchSnapshot.homeAssists;
        if (matchSnapshot.homeYellowCards)
          self.homeYellowCards = matchSnapshot.homeYellowCards;
        if (matchSnapshot.homeRedCards)
          self.homeRedCards = matchSnapshot.homeRedCards;

        if (matchSnapshot.awayGoals)
          self.awayGoals = matchSnapshot.awayGoals;
        if (matchSnapshot.awayAssists)
          self.awayAssists = matchSnapshot.awayAssists;
        if (matchSnapshot.awayYellowCards)
          self.awayYellowCards = matchSnapshot.awayYellowCards;
        if (matchSnapshot.awayRedCards)
          self.awayRedCards = matchSnapshot.awayRedCards;

        fm.getTeamBasic(matchSnapshot.homeId).subscribe(teamSnapshot=> self.home["name"] = teamSnapshot.name);
        fm.getTeamBasic(matchSnapshot.awayId).subscribe(teamSnapshot=> self.away["name"] = teamSnapshot.name);
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
        this.home = data.team;
      else
        this.away = data.team;
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

    let matchData = {
      homeId: this.home.id,
      awayId: this.away.id,
      date: tDate,
      time: t,
      locationName: this.location.name,
      locationAddress: this.location.address,
      notice: this.notice
    }
    if (this.tournamentId)
      matchData["tournamentId"] = this.tournamentId;
      
    this.fm.scheduleMatch(matchData, 
    success, 
    error);
  }

  updateMatch() {
    let t = this.am.dateTimeStringToNumber(this.matchDate + " " + this.matchTime);
    let tDate = this.am.dateTimeStringToNumber(this.matchDate);

    let updateMatchData = {date: tDate,
      time: t,
      locationName: this.location.name,
      locationAddress: this.location.address,
      notice: this.notice,
      homeScore: this.homeScore,
      awayScore: this.awayScore,
      homeGoals: this.homeGoals,
      homeAssists: this.homeAssists,
      homeYellowCards: this.homeYellowCards,
      homeRedCards: this.homeRedCards,
      awayGoals: this.awayGoals,
      awayAssists: this.awayAssists,
      awayYellowCards: this.awayYellowCards,
      awayRedCards: this.awayRedCards
    };

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

  addGoal(goals) {
    goals.push({num: 0, goals: 0});
  }

  addAssist(assists) {
    assists.push({num: 0, assists: 0});
  }

  addYellowCard(cards) {
    cards.push({num: 0, cards: 1});
  }

  addRedCard(cards) {
    cards.push({num: 0, cards: 1});
  }

  toNumber(s) {
    return Number(s);
  }

  delRecord(i, arr) {
    arr.splice(i, 1);
  }
}
