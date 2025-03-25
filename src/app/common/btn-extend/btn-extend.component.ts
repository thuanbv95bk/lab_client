import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-btn-extend',
  templateUrl: './btn-extend.component.html',
  styleUrls: ['./btn-extend.component.css'],
})
export class BtnExtendComponent {
  @Input() isVisible: boolean = true; // true: hiển thị ;false : ẩn đi
  @Output() isVisibleChange = new EventEmitter<boolean>(); // Phát sự kiện ra ngoài

  toggle() {
    this.isVisible = !this.isVisible;
    this.isVisibleChange.emit(this.isVisible);
  }
}
