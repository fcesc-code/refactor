import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, ...args: number[]): unknown {
    let dd: number;
    let mm: number;
    let yyyy: number;
    let ddFormat: string;
    let mmFormat: string;
    let newFormat: string = '';

    let dateTransform = new Date(value);
    let type: number = args[0];

    dd = dateTransform.getDate();
    mm = dateTransform.getMonth() + 1;
    yyyy = dateTransform.getFullYear();

    ddFormat = this.needZero(dd);
    mmFormat = this.needZero(mm);

    if (type === 1) {
      newFormat = ddFormat + mmFormat + yyyy;
    }
    if (type === 2) {
      newFormat = ddFormat + ' / ' + mmFormat + ' / ' + yyyy;
    }
    if (type === 3) {
      newFormat = ddFormat + '/' + mmFormat + '/' + yyyy;
    }
    if (type === 4) {
      newFormat = yyyy + '-' + mmFormat + '-' + ddFormat;
    }

    return newFormat;
  }

  private needZero(checkNumber: number): string {
    return checkNumber < 10 ? '0' + checkNumber : String(checkNumber);
  }
}
