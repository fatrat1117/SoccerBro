import { Component, Input} from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { transPipe, Localization } from '../../providers/localization'
import { ScheduleMatchPage } from '../schedule-match/schedule-match';
import { FirebaseManager } from '../../providers/firebase-manager';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';
import { Subject } from 'rxjs/Subject';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import * as moment from 'moment';

@Component({
  selector: 'matches-content',
  templateUrl: 'build/pages/matches/matches-content.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})


export class MatchesPageContent {
  fireBaseManager:any;
  dates: any;
  datesForLeagues:any;
  datesColorArray: any;
  currentSelectedDateIndex = -1;
  afMatches: any;
  dateSubject = new Subject();
  afMatchesBytournamentId: any;
  today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;

  @Input() tournamentId = "";

  constructor(private navCtrl: NavController,
              local: Localization,
              private modalController: ModalController,
              fm: FirebaseManager) {


    let self = this;
    self.fireBaseManager = fm;
    fm.getMatchDates().subscribe(dates => {
      self.dates = dates;
      self.initialDatesColorArray(self.dates);
      //console.log(dates);
      setTimeout(function () {
        console.log('show today', self.today);
        self.dateSubject.next(self.today);
      }, 1000);
    });
    this.afMatches = fm.queryMatches(this.dateSubject);
    this.afMatches.subscribe(snapshots => {
      console.log(snapshots);
      snapshots.forEach(snapshot => {
        console.log(snapshot);
      });
    });

    //console.log('matches tournamentId', this.tournamentId);
    // setTimeout(function () {
    //   console.log('matches tournamentId', this.tournamentId);
    // }, 10000);


  }

  ngAfterViewInit() {
    this.getDatesByTournamentId();
    this.getMatcheByTournamentId();
    this.testLoad();
  }

  testLoad(){
    console.log("hahahahaha");
  }

  getMatcheByTournamentId(){

    this.afMatchesBytournamentId = this.fireBaseManager.getMatchesByTournamentId(this.tournamentId);
    this.afMatchesBytournamentId.subscribe(matches => {
      console.log(matches);
      // matches.forEach(match => {
      //   console.log(match.date);
      // });
    });
  }

  getDatesByTournamentId(){
    var tempObserverObject = this.fireBaseManager.getTournamentDateByTournamentId(this.tournamentId);
    tempObserverObject.subscribe(datesForLeagues =>{
        this.datesForLeagues = datesForLeagues;
         console.log("DATES here==>",datesForLeagues);
    })
  }

  showScheduleMatchModal() {
    this.modalController.create(ScheduleMatchPage).present();
  }

  showMatches(date: string, i: number) {

    if (this.currentSelectedDateIndex != -1 && this.dates[this.currentSelectedDateIndex].$key === date) {
      return;
    }
    this.dateSubject.next(Number(date));
    this.setDatesColorArray(i);
    this.currentSelectedDateIndex = i;
  }

  popupUpdateSchedulePage(matchId) {
    this.modalController.create(ScheduleMatchPage, {
      mId: matchId
    }).present();
  }

  initialDatesColorArray(dates: any) {
    this.datesColorArray = new Array(dates.length);
    // if (this.datesColorArray.length > 0){
    //   this.datesColorArray[0] = "#2E9008";
    // }
    for (var i = 0; i < this.datesColorArray.length; i++) {
      if (this.dates[i].$key === this.today) {
        this.datesColorArray[i] = "#2E9008";
        this.currentSelectedDateIndex = i;
      }
      this.datesColorArray[i] = "none";
    }
  }

  setDatesColorArray(index: number) {
    for (var i = 0; i < this.datesColorArray.length; i++) {
      if (index === i) {
        this.datesColorArray[i] = "#2E9008";
      } else {
        this.datesColorArray[i] = "none";
      }
    }
  }

  getDateTabBGColor(date: string) {
    for (let i in this.dates) {
      if (this.dates[i] === date) {
        return this.datesColorArray[i];
      }
    }
    return;
  }


}
