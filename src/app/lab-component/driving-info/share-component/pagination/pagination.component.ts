import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppGlobals } from '../../../../app-global';
import { PagingModel } from '../../../../app-model/paging';
import { DialogConfirmService } from '../../../../app-dialog-component/dialog-confirm/dialog-confirm.service';
import { messageConfirm } from '../../model/hrm-employees.model';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})

/** Component dùng để phân trang dữ liệu trong table
 * @Author thuan.bv
 * @Created 07/05/2025
 * @Modified date - user - description
 */
export class PaginationComponent implements OnChanges {
  /** Hằng sô set mặc định số item có mặt ở phân trang */
  private static readonly MAX_VISIBLE_PAGES = 5;

  /** PagingModel lưu các giá trị của phân trang */
  @Input() pagingModel: PagingModel;

  /** PagingModel lưu các giá trị của phân trang */
  @Input() isChangeData: boolean = false;
  /** EventEmitter output các thông số của paging ra ngoài */
  @Output() page = new EventEmitter<PagingModel>();

  /** EventEmitter output sự kiện reload data */
  @Output() reload = new EventEmitter<void>();

  /** lưu các giá trị của phân trang */
  pageEvent = new PagingModel();

  /** lây pageSizeOptions ở local*/
  appGlobals = AppGlobals;

  Math = Math;
  constructor(private dialogConfirm: DialogConfirmService) {}

  /** theo dõi sự thay đỗi thông số pagingModel
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagingModel']) {
      this.updatePageEvent();
    }
  }

  /** cập nhật sự kiện
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  private updatePageEvent(): void {
    this.pageEvent.pageSize = this.pagingModel.pageSize;
    this.pageEvent.pageIndex = this.pagingModel.pageIndex;
    this.totalPages;
    this.itemRange;
  }

  /** Tính toán Tổng số page
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */
  get totalPages(): number {
    const total = Math.ceil(this.pagingModel.length / this.pagingModel.pageSize);
    this.pageEvent.length = total;
    return total;
  }

  /** Tính toán range hiển thị
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */

  get itemRange(): string {
    const pageIndex = this.pagingModel.pageIndex == 0 ? 1 : this.pagingModel.pageIndex;
    const start = (pageIndex - 1) * this.pagingModel.pageSize + 1;
    const end = Math.min(pageIndex * this.pagingModel.pageSize, this.pagingModel.length);
    return `${start}-${end}/${this.pagingModel.length}`;
  }
  /** event set số dòng của 1 trang
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  async onItemsPerPageChange(event): Promise<void> {
    if (this.isChangeData) {
      const result = await this.dialogConfirm.confirm(messageConfirm);
      if (!result) {
        return;
      }
    }
    this.pagingModel.pageIndex = 1;
    this.pagingModel.pageSize = event;
    this.gotoEmit();
  }

  /** event emit ra ngoài, để loading lại data
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */
  async reloadData() {
    if (this.isChangeData) {
      const result = await this.dialogConfirm.confirm(messageConfirm);
      if (!result) {
        return;
      }
    }
    this.reload.emit();
  }

  /** tính toán pages , số lương page từ dữ liệu
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  getPages(): (number | string)[] {
    const totalPages = this.totalPages;
    // Chỉ hiển thị trang 1 nếu chỉ có 1 trang */
    if (totalPages <= 1) return [1];
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(PaginationComponent.MAX_VISIBLE_PAGES / 2);

    // Luôn hiển thị trang đầu
    if (this.pagingModel.pageIndex < 5) pages.push(1);

    // Tính toán range hiển thị
    let startPage = Math.max(2, this.pagingModel.pageIndex - halfVisible);
    let endPage = Math.min(this.totalPages - 1, this.pagingModel.pageIndex + halfVisible);

    // Đảm bảo luôn hiển thị đủ 5 trang (nếu đủ)
    if (this.pagingModel.pageIndex <= halfVisible + 1) {
      endPage = Math.min(PaginationComponent.MAX_VISIBLE_PAGES, this.totalPages - 1);
    } else if (this.pagingModel.pageIndex >= this.totalPages - halfVisible) {
      startPage = Math.max(2, this.totalPages - PaginationComponent.MAX_VISIBLE_PAGES + 1);
    }

    //Thêm dấu ... nếu cần

    if (startPage > 2) {
      pages.push('...');
    }

    // Thêm các trang trong khoảng
    for (let i = startPage; i <= endPage; i++) {
      if (pages.length >= PaginationComponent.MAX_VISIBLE_PAGES) break;
      else pages.push(i);
    }

    // Thêm dấu ... nếu cần
    if (endPage < this.totalPages - 1) {
      pages.push('...');
    }

    //  Luôn hiển thị trang cuối (nếu có nhiều hơn 1 trang)
    if (this.totalPages - startPage <= PaginationComponent.MAX_VISIBLE_PAGES) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  /** chuyển đến 1 trang khác, emit để load lại dữ liệu
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  async goToPage(page: number | string, event: Event): Promise<void> {
    event.preventDefault();
    if (this.isChangeData) {
      const result = await this.dialogConfirm.confirm(messageConfirm);
      if (!result) {
        return;
      }
    }
    if (typeof page === 'number' && page !== this.pagingModel.pageIndex) {
      this.pagingModel.pageIndex = page;
      this.gotoEmit();
    }
  }

  /** Chuyển đến page đầu tiên
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  goToFirstPage(event: Event): void {
    this.goToPage(1, event);
  }

  /** Chuyển đến page cuối cùng
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */
  goToLastPage(event: Event): void {
    this.goToPage(this.totalPages, event);
  }

  /** Chuyển đến page kế tiếp
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */
  goToNextPage(event: Event): void {
    const nextPage = Math.min(this.pagingModel.pageIndex + 1, this.totalPages);
    this.goToPage(nextPage, event);
  }
  /** Chuyển đến page sau đó
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */
  goToPrevPage(event: Event): void {
    const prevPage = Math.max(this.pagingModel.pageIndex - 1, 1);
    this.goToPage(prevPage, event);
  }

  /** Emit các thay đỗi paging ra ngoài
   * @Author thuan.bv
   * @Created 07/05/2025
   * @Modified date - user - description
   */
  gotoEmit() {
    this.pageEvent.pageSize = this.pagingModel.pageSize;
    this.pageEvent.pageIndex = this.pagingModel.pageIndex - 1;
    this.page.emit({ ...this.pageEvent });
  }
}
