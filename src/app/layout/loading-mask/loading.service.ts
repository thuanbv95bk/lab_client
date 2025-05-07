import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/** LoadingService get/set loading
 * @Author thuan.bv
 * @Created 05/05/2025
 * @Modified date - user - description
 */
export class LoadingService {
  /** Subject lưu trạng thái loading (true: hiển thị, false: ẩn) */
  private loading = new BehaviorSubject<boolean>(false);

  /**  Trả về Observable để component khác có thể lắng nghe trạng thái loading
   * @Author thuan.bv
   * @Created 05/05/2025
   * @Modified date - user - description
   */

  getLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  /** Cập nhật trạng thái loading (hiển thị hoặc ẩn loading mask)
   * @Author thuan.bv
   * @Created 05/05/2025
   * @Modified date - user - description
   */

  setLoading(isShow: boolean) {
    this.loading.next(isShow);
  }
}
