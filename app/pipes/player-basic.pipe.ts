import {Pipe, PipeTransform} from '@angular/core';

import {FirebaseManager} from '../providers/firebase-manager';
 
@Pipe({
  name: 'playerBasicPipe'
})

export class PlayerBasicPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(id: string) {
    return this.fm.getPlayerBasic(id);
  }
}

@Pipe({
  name: 'playerDetailPipe'
})

export class playerDetailPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(id: string) {
    return this.fm.getPlayerDetail(id);
  }
}