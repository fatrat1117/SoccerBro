import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {AccountManager} from '../../providers/account-manager';
import {transPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';

@Component({
  templateUrl: 'build/pages/feedback/feedback.html',
  pipes: [transPipe]
})
export class FeedbackPage {
  feedbackContent = '';

  constructor(private fm : FirebaseManager, private nav : NavController,
  private am: AccountManager, private local: Localization) {
    
  }

  submit() {
    this.fm.sendFeedback(this.feedbackContent.trim());
    this.am.showToast(this.local.getString('FeedbackMsg'));
    this.nav.pop();
  }
}
