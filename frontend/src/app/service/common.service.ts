import { Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(protected toastr: ToastrService) {}

  /**
   * Shows success push thông báo [thành công] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   */
  showSuccess(message: string, title?: string) {
    this.toastr.success(message, title, { timeOut: 3000 });
  }
  /**
   * Shows success push thông báo [thất bại] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   */
  showError(message: string, title?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toast: ActiveToast<any> = this.toastr.error(message, title, {
      timeOut: 5000,
    });
    return toast;
  }
  /**
   * Shows success push thông báo [thông tin] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   */
  showInfo(message: string, title?: string) {
    this.toastr.info(message, title, { timeOut: 6000 });
  }
  /**
   * Shows success push thông báo [cảnh báo] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   */
  showWarning(message: string, title?: string) {
    this.toastr.warning(message, title, { timeOut: 6000 });
  }
}
