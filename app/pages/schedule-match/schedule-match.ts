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
  opponent: any;
  jerseyColor: string;
  location: any;
  minDate: string;
  matchDate: string;
  matchTime: string;
  notice: string;
  pushIds = [];
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController,
              private popoverController: PopoverController, private _loader: MapsAPILoader,
              private fm: FirebaseManager,
              private am: AccountManager) {

    this.jerseyColor = 'transparent';
    this.location = {};
    this.notice  = "";
    this.minDate = moment().format("YYYY-MM-DD");
    this.matchDate = this.minDate;
    this.matchTime = "15:00"

    this.fm.getPlayersObj(this.fm.selfTeamId).subscribe(snapshot => {
      for (let pId in snapshot) {
          if (pId != '$key') {
            this.fm.getPlayerDetail(pId).subscribe(detail => {
                console.log('get push ids', detail);
                if (detail && detail.pushId)
                  this.pushIds.push(detail.pushId);
            });
          }
      }
    }); 
  }

  ngOnInit() {
    this.autocomplete();
  }

  searchTeam() {
    let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
    searchTeamModal.onDidDismiss(data => {
      this.opponent = data.team;
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
    let time = moment(this.matchDate + " " + this.matchTime).unix() * 1000;
    

    this.fm.addSelfMatch({
      opponentId: this.opponent.id,
      time: time,
      color: this.jerseyColor,
      locationName: this.location.name,
      locationAddress: this.location.address,
      notice: this.notice
    });

    // push notification
    let message = {
        'en': "A new match is waiting for you to join!",
        'zh-Hans': "一场新球赛等待你的加入！" 
    };
    
    this.am.postNotification(message, this.pushIds);

    this.dismiss();
  }
}
