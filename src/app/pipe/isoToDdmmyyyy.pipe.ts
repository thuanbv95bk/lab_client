import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isoToDdmmyyyy' })
export class IsoToDdmmyyyyPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    let date: Date;
    if (typeof value === 'string') {
      // Nếu là dạng dd/MM/yyyy thì trả về luôn
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
      date = new Date(value);
    } else {
      date = value;
    }
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
