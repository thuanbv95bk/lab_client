import { Component, Input } from '@angular/core';
import { SearchOption } from '../../model/hrm-employees.model';

/** dùng để tạo menu chon các lựu chọn để tìm kiếm
 * @Author thuan.bv
 * @Created 29/04/2025
 * @Modified date - user - description
 */
interface DropdownItem {
  /** mã */
  code: string;
  /** Tên hiên thi ở menu */
  name: string;
  /** placeholder */
  placeholder: string;
}
@Component({
  selector: 'app-input-search-option',
  templateUrl: './input-search-option.component.html',
  styleUrls: ['./input-search-option.component.scss'],
})

/** Component  InputSearchOption tìm kiếm theo các tiêu chí khác nhau, được set ở DropdownItem
 * có chọn nhiều, filter theo các displayField, theo nguoi dug set
 * @Author thuan.bv
 * @Created 07/05/2025
 * @Modified date - user - description
 */
export class InputSearchOptionComponent {
  /** placeholder hiển thị */
  @Input() title: string = 'Tìm kiếm';
  @Input() searchOption: SearchOption;
  placeholder: string = 'Nhập tên lái xe';

  /** lưu lựa chọn của người dùng, khi click */
  selectedOption: DropdownItem;

  /** Khởi tạo menu lựa chon */
  listOption: DropdownItem[] = [
    {
      code: 'displayName',
      name: 'Tên lái xe',
      placeholder: 'Nhập tên lái xe',
    },
    {
      code: 'driverLicense',
      name: 'GPLX',
      placeholder: 'Nhập giấy phép lái xe',
    },
  ];

  /** Khởi tạo các giá trị mặc định
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnInit(): void {
    // set giá trị mặc định
    this.selectedOption = this.listOption.find((x) => x.code == 'displayName');
    this.searchOption.key = this.selectedOption?.code;
    this.placeholder = this.selectedOption?.placeholder;
  }

  /** Sự kiện người dùng chọn option
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  selectDriver(driver: DropdownItem): void {
    this.selectedOption = driver;
    this.searchOption.key = this.selectedOption?.code;
    this.placeholder = this.selectedOption?.placeholder;
  }
}
