import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})

/**  Bộ lọc theo text
 * @param searchText : key search
 * @param fields[]: string[]
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
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
