import { Directive, ElementRef, Input } from '@angular/core';
import { Content, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import { Subscription } from 'rxjs/rx';

@Directive({
  selector: '[keyboardAttach]'
})
export class KeyboardAttachDirective {
  @Input('keyboardAttach') content: Content;

  private onShowSubscription: Subscription;
  private onHideSubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    private platform: Platform
  ) {
    if (this.platform.is('cordova') && this.platform.is('ios')) {
      this.onShowSubscription = Keyboard.onKeyboardShow().subscribe(e => this.onShow(e));
      this.onHideSubscription = Keyboard.onKeyboardHide().subscribe(() => this.onHide());
    }
  }

  ngOnDestroy() {
    if (this.onShowSubscription) {
      this.onShowSubscription.unsubscribe();
    }
    if (this.onHideSubscription) {
      this.onHideSubscription.unsubscribe();
    }
  }

  private onShow(e) {
    let keyboardHeight: number = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
    this.setElementPosition(keyboardHeight);
  };

  private onHide() {
    this.setElementPosition(0);
  };

  private setElementPosition(pixels: number) {
    this.elementRef.nativeElement.style.paddingBottom = pixels + 'px';
    this.content.resize();
  }
}