import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.scss'],
})

/** Component dùng chung- dùng để nhập tìm kiếm, theo input
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class TextSearchComponent {
  /** placeholder hiển thị */
  @Input() placeholder: string;

  /** searchField tìm kiếm trong nhóm cột */
  searchField: string;

  @Output() searchFieldChange = new EventEmitter<string>();

  /** emit sự kiên ra ngoài khi ng dùng gõ input
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  changeInput() {
    this.searchFieldChange.emit(this.searchField);
  }
}
