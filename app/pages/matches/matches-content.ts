import { Component, Input, ElementRef, OnInit, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { transPipe, Localization } from '../../providers/localization'
import { ScheduleMatchPage } from '../schedule-match/schedule-match';
import { MatchResultPage } from '../match-result/match-result';
import { FirebaseManager } from '../../providers/firebase-manager';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';
import { TournamentFilterPipe } from '../../pipes/match-filter.pipe';
import { Subject } from 'rxjs/Subject';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import * as moment from 'moment';


@Component({
  selector: 'matches-content',
  templateUrl: 'build/pages/matches/matches-content.html',
  pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe, TournamentFilterPipe]
})


export class MatchesPageContent implements OnInit {
  dates: any;
  datesColorArray: any;
  currentSelectedDateIndex = -1;
  afMatches: any;
  dateSubject = new Subject();
  today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
  selfId;
  afTournamentAdmin;

  @Input() tournamentId;
  @Input() rightViewTop;
  //@ViewChild('sketchElement') sketchElement:ElementRef;
  //@ContentChildren('list_item') items: Array<ElementRef>;


  constructor(private navCtrl: NavController,
    local: Localization,
    private modalController: ModalController,
    private fm: FirebaseManager) {
    this.afMatches = fm.queryMatches(this.dateSubject);
    this.selfId = fm.selfId;
  }

  ngOnInit() {
    console.log('matches tournamentId', this.tournamentId);

    let self = this;
    let afDates;
    if (this.tournamentId) {
      afDates = this.fm.getTournamentDateByTournamentId(this.tournamentId);
      this.afTournamentAdmin = this.fm.getTournamentAdmin(this.tournamentId);
    }
    else
      afDates = this.fm.getMatchDates();

    afDates.subscribe(dates => {
      self.dates = dates;
      self.initialDatesColorArray(self.dates);
      self.scrollToToday(self.dates);
    });
  }


  showMatches(date: string, i: number) {
    if (this.currentSelectedDateIndex != -1 && this.dates[this.currentSelectedDateIndex].$key === date) {
      return;
    }
    this.dateSubject.next(Number(date));
    this.setDatesColorArray(i);
    this.currentSelectedDateIndex = i;
  }

  popupUpdateSchedulePage(match, e) {
    e.stopPropagation();
    //if (this.fm.selfId && match.createBy === this.fm.selfId) {
    this.modalController.create(ScheduleMatchPage, {
      mId: match.$key
    }).present();
    //}
  }

  popupMatchResult(rawData, e) {
    e.stopPropagation();
    let isProcessed = "homeScore" in rawData;
    this.modalController.create(MatchResultPage, {
      rawData: rawData,
      isProcessed: isProcessed
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
  }

  getRightViewMarginBottom(itemNumber:number){
      if (itemNumber == 0){
        return 0;
      }else{
        return -1;
      }
  }

  scrollToToday(dates) {

    let self = this;
    setTimeout(function () {
      let iToday = -1;
      for (let i = 0; i < dates.length; ++i) {
        iToday = i;
        if (Number(dates[i].$key) >= self.today) {
          break;
        }
      }

      console.log('today index', iToday, self.today);

      if (iToday != -1) {
        let closeToToday = Number(dates[iToday].$key);
        console.log('date close to today', closeToToday);
        self.dateSubject.next(closeToToday);
        self.setDatesColorArray(iToday);
        self.currentSelectedDateIndex = iToday;

        let scrollableDiv = document.getElementById("sketchElement");
        if (scrollableDiv) {
          scrollableDiv.scrollTop = 0;
          //let scrollableItem = document.getElementById("matches-scroll-target-1");
          let scrollableItem = scrollableDiv.getElementsByTagName("ion-item");
          if (scrollableItem.length > 0) {
            scrollableDiv.scrollTop += scrollableItem[0].clientHeight * iToday;
          }
        }
      }

    }, 1000);
  }
}
