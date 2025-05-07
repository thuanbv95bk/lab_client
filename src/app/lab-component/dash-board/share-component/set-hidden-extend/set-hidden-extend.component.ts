import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-set-hidden-extend',
  templateUrl: './set-hidden-extend.component.html',
  styleUrls: ['./set-hidden-extend.component.css'],
})
/** Component chọn ẩn hiện
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class setHiddenExtendComponent {
  @Input() isVisible!: boolean; // true: hiển thị ;false : ẩn đi
  @Output() isVisibleChange = new EventEmitter<boolean>(); // Phát sự kiện ra ngoài

  /** Đảo trạng thái ẩn/hiện, emit sự kiện ra ngoài
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggle() {
    this.isVisible = !this.isVisible;
    this.isVisibleChange.emit(this.isVisible);
  }
}
