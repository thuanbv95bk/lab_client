import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HrmEmployeesCbx } from '../../model/hrm-employees.model';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
})
export class MultiSelectDropdownComponent implements OnInit, OnChanges {
  /**  tiêu đề */
  @Input() title: string = 'Tìm kiếm';

  @Input() item: HrmEmployeesCbx[] = [];
  @Input() placeholder: string = 'Select';
  @Input() search: boolean = true;
  @Input() selectAll: boolean = true;
  @Input() allSelected: boolean = false;
  @Output() selectedChange = new EventEmitter<HrmEmployeesCbx[]>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  selectedItems: HrmEmployeesCbx[] = [];
  filteredItems: HrmEmployeesCbx[] = [];
  searchQuery: string = '';
  isOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.initData();
    }
  }

  /** kiểm tra allSelected để set, và cập nhật bộ lọc
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  ngOnInit(): void {
    this.initData();
  }
  initData() {
    if (this.allSelected == true) {
      this.toggleSelectAll();
    } else {
      this.filteredItems = this.item;
    }
    console.log(this.filteredItems);
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
    // this.filteredItems = this.item.filter((item?) =>
    //   item.DisplayName.toLowerCase().includes(this.searchQuery.toLowerCase())
    // );
  }

  /** chọn/ bỏ chọn 1 xe
   * @param item Vehicle : xe được chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleList(item: HrmEmployeesCbx) {
    const index = this.selectedItems.indexOf(item);
    if (index == -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.selectedChange.emit(this.selectedItems);
    this.allSelected = this.selectedItems.length === this.item.length;
  }

  /** xóa xe đã chọn
   * @param item Vehicle : xe được chọn
   * @event emit sự kiện ra ngoài: trả về danh sách xe đã chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  removeItem(item: HrmEmployeesCbx) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedChange.emit(this.selectedItems);
    }
    this.allSelected = this.selectedItems.length === this.item.length;
  }

  /** chọn/ bỏ chọn check all
   * emit sự kiện ra ngoài: trả về danh sách xe
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = [...this.item];
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

  isSelected(item: HrmEmployeesCbx): boolean {
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
      return `Tất cả (${this.item.length})`;
    }
    if (this.selectedItems.length == 0) return '';
    return `${this.selectedItems.length} được chọn`;
  }
}
