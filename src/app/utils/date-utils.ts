import { Validators } from '@angular/forms';

// Validators.pattern
export const datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);
/** chuyển date về định dạng chuẩn
 * @Author thuan.bv
 * @Created 26/04/2025
 * @Modified date - user - description
 */
export function parseDate(str: string | Date): Date | null {
  if (!str) return null;
  if (str instanceof Date) return str;
  if (typeof str === 'string') {
    const parts = str.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day);
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** Định dạng ngày thành 'dd/MM/yyyy'
 * @Author thuan.bv
 * @Created 26/04/2025
 * @Modified date - user - description
 */

export function formatDate(date: Date): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Kiểm tra chuỗi date hợp lệ
 * @Author thuan.bv
 * @Created 26/04/2025
 * @Modified date - user - description
 */
export function isValidDateString(str: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(str)) return false;
  const [day, month, year] = str.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** Hàm chuyển đỗi kiểu date dạng string => date đầy đủ
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */

export function toISODateString(dateStr: string): string | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/').map(Number);

  if (!day || !month || !year) return null;
  /** Trả về dạng yyyy-MM-dd (không có giờ, không bị lệch timezone) */
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
/** Chuyển đổi giá trị ban đầu sang chuỗi
 * @param value
 * @Author thuan.bv
 * @Created 26/04/2025
 * @Modified date - user - description
 *
 *
 */

export function convertInitialValue(inputType: string, value: Date | string): string {
  if (inputType === 'date') {
    // Giữ nguyên null/undefined/empty/placeholder
    if (!value || value === '' || value === 'dd/MM/yyyy') {
      return '';
    }

    if (value instanceof Date) {
      // Nếu là Date, kiểm tra hợp lệ và format, không hợp lệ thì trả về toString()
      return isNaN(value.getTime()) ? value.toString() : formatDate(value);
    }

    const strVal = String(value);

    // Nếu là dạng dd/MM/yyyy thì giữ nguyên
    if (isValidDateString(strVal)) {
      return strVal;
    }

    // Nếu là dạng ISO (yyyy-MM-ddTHH:mm:ss)
    const isoMatch = strVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [_, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }

    // Trả về chính giá trị gốc nếu không match format nào
    return strVal;
  }

  return String(value ?? '');
}

/** hàm kiểm tra hợp lệ cho minDate/maxDate
 * @Author thuan.bv
 * @Created 26/04/2025
 * @Modified date - user - description
 */

export function isValidDateInput(date: Date | string): boolean {
  if (!date) return false;
  if (date instanceof Date && !isNaN(date.getTime())) return true;
  if (typeof date === 'string' && isValidDateString(date)) return true;
  return false;
}
/** Thêm số 0 đằng trước nếu cần
 * @Author thuan.bv
 * @Created 26/04/2025
 * @Modified date - user - description
 */

export function pad(num: number): string {
  return num.toString().padStart(2, '0');
}
