import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';

@Component({
  templateUrl: 'build/pages/feedback/feedback.html'
})
export class FeedbackPage {
  feedbackContent = '';

  constructor(private fm : FirebaseManager, 
  private nav : NavController) {
    
  }

  submit() {
    this.nav.pop();
  }
}
