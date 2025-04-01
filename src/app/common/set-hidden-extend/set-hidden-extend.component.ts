import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-set-hidden-extend',
  templateUrl: './set-hidden-extend.component.html',
  styleUrls: ['./set-hidden-extend.component.css'],
})
export class setHiddenExtendComponent {
  @Input()
  isVisible!: boolean; // true: hiển thị ;false : ẩn đi
  // @Output() isVisibleChange = new EventEmitter<boolean>(); // Phát sự kiện ra ngoài

  // toggle() {
  //   this.isVisible = !this.isVisible;
  //   this.isVisibleChange.emit(this.isVisible);
  // }
}
