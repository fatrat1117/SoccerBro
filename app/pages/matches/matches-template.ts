import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { transPipe, Localization } from '../../providers/localization'
import { ScheduleMatchPage } from '../schedule-match/schedule-match';
import { FirebaseManager } from '../../providers/firebase-manager';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';
import { Subject } from 'rxjs/Subject';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import * as moment from 'moment';


@Component({
    selector: 'my-matches-page',
    templateUrl: 'build/pages/matches/matches-template.html',
    pipes: [transPipe, StringToDatePipe, NumberToTimePipe, TeamBasicPipe]
})
export class MatchesPageTemplate {

    dates: any;
    datesColorArray: any;
    currentSelectedDateIndex = 0;
    afMatches: any;
    dateSubject = new Subject();
    today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;

    constructor(private navCtrl: NavController,
        local: Localization,
        private modalController: ModalController,
        fm: FirebaseManager) {

        let self = this;
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
    }


    showScheduleMatchModal() {
        this.modalController.create(ScheduleMatchPage).present();
    }

    showMatches(date: string, i: number) {
        // console.log('currentSelectedDate', date);
        // console.log('lastSelectedDate',this.dates[this.currentSelectedDateIndex].$key);

        if (this.dates[this.currentSelectedDateIndex].$key === date) {
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