import {Component} from '@angular/core';
import {PopoverController} from 'ionic-angular';

import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {FirebaseManager} from '../../providers/firebase-manager';

@Component({
  templateUrl: 'build/pages/match-rating/match-rating.html',
  pipes: [PlayerBasicPipe]
})
export class MatchRatingPage {
  starArray = [0, 1, 2, 3, 4];
  rating: number;
  showMVP: boolean;
  candidates: any;
  selectedMVP: string;
  constructor(private popoverCtrl: PopoverController, private fm: FirebaseManager) {
    this.rating = 0;
    this.showMVP = false;

    this.candidates = this.fm.getMVPCandidates(1477929600000, "-KUkNLvBQG1p8H1pntYi");
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
}
