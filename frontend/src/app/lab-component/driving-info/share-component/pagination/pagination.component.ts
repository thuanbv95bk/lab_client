import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppGlobals } from '../../../../app-global';
import { PageEvent, PagingModel } from '../../../../app-model/paging';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  // pageIndex: number = 1;
  // pageSize: number = 20;

  @Input() pagingModel: PagingModel;
  isLoading: boolean = false;

  pageEvent = new PagingModel();
  @Output() page = new EventEmitter<PagingModel>();

  @Output() reload = new EventEmitter<void>();

  appGlobals = AppGlobals;

  Math = Math; // Add this line to make Math available in template

  constructor() {
    // this.pageEvent.pageSize = this.pageSize;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagingModel']) {
      this.pageEvent.pageSize = this.pagingModel.pageSize;
      this.totalPages;
      this.itemRange;
    }
  }
  get totalPages(): number {
    const total = Math.ceil(this.pagingModel.length / this.pagingModel.pageSize);
    this.pageEvent.length = total;
    return total;
  }

  // Tính toán range hiển thị
  get itemRange(): string {
    const start = (this.pagingModel.pageIndex - 1) * this.pagingModel.pageSize + 1;
    const end = Math.min(this.pagingModel.pageIndex * this.pagingModel.pageSize, this.pagingModel.length);
    return `${start}-${end}/${this.pagingModel.length}`;
  }

  onItemsPerPageChange(): void {
    this.pagingModel.pageIndex = 1; // Reset to first page when items per page changes
    this.pageEvent.pageSize = this.pagingModel.pageSize;
    // console.log('this.itemsPerPage:' + this.pagingModel.pageSize);
    this.page.emit({ ...this.pageEvent });
  }

  reloadData() {
    this.reload.emit();
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Luôn hiển thị trang đầu
    if (this.pagingModel.pageIndex < 5) pages.push(1);

    // Tính toán range hiển thị
    let startPage = Math.max(2, this.pagingModel.pageIndex - halfVisible);
    let endPage = Math.min(this.totalPages - 1, this.pagingModel.pageIndex + halfVisible);

    // Đảm bảo luôn hiển thị đủ 5 trang (nếu đủ)
    if (this.pagingModel.pageIndex <= halfVisible + 1) {
      endPage = Math.min(maxVisiblePages, this.totalPages - 1);
    } else if (this.pagingModel.pageIndex >= this.totalPages - halfVisible) {
      startPage = Math.max(2, this.totalPages - maxVisiblePages + 1);
    }

    // Thêm dấu ... nếu cần
    if (startPage > 2) {
      pages.push('...');
    }

    // Thêm các trang trong khoảng
    for (let i = startPage; i <= endPage; i++) {
      if (pages.length >= 5) break;
      else pages.push(i);
    }

    // Thêm dấu ... nếu cần
    if (endPage < this.totalPages - 1) {
      pages.push('...');
    }

    // Luôn hiển thị trang cuối (nếu có nhiều hơn 1 trang)

    if (this.totalPages - startPage <= 5) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  goToPage(page: number | string, event: Event): void {
    event.preventDefault();
    if (typeof page === 'number' && page !== this.pagingModel.pageIndex) {
      this.pagingModel.pageIndex = page;
      this.pageEvent.pageIndex = this.pagingModel.pageIndex;
      this.page.emit({ ...this.pageEvent });
    }
  }

  goToFirstPage(event: Event): void {
    this.goToPage(1, event);
  }

  goToLastPage(event: Event): void {
    this.goToPage(this.totalPages, event);
  }

  goToNextPage(event: Event): void {
    const nextPage = Math.min(this.pagingModel.pageIndex + 1, this.totalPages);
    this.goToPage(nextPage, event);
  }

  goToPrevPage(event: Event): void {
    const prevPage = Math.max(this.pagingModel.pageIndex - 1, 1);
    this.goToPage(prevPage, event);
  }
}
