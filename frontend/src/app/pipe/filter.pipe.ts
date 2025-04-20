import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
/**
 * Bộ lọc theo text
 *
 * @example
 * // <div *ngFor="let item of items | filter: 'searchText': 'fieldName'">{{ item }}</div>
 *
 * @export
 * @class FilterPipe
 */
// export class FilterPipe implements PipeTransform {
//   transform(items: any[], searchText: string, field1: string, field2?: string): any[] {
//     if (!items || !searchText) return items;

//     searchText = searchText.toLowerCase();

//     return items.filter((item) => {
//       const value1 = item[field1]?.toString().toLowerCase() || '';
//       const value2 = field2 ? item[field2]?.toString().toLowerCase() || '' : '';
//       return value1.includes(searchText) || value2.includes(searchText);
//     });
//   }
// }
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, fields: string[]): any[] {
    if (!items || !searchText || !fields?.length) return items;

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      // Kiểm tra từng trường trong danh sách
      return fields.some((field) => {
        const value = item[field]?.toString().toLowerCase() || '';
        return value.includes(searchText);
      });
    });
  }
}
