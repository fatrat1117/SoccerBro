import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {FirebaseManager} from '../../providers/firebase-manager';

@Component({
  templateUrl: 'build/pages/match-rating/match-rating.html',
  pipes: [PlayerBasicPipe]
})
export class MatchRatingPage {
  matchDate: number;
  matchId: string;
  starArray = [0, 1, 2, 3, 4];
  rating: number;
  showMVP: boolean;
  candidates: any;
  selectedMVP: string;
  constructor(private viewCtrl: ViewController, private fm: FirebaseManager, private navParams: NavParams) {
    console.log(this.navParams);
    this.matchDate = this.navParams.get('matchDate');
    this.matchId = this.navParams.get('matchId');
    
    this.rating = 0;
    this.showMVP = false;

    this.candidates = this.fm.getMVPCandidates(this.matchDate, this.matchId);
    this.selectedMVP = "";
  }

  setRating(index: number) {
    this.rating = index + 1;
    setTimeout(() => {
      this.showMVP = true;
    }, 500);
  }

  setMVP(id: string) {
    this.selectedMVP = id;
  }

  getStarColorStyle(index: number) {
    let style: any = {};
    if (index >= this.rating)
    {
      style.color = 'lightgray';
    }
    return style;
  }

  getMVPColorStyle(id: string) {
    let style: any = {};
    
    if (id != this.selectedMVP)
    {
      style.color = 'lightgray';
    }
    return style;
  }

  back() {
    this.showMVP = false;
  }

  submit() {
    this.fm.voteMvp(this.matchDate, this.matchId, this.selectedMVP);
    this.viewCtrl.dismiss();
  }
}
