import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading-mask',
  templateUrl: './loading-mask.component.html',
  styleUrls: ['./loading-mask.component.scss'],
})
export class LoadingMaskComponent implements OnInit {
  /**T rạng thái hiển thị loading mask */
  isLoading: boolean = false;
  /**  Đăng ký lắng nghe trạng thái loading */
  loadingSubscription: Subscription;

  constructor(private loadingService: LoadingService) {}

  /** Đăng ký lắng nghe thay đổi trạng thái loading từ service
   * @Author thuan.bv
   * @Created 05/05/2025
   * @Modified date - user - description
   */

  ngOnInit() {
    this.loadingSubscription = this.loadingService.getLoading().subscribe((newLoading) => {
      setTimeout(() => {
        /**  Cập nhật trạng thái loading */
        this.isLoading = newLoading;
      });
    });
  }

  /** Hủy đăng ký khi component bị destroy để tránh rò rỉ bộ nhớ
   * @Author thuan.bv
   * @Created 05/05/2025
   * @Modified date - user - description
   */

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
