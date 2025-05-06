import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})
export class DialogConfirmComponent implements AfterViewInit {
  /** Nội dung muốn hiển thị , dạng message */
  @Input() message: string = '';

  /** confirm emit*/
  @Output() confirm = new EventEmitter<boolean>();

  @ViewChild('confirmBtn', { static: true }) confirmBtn!: ElementRef;
  @ViewChild('exitBtn', { static: true }) exitBtn!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      this.confirmBtn.nativeElement.focus();
    });
  }
  /** focus qua lại giữa 2 nút
   * @Author thuan.bv
   * @Created 06/05/2025
   * @Modified date - user - description
   */

  handleKeydown(event: KeyboardEvent, btn: 'confirm' | 'exit') {
    if (event.key === 'Tab') {
      if (btn === 'exit' && !event.shiftKey) {
        // Tab trên Thoát → quay lại Đồng ý
        event.preventDefault();
        this.confirmBtn.nativeElement.focus();
      }
      if (btn === 'confirm' && event.shiftKey) {
        // Shift+Tab trên Đồng ý → quay lại Thoát
        event.preventDefault();
        this.exitBtn.nativeElement.focus();
      }
    }
  }

  /** emit ra ngoài
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  onConfirm(result: boolean) {
    this.confirm.emit(result);
  }
}
