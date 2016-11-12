import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {FirebaseManager} from '../../providers/firebase-manager';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {RatingDescPipe, RatingHeaderPipe, RatingTagPipe} from '../../pipes/rating.pipe';
import {MomentPipe} from '../../pipes/moment.pipe';

@Component({
  templateUrl: 'build/pages/match-rating/match-rating.html',
  pipes: [PlayerBasicPipe, TeamBasicPipe, MomentPipe, RatingDescPipe, RatingHeaderPipe, RatingTagPipe]
})
export class MatchRatingPage {
  matchDate: number;
  matchId: string;
  matchBasic: any;
  starArray = [0, 1, 2, 3, 4];
  rating: number;
  candidates: any;
  selectedMVP: string;
  refereeName: string;
  fbTags = [];
  constructor(private viewCtrl: ViewController, private fm: FirebaseManager, private navParams: NavParams) {
    console.log(this.navParams);
    this.matchDate = this.navParams.get('matchDate');
    this.matchId = this.navParams.get('matchId');
    
    this.rating = 0;

    this.matchBasic = this.fm.getMatchBasicData(this.matchId, this.matchDate);
    this.fm.getMVPCandidates(this.matchDate, this.matchId).take(1).subscribe(snapshots => {
      this.candidates = snapshots;
    });
    this.selectedMVP = "";
    this.initFeedbacks();
  }

  initFeedbacks() {
    // positive
    this.fbTags = [
      {key: "punctuality", value: false},
      {key: "activeness", value: false},
      {key: "competency", value: false},
      {key: "judgement", value: false}
    ];
  }

  selectFb(index) {
    this.fbTags[index].value = !this.fbTags[index].value;
  }

  setRating(index: number) {
    if (this.rating != index + 1)
    {
      this.initFeedbacks();
      this.rating = index + 1;
    }
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

  submit() {
    let tags = [];
    this.fbTags.forEach(t => {
      if (t.value)
        tags.push(t.key);
    })

    this.fm.voteReferee(this.matchDate, this.matchId, this.rating, tags);
    this.fm.voteMvp(this.matchDate, this.matchId, this.selectedMVP);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
