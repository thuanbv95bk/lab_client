import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

@Injectable({
  providedIn: 'root',
})

/** ghi đè NgbDatepicker của bootstrap
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
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
