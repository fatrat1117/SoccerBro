import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

import {Localization} from '../providers/localization';

@Pipe({
  name: 'momentPipe'
})

export class MomentPipe implements PipeTransform {
  constructor(private local: Localization) {
    moment.updateLocale('en', {
      weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    });
    
    moment.updateLocale('zh', {
      weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      weekdaysShort: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    })

    moment.locale(local.langCode);
  }

  transform(timestamp: number) {
    console.log(timestamp);
    
    return moment(timestamp).calendar(null, {
      sameDay: `[${this.local.getString('Today')}] HH:mm`,
      lastDay: `[${this.local.getString('Yesterday')}]  HH:mm`,
      lastWeek: 'ddd HH:mm',
      nextDay: `[${this.local.getString('Tomorrow')}] HH:mm`,
      nextWeek: 'ddd HH:mm',
      sameElse: 'M/DD/YY HH:mm'
    });
  }
}

@Pipe({
  name: 'stringToDatePipe'
})

export class StringToDatePipe implements PipeTransform {

  transform(timestamp: string) {
    let t = Number(timestamp);
    console.log(t);
    return moment(t).format('M/DD');
  }
}

@Pipe({
  name: 'numberToTimePipe'
})

export class NumberToTimePipe implements PipeTransform {
  transform(timestamp) {
    return moment(timestamp).format('LT');
  }
}