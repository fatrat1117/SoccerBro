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