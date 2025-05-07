import { Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
/** CommonService các service dùng chung của app
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export class CommonService {
  constructor(protected toastr: ToastrService) {}

  /**Shows success push thông báo [thành công] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  showSuccess(message: string, title?: string) {
    this.toastr.success(message, title, { timeOut: 3000 });
  }

  /**Shows success push thông báo [thất bại] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  showError(message: string, title?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toast: ActiveToast<any> = this.toastr.error(message, title, {
      timeOut: 5000,
    });
    return toast;
  }

  /**Shows success push thông báo [thông tin] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  showInfo(message: string, title?: string) {
    this.toastr.info(message, title, { timeOut: 6000 });
  }

  /**Shows success push thông báo [cảnh báo] trên giao diện
   * @param message
   * @param [message]: Nội dung muốn thông báo
   * @param [title?] : tiêu đề
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  showWarning(message: string, title?: string) {
    this.toastr.warning(message, title, { timeOut: 6000 });
  }
}
