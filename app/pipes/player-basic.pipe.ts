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

export class PlayerDetailPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(id: string) {
    return this.fm.getPlayerDetail(id);
  }
}

@Pipe({
  name: 'reversePipe'
})

export class ReversePipe implements PipeTransform {
  transform(arr) {
    if (arr)
      {
        //console.log('list arr len', arr.length);
        return arr.reverse(); 
      }
  }
}

@Pipe({
  name: 'reverseAndCountPlayerPipe'
})

export class ReverseAndCountPlayerPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(arr) {
    if (arr)
      {
        this.fm.totalPlayers = arr.length;
        console.log('reverse player count', arr.length);
        return arr.reverse(); 
      }
  }
}