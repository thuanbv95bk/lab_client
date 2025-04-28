import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})
export class DialogConfirmComponent {
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<boolean>();
  onConfirm(result: boolean) {
    this.confirm.emit(result);
  }
}
