import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Vehicle } from '../model/vehicle/vehicle.model';

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
  ngOnInit(): void {
    if (this.allSelected == true) {
      this.toggleSelectAll();
    } else {
      this.filteredItems = this.vehicles;
    }
  }

  ngAfterViewInit() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  /**
   * Toggles dropdown
   * @description open/clone danh sách xe để chọn
   * @event  focus con trỏ chuột vào ô nhập
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  /**
   * Filters list
   * @description lọc danh sách xe khi người dùng tìm kiếm ở ô chọn
   * @returns trả về danh sách xe
   */
  filterList() {
    this.filteredItems = this.vehicles.filter((item) =>
      item.code.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  /**
   * Toggles list
   * @description chọn/ bỏ chọn 1 xe
   * @param item
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

  /**
   * Removes item
   * @description xóa xe đã chọn
   * @event emit sự kiện ra ngoài: trả về danh sách xe đã chọn
   * @param item
   */
  removeItem(item: Vehicle) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedChange.emit(this.selectedItems);
    }
    this.allSelected = this.selectedItems.length === this.vehicles.length;
  }

  /**
   * Toggles select all
   * @description chọn/ bỏ chọn check all
   * emit sự kiện ra ngoài: trả về danh sách xe
   */
  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = [...this.vehicles];
    } else {
      this.selectedItems = [];
    }
    this.selectedChange.emit(this.selectedItems);
  }

  isSelected(item: Vehicle): boolean {
    return this.selectedItems.includes(item);
  }

  /**
   * Gets display text
   * @description text hiển thị ở ô chọn
   * @value : check all:  tất cả + tổng số phương tiện
   * @value số xe được chọn
   * @returns display text
   */
  getDisplayText(): string {
    // console.log(this.selectedItems);

    if (this.allSelected == true) {
      return `Tất cả (${this.vehicles.length})`;
    }
    if (this.selectedItems.length == 0) return '';
    return `${this.selectedItems.length} xe được chọn`;
  }
}
