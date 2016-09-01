import {Pipe, PipeTransform} from '@angular/core';

import {FirebaseManager} from '../providers/firebase-manager';
 
@Pipe({
  name: 'matchInfoPipe'
})

export class MatchInfoPipe implements PipeTransform {
  constructor(private fm: FirebaseManager) {

  }

  transform(teamId: string, matchId: string) {
    return this.fm.getMatchInfo(teamId, matchId);
  }
}