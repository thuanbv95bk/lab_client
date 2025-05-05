import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})
export class DialogConfirmComponent {
  /** Nội dung muốn hiển thị , dạng message */
  @Input() message: string = '';
  /** confirm emit*/
  @Output() confirm = new EventEmitter<boolean>();

  /** emit ta ngoài
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  onConfirm(result: boolean) {
    this.confirm.emit(result);
  }
}
