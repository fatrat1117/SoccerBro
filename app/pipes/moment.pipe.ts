import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

import {Localization} from '../providers/localization';

@Pipe({
  name: 'momentPipe'
})

export class MomentPipe implements PipeTransform {
  constructor(private local: Localization) {
  }

  transform(timestamp: number) {
    return moment(timestamp).calendar(null, {
      sameDay: `[${this.local.getString('Today')}] h:mm A`,
      nextDay: `[${this.local.getString('Tomorrow')}] h:mm A`,
      nextWeek: 'ddd h:mm A',
      sameElse: 'MM/DD h:mm A'
    });
  }
}