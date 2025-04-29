import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { Vehicle } from '../../model/vehicle.model';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  @Input() vehicles: Vehicle[] = [];
  @Input() placeholder: string = 'Select';
  @Input() search: boolean = true;
  @Input() selectAll: boolean = true;
  @Input() allSelected: boolean = false;
  @Output() selectedChange = new EventEmitter<Vehicle[]>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  selectedItems: Vehicle[] = [];
  filteredItems: Vehicle[] = [];
  searchQuery: string = '';
  isOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  /** kiểm tra allSelected để set, và cập nhật bộ lọc
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  ngOnInit(): void {
    if (this.allSelected == true) {
      this.toggleSelectAll();
    } else {
      this.filteredItems = this.vehicles;
    }
  }

  /** focus vào ô input sau khi init
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngAfterViewInit() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  /** open/clone danh sách xe để chọn
   * @event  focus con trỏ chuột vào ô nhập
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterList();
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 0);
    }
  }

  /** Listener theo dõi  click vào input
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  /** lọc danh sách xe khi người dùng tìm kiếm ở ô chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  filterList() {
    this.filteredItems = this.vehicles.filter((item) =>
      item.code.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  /** chọn/ bỏ chọn 1 xe
   * @param item Vehicle : xe được chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleList(item: Vehicle) {
    const index = this.selectedItems.indexOf(item);
    if (index == -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.selectedChange.emit(this.selectedItems);
    this.allSelected = this.selectedItems.length === this.vehicles.length;
  }

  /** xóa xe đã chọn
   * @param item Vehicle : xe được chọn
   * @event emit sự kiện ra ngoài: trả về danh sách xe đã chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  removeItem(item: Vehicle) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedChange.emit(this.selectedItems);
    }
    this.allSelected = this.selectedItems.length === this.vehicles.length;
  }

  /** chọn/ bỏ chọn check all
   * emit sự kiện ra ngoài: trả về danh sách xe
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = [...this.vehicles];
    } else {
      this.selectedItems = [];
    }
    this.selectedChange.emit(this.selectedItems);
  }

  /**kiểm tra trạng thai isSelected của item: Vehicle
   * @param item Vehicle
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  isSelected(item: Vehicle): boolean {
    return this.selectedItems.includes(item);
  }

  /** get: text hiển thị ở ô chọn
   * @value : check all:  tất cả + tổng số phương tiện
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getDisplayText(): string {
    if (this.allSelected == true) {
      return `Tất cả (${this.vehicles.length})`;
    }
    if (this.selectedItems.length == 0) return '';
    return `${this.selectedItems.length} xe được chọn`;
  }
}
