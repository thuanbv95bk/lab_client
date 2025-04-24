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
import { BehaviorSubject, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
})
export class MultiSelectDropdownComponent implements OnInit, OnChanges {
  /**  tiêu đề */
  @Input() title: string = 'Tìm kiếm';

  @Input() displayField1: string = '';
  @Input() displayField2: string = '';
  @Input() separate: string = ' - ';

  @Input()
  set items(value) {
    this._data.next(value);
  }
  get items() {
    return this._data.getValue();
  }
  private _items: any[];
  // @Input() items: any[] = [];
  @Input() placeholder: string = 'Select';
  @Input() search: boolean = true;
  @Input() selectAll: boolean = true;
  @Input() allSelected: boolean = false;
  @Output() selectedChange = new EventEmitter<any[]>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  selectedItems: any[] = [];
  // filteredItems: any[] = [];
  searchField: string = '';
  isOpen: boolean = false;

  // private _items: any[];
  private _data = new BehaviorSubject<any[]>([]);
  public filteredItems: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  FilterCtrl: FormControl = new FormControl();
  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
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
    console.log(this.items);

    this._data.pipe(takeUntil(this._onDestroy)).subscribe((x) => {
      this._items = this.items;
      this.filteredItems.next(this.items);
    });
    // listen for search field value changes
    this.FilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterItems();
    });
    console.log(this._items);
  }
  /** lọc danh sách khi người dùng tìm kiếm ở ô chọn
   * @Author thuan.bv
   * @Created 24/04/2025
   * @Modified date - user - description
   */
  protected filterItems() {
    if (!this._items) {
      return;
    }
    // get the search keyword
    let search = this.FilterCtrl.value;
    if (!search) {
      this.filteredItems.next(this._items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter items
    this.filteredItems.next(
      this._items.filter((itm) => {
        // tim kiem tren ca field2
        return (
          (this.displayField1 && itm[this.displayField1].toString().toLowerCase().indexOf(search) > -1) ||
          (this.displayField2 && itm[this.displayField2].toString().toLowerCase().indexOf(search) > -1)
        );
      })
    );
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
      // this.filterList();
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

  /** chọn/ bỏ chọn 1 xe
   * @param item Vehicle : xe được chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleList(item: any) {
    const index = this.selectedItems.indexOf(item);
    if (index == -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.selectedChange.emit(this.selectedItems);
    this.allSelected = this.selectedItems.length === this.items.length;
  }

  /** xóa xe đã chọn
   * @param item Vehicle : xe được chọn
   * @event emit sự kiện ra ngoài: trả về danh sách xe đã chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  removeItem(item: any) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedChange.emit(this.selectedItems);
    }
    this.allSelected = this.selectedItems.length === this.items.length;
  }

  /** chọn/ bỏ chọn check all
   * emit sự kiện ra ngoài: trả về danh sách xe
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = [...this.items];
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

  isSelected(item: any): boolean {
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
      return `Tất cả (${this.items.length})`;
    }
    if (this.selectedItems.length == 0) return '';
    return `${this.selectedItems.length} được chọn`;
  }
}
