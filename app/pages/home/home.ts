import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController) {
  
  }

  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "https://firebasestorage.googleapis.com/v0/b/stk-soccer.appspot.com/o/banners%2Fzh%2Fflyer_zh.png?alt=media&token=0479aa46-1b35-475c-8c8a-e184527541a0",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "https://firebasestorage.googleapis.com/v0/b/stk-soccer.appspot.com/o/banners%2Fzh%2Fstk_zh.jpg?alt=media&token=fcb7c61c-7d9b-407e-9305-5c516b840e1e",
    },
  ];

  adSlideOptions = {
    autoplay: 3000,
    loop: true
  };
}
