import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppGlobals } from '../../../../app-global';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 20;
  @Input() totalItems: number = 0;
  @Input() isLoading: boolean = false;
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() reload = new EventEmitter<void>();
  appGlobals = AppGlobals;
  Math = Math; // Add this line to make Math available in template

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Tính toán range hiển thị
  get itemRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}/${this.totalItems}`;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Reset to first page when items per page changes
    this.itemsPerPageChange.emit(this.itemsPerPage);
    this.pageChange.emit(1);
  }
  reloadData() {
    if (!this.isLoading) {
      this.reload.emit();
    }
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    console.log('halfVisible ' + halfVisible);

    // Luôn hiển thị trang đầu
    if (this.currentPage < 5) pages.push(1);

    // Tính toán range hiển thị
    let startPage = Math.max(2, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + halfVisible);

    // Đảm bảo luôn hiển thị đủ 5 trang (nếu đủ)
    if (this.currentPage <= halfVisible + 1) {
      endPage = Math.min(maxVisiblePages, this.totalPages - 1);
    } else if (this.currentPage >= this.totalPages - halfVisible) {
      startPage = Math.max(2, this.totalPages - maxVisiblePages + 1);
    }

    // Thêm dấu ... nếu cần
    if (startPage > 2) {
      pages.push('...');
    }

    // Thêm các trang trong khoảng
    for (let i = startPage; i <= endPage; i++) {
      console.log(pages.length);

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
    if (typeof page === 'number' && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  goToFirstPage(event: Event): void {
    this.goToPage(1, event);
  }

  goToLastPage(event: Event): void {
    this.goToPage(this.totalPages, event);
  }

  goToNextPage(event: Event): void {
    const nextPage = Math.min(this.currentPage + 1, this.totalPages);
    this.goToPage(nextPage, event);
  }

  goToPrevPage(event: Event): void {
    const prevPage = Math.max(this.currentPage - 1, 1);
    this.goToPage(prevPage, event);
  }
}
