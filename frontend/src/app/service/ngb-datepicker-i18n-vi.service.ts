import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

@Injectable({
  providedIn: 'root',
})
export class NgbDatepickerI18nViService extends NgbDatepickerI18n {
  override getWeekdayLabel(weekday: number, width?: TranslationWidth.Wide): string {
    return WEEKDAYS[weekday - 1];
  }
  getWeekdayShortName(weekday: number): string {
    return WEEKDAYS[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return MONTHS[month - 1];
  }
  getMonthFullName(month: number): string {
    return MONTHS[month - 1];
  }
  getDayAriaLabel(date: import('@ng-bootstrap/ng-bootstrap').NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
