import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {AccountManager} from '../../providers/account-manager';
import {transPipe} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/feedback/feedback.html'
})
export class FeedbackPage {
  feedbackContent = '';

  constructor(private fm : FirebaseManager, 
  private nav : NavController,
  private am: AccountManager) {
    
  }

  submit() {
    this.fm.sendFeedback(this.feedbackContent.trim());
    this.am.showToast('Thanks for your feedback!');
    this.nav.pop();
  }
}
