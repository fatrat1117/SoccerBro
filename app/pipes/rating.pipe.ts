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
  constructor(private loc : Localization) {}

  transform(rating: number) {
    if (rating >=5)
      return this.loc.getString("Giveacompliment") + '?';
    else
      return this.loc.getString("Whatwentwrong") + '?';
  }
}

@Pipe({
  name: 'ratingTagPipe'
})

export class RatingTagPipe implements PipeTransform {
  positiveTags = {}
  negtiveTags = {}

  constructor(loc : Localization) {
    // positive
    this.positiveTags["punctuality"] = loc.getString("Punctual");
    this.positiveTags["activeness"] = loc.getString("Active");
    this.positiveTags["competency"] = loc.getString("Competent");
    this.positiveTags["judgement"] = loc.getString("WellJudged");

    // negtive
    this.negtiveTags["punctuality"] = loc.getString("Notontime");
    this.negtiveTags["activeness"] = loc.getString("Inactive");
    this.negtiveTags["competency"] = loc.getString("Incapable");
    this.negtiveTags["judgement"] = loc.getString("Unfair");
  }

  transform(key: string, rating: number) {
    if (rating >= 5)
      return this.positiveTags[key];
    else
      return this.negtiveTags[key];
  }
}