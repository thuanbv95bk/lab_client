import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable, tap } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

/** LoadingInterceptor  loading-mark
 * @Author thuan.bv
 * @Created 05/05/2025
 * @Modified date - user - description
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  /** Đếm số lượng request đang xử lý */
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /** Kiểm tra header để bỏ qua loading */
    const noLoadingMark = req.headers.has('no-loading-mark');

    /** Nếu có header 'no-loading-mark', không bật loading */
    if (noLoadingMark) {
      return next.handle(req);
    }

    /** Tăng số lượng request */
    this.totalRequests++;
    /** Hiển thị loading */
    this.loadingService.setLoading(true);

    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          /** Khi nhận được response cuối cùng (type 4 =Response ), giảm số lượng request */
          if (event.type === 4) {
            /** response cuối cùng đã nhận được từ server (tức là request đã hoàn thành). */
            this.decreaseRequests();
          }
        },
        /** Khi có lỗi, giảm số lượng request */
        error: () => {
          this.decreaseRequests();
        },
      })
    );
  }
  /** Giảm số lượng request và tắt loading nếu không còn request nào
   * @Author thuan.bv
   * @Created 05/05/2025
   * @Modified date - user - description
   */

  private decreaseRequests() {
    if (this.totalRequests > 0) {
      this.totalRequests--;
    }
    if (this.totalRequests === 0) {
      this.loadingService.setLoading(false);
    }
  }
}
