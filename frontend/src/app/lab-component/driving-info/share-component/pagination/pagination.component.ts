import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppGlobals } from '../../../../app-global';
import { PagingModel } from '../../../../app-model/paging';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  /** PagingModel lưu các giá trị của phân trang */
  @Input() pagingModel: PagingModel;

  /** EventEmitter output các thông số của paging ra ngoài */
  @Output() page = new EventEmitter<PagingModel>();

  /** EventEmitter output sự kiện reload data */
  @Output() reload = new EventEmitter<void>();

  /** lưu các giá trị của phân trang */
  pageEvent = new PagingModel();

  /** lây pageSizeOptions ở local*/
  appGlobals = AppGlobals;

  Math = Math;

  /** theo dõi sự thay đỗi thông số pagingModel
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagingModel']) {
      this.pageEvent.pageSize = this.pagingModel.pageSize;
      this.totalPages;
      this.itemRange;
    }
  }
  /** Tổng số page */
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
    const start = (this.pagingModel.pageIndex - 1) * this.pagingModel.pageSize + 1;
    const end = Math.min(this.pagingModel.pageIndex * this.pagingModel.pageSize, this.pagingModel.length);
    return `${start}-${end}/${this.pagingModel.length}`;
  }

  /** event set số dòng của 1 trang
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  onItemsPerPageChange(): void {
    this.pagingModel.pageIndex = 1;
    this.pageEvent.pageSize = this.pagingModel.pageSize;
    this.page.emit({ ...this.pageEvent });
  }

  /** event emit ra ngoài, để loading lại data
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */
  reloadData() {
    this.reload.emit();
  }

  /** tính toán pages , số lương page từ dữ liệu
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  getPages(): (number | string)[] {
    const totalPages = this.totalPages;
    /** // Chỉ hiển thị trang 1 nếu chỉ có 1 trang */
    if (totalPages <= 1) return [1];
    const pages: (number | string)[] = [];
    /** Luôn set mặc định 5 trang trên 1 dòng */
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    /** Luôn hiển thị trang đầu */
    if (this.pagingModel.pageIndex < 5) pages.push(1);

    /**Tính toán range hiển thị */
    let startPage = Math.max(2, this.pagingModel.pageIndex - halfVisible);
    let endPage = Math.min(this.totalPages - 1, this.pagingModel.pageIndex + halfVisible);

    /** Đảm bảo luôn hiển thị đủ 5 trang (nếu đủ) */
    if (this.pagingModel.pageIndex <= halfVisible + 1) {
      endPage = Math.min(maxVisiblePages, this.totalPages - 1);
    } else if (this.pagingModel.pageIndex >= this.totalPages - halfVisible) {
      startPage = Math.max(2, this.totalPages - maxVisiblePages + 1);
    }

    /**Thêm dấu ... nếu cần */

    if (startPage > 2) {
      pages.push('...');
    }

    /** Thêm các trang trong khoảng*/
    for (let i = startPage; i <= endPage; i++) {
      if (pages.length >= 5) break;
      else pages.push(i);
    }

    /** Thêm dấu ... nếu cần */
    if (endPage < this.totalPages - 1) {
      pages.push('...');
    }

    /**  Luôn hiển thị trang cuối (nếu có nhiều hơn 1 trang) */
    if (this.totalPages - startPage <= 5) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  /** chuyển đến 1 trang khác, emit để load lại dữ liệu
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */

  goToPage(page: number | string, event: Event): void {
    event.preventDefault();
    if (typeof page === 'number' && page !== this.pagingModel.pageIndex) {
      this.pagingModel.pageIndex = page;
      this.pageEvent.pageIndex = this.pagingModel.pageIndex;
      this.page.emit({ ...this.pageEvent });
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
}
