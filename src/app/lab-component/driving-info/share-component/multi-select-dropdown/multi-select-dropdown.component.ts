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

  /** Field name cần hiên thị*/
  @Input() displayField1: string = '';
  @Input() displayField2: string = '';
  /** ký hiệu nối các displayField*/
  @Input() separate: string = ' - ';

  @Input()
  set items(value) {
    /** Khi giá trị items thay đổi, cập nhật listData */
    this.listData.next(value);
  }
  get items() {
    /**Lấy giá trị hiện tại của listData */
    return this.listData.getValue();
  }
  /**  Lưu trữ danh sách item gốc */
  private _items: any[];

  /**  Placeholder cho ô tìm kiếm */
  @Input() placeholder: string = 'Select';
  /** Cho phép tìm kiếm hay không */
  @Input() search: boolean = true;
  /** Cho phép chọn tất cả hay không */
  @Input() selectAll: boolean = true;
  /** Trạng thái đã chọn tất cả hay chưa */
  @Input() allSelected: boolean = false;
  /**Sự kiện khi danh sách chọn thay đổi */
  @Output() selectedChange = new EventEmitter<{ data: any[]; isCheckAll: boolean }>();
  /**  Tham chiếu đến input tìm kiếm */
  @ViewChild('searchInput') searchInput!: ElementRef;

  /** Danh sách các item đã chọn */
  selectedItems: any[] = [];
  /**  Giá trị trường tìm kiếm */
  searchField: string = '';
  /**  Trạng thái mở/đóng dropdown */
  isOpen: boolean = false;

  /** Subject lưu trữ danh sách item */
  private listData = new BehaviorSubject<any[]>([]);
  /**  Subject lưu trữ danh sách item đã lọc */
  public filteredItems: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /**  Subject để hủy các subscription khi component bị hủy */
  private onDestroy = new Subject<void>();
  /** FormControl cho input tìm kiếm */
  FilterCtrl: FormControl = new FormControl();

  /**  Inject ElementRef để kiểm tra click ngoài dropdown */
  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    /** Khi input items thay đổi, khởi tạo lại dữ liệu */
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
  /** Khởi tạo dữ liệu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  initData() {
    this.listData.pipe(takeUntil(this.onDestroy)).subscribe((x) => {
      this._items = this.items;
      this.filteredItems.next(this.items);
    });

    /** listen for search field value changes */
    this.FilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => {
      this.filterItems();
    });
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
    /** filter data */
    this.filteredItems.next(
      this._items.filter((itm) => {
        /** tim kiem tren ca  field1 và field2 */
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
    this.selectedChange.emit({ data: this.selectedItems, isCheckAll: false });
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
      this.selectedChange.emit({ data: this.selectedItems, isCheckAll: false });
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
    this.selectedChange.emit({ data: this.selectedItems, isCheckAll: this.allSelected });
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
