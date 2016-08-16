import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {MapsAPILoader} from 'angular2-google-maps/core';

declare var google: any;

@Component({
  templateUrl: 'build/pages/new-notification/new-notification.html',
})
export class NewNotificationPage {
  address: string;
  constructor(private viewCtrl: ViewController, private _loader: MapsAPILoader) {
    this.address = '';
  }

  ngOnInit() {
    this.autocomplete();
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
