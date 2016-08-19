import {Component} from '@angular/core';
import {ViewController, ModalController, PopoverController} from 'ionic-angular';
import {MapsAPILoader} from 'angular2-google-maps/core';

import {SearchTeamPage} from '../search-team/search-team';
import {ColorPickerPage} from '../color-picker/color-picker';

declare var google: any;

@Component({
  templateUrl: 'build/pages/new-match/new-match.html',
})
export class NewMatchPage {
  opponent: any;
  jerseyColor: string;
  address: string;
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController, 
              private popoverController: PopoverController, private _loader: MapsAPILoader) {

    this.jerseyColor = 'transparent';
    this.address = '';
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
        console.log(place);
        console.log(place.name);
        console.log(place.formatted_address);
      });
    });
  }
}
