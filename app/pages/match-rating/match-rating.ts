import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {FirebaseManager} from '../../providers/firebase-manager';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {MomentPipe} from '../../pipes/moment.pipe';

@Component({
  templateUrl: 'build/pages/match-rating/match-rating.html',
  pipes: [PlayerBasicPipe, TeamBasicPipe, MomentPipe]
})
export class MatchRatingPage {
  matchDate: number;
  matchId: string;
  matchBasic: any;
  starArray = [0, 1, 2, 3, 4];
  rating: number;
  showMVP: boolean;
  candidates: any;
  selectedMVP: string;
  refereeName: string;
  positiveFb = [];
  constructor(private viewCtrl: ViewController, private fm: FirebaseManager, private navParams: NavParams) {
    console.log(this.navParams);
    this.matchDate = this.navParams.get('matchDate');
    this.matchId = this.navParams.get('matchId');
    
    this.rating = 0;
    this.showMVP = false;

    this.matchBasic = this.fm.getMatchBasicData(this.matchId, this.matchDate);
    this.candidates = this.fm.getMVPCandidates(this.matchDate, this.matchId);
    this.selectedMVP = "";
    this.initFeedbacks();
  }

  initFeedbacks() {
    // positive
    this.positiveFb = [
      {key: "Punctual", value: false},
      {key: "Active", value: false},
      {key: "Competent", value: false},
      {key: "Well Judged", value: false},
    ];
  }

  selectFb(index) {
    this.positiveFb[index].value = !this.positiveFb[index].value;
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
    this.fm.getMatchBasicData(this.matchId, this.matchDate).take(1).subscribe(snapshot => {
      this.fm.voteReferee(this.matchDate, this.matchId, snapshot.refereeName, this.rating);
    })
    this.fm.voteMvp(this.matchDate, this.matchId, this.selectedMVP);
    this.viewCtrl.dismiss();
  }
}
