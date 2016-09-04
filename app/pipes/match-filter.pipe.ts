import {Pipe, PipeTransform} from '@angular/core';

import {FirebaseManager} from '../providers/firebase-manager';
import * as moment from 'moment';

@Pipe({
  name: 'matchFilterPipe'
})

export class MatchFilterPipe implements PipeTransform {
  transform(matches: any[]) {
    if (matches) {
      let today = moment({ hour: 0 }).valueOf();
      return matches.filter(match => match.time > today);
    }
  }
}