import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-dialog-handle-error',
  templateUrl: './dialog-handle-error.component.html',
  styleUrls: ['./dialog-handle-error.component.scss'],
})
export class DialogHandleErrorComponent implements AfterViewInit {
  data: any;

  // Sử dụng ViewChild để truy cập phần tử modal
  @ViewChild('errorDialog') modalElement: any;

  constructor() {}

  ngAfterViewInit() {
    // Đảm bảo modalElement được khởi tạo sau khi Angular render DOM
    if (this.modalElement) {
      const modal = new bootstrap.Modal(this.modalElement.nativeElement);
      modal.show(); // Mở modal
    }
  }

  openDialog(data: any) {
    console.log(data);
    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    this.data = data;
    modal.show(); // Mở modal
    // Sử dụng ViewChild để lấy phần tử modal và mở nó
    if (this.modalElement) {
      console.log('xxxx');
      const modal = new bootstrap.Modal(this.modalElement.nativeElement);
      modal.show(); // Mở modal
    }
  }

  closeDialog() {
    // Đóng modal
    if (this.modalElement) {
      const modal = new bootstrap.Modal(this.modalElement.nativeElement);
      modal.hide(); // Đóng modal
    }
  }
}
