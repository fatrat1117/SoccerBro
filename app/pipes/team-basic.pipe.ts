import {Pipe, PipeTransform} from '@angular/core';

import {FirebaseManager} from '../providers/firebase-manager';
 
@Pipe({
  name: 'teamBasicPipe'
})

export class TeamBasicPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(id: string) {
    //console.log('team basic pipe', id);
    return this.fm.getTeamBasic(id);
  }
}

@Pipe({
  name: 'reverseAndCountTeamPipe'
})

export class ReverseAndCountTeamPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(arr) {
    if (arr)
      {
        this.fm.totalTeams = arr.length;
        return arr.reverse(); 
      }
  }
}