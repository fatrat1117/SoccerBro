import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ratingDescPipe'
})

export class RatingDescPipe implements PipeTransform {
  descriptions = ["Terrible", "Bad", "OK", "Good", "Excellent"]
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
    console.log(this.positiveTags);
    
    if (rating >= 5)
      return this.positiveTags[key];
    else
      return this.negtiveTags[key];
  }
}