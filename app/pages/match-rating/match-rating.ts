import {Component} from '@angular/core';
import {PopoverController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/match-rating/match-rating.html'
})
export class MatchRatingPage {
  starArray = [0, 1, 2, 3, 4];
  mvpArray = [0, 0, 0, 0];
  rating: number;
  showMVP: boolean;
  constructor(private popoverCtrl: PopoverController) {
    this.rating = 0;
    this.showMVP = false;
  }

  setRating(index: number) {
    this.rating = index + 1;
    setTimeout(() => {
      this.showMVP = true;
    }, 500);
  }

  setMVP(index: number) {
    this.mvpArray = [0, 0, 0, 0];
    this.mvpArray[index] = 1;
  }

  getStarColorStyle(index: number) {
    let style: any = {};
    if (index >= this.rating)
    {
      style.color = 'lightgray';
    }
    return style;
  }

  getMVPColorStyle(isSelected: number) {
    let style: any = {};
    if (isSelected == 0)
    {
      style.color = 'lightgray';
    }
    return style;
  }

  back() {
    this.showMVP = false;
  }
}
