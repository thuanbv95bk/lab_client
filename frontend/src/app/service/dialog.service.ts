import { Injectable } from '@angular/core';
import { DialogHandleErrorComponent } from '../common/base-component/dialog-handle-error/dialog-handle-error.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor() {}

  // Hàm để mở modal và truyền dữ liệu vào
  openErrorDialog(data: any) {
    const modalComponent = new DialogHandleErrorComponent();
    // modalComponent.openDialog(data);
    return modalComponent; // Trả về để có thể theo dõi khi đóng
  }
}
