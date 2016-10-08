import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {transPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';
import {LeaguePage} from '../league/league';

@Component({
  templateUrl: 'build/pages/home/home.html',
  pipes: [transPipe]
})
export class HomePage {
  slides: any[];
  adSlideOptions: any;
  constructor(private navCtrl: NavController, local: Localization) {
    this.slides = [];
    this.loadSlides(local.langCode, 4);

    this.adSlideOptions = {
      autoplay: 3000,
      loop: true
    };
    console.log(local.langCode);

  }

  loadSlides(langCode: string, total: number) {
    let path = `img/banners/${langCode}/`
    for (let i = 0; i < total; ++i) {
      this.slides.push({
        image: `img/banners/${langCode}/${i}.jpg`
      });
    }
  }

  goLeaguePage() {
    this.navCtrl.push(LeaguePage);
  }
}