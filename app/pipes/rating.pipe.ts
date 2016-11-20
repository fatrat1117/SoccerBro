import {Pipe, PipeTransform} from '@angular/core';
import {Localization} from '../providers/localization';

@Pipe({
  name: 'ratingDescPipe'
})

export class RatingDescPipe implements PipeTransform {
  constructor(loc : Localization) {
    this.descriptions = [loc.getString("Terrible"), 
    loc.getString("Bad"), 
    loc.getString("OK"), 
    loc.getString("Good"), 
    loc.getString("Excellent")];
  }

  descriptions; 
  transform(rating: number) {
    return this.descriptions[rating - 1];
  }
}

@Pipe({
  name: 'ratingHeaderPipe'
})

export class RatingHeaderPipe implements PipeTransform {
  transform(rating: number) {
    if (rating >=5)
      return "Give a compliment?";
    else
      return "What went wrong?";
  }
}

@Pipe({
  name: 'ratingTagPipe'
})

export class RatingTagPipe implements PipeTransform {
  positiveTags = {}
  negtiveTags = {}

  constructor() {
    // positive
    this.positiveTags["punctuality"] = "Punctual";
    this.positiveTags["activeness"] = "Active";
    this.positiveTags["competency"] = "Competent";
    this.positiveTags["judgement"] = "Well-Judged";

    // negtive
    this.negtiveTags["punctuality"] = "Not on time";
    this.negtiveTags["activeness"] = "Inactive";
    this.negtiveTags["competency"] = "Incapable";
    this.negtiveTags["judgement"] = "Unfair";
  }

  transform(key: string, rating: number) {
    if (rating >= 5)
      return this.positiveTags[key];
    else
      return this.negtiveTags[key];
  }
}