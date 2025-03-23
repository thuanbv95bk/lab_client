import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css'],
})
export class MultiSelectDropdownComponent {
  @Input() options: string[] = []; // Danh sách dữ liệu truyền vào
  @Input() placeholder: string = 'Chọn phương tiện';
  @Input() maxItems: number = 3;
  @Input() enableSearch: boolean = true;
  @Input() enableSelectAll: boolean = true;

  @Output() selectedChange = new EventEmitter<string[]>(); // Trả về danh sách đã chọn

  isDropdownOpen = false;
  searchText = '';
  selectedItems: string[] = [];
  filteredOptions: string[] = [];

  constructor(private eRef: ElementRef) {}

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  // Mở/tắt dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Đóng dropdown khi click ra ngoài
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  // Lọc danh sách theo từ khóa tìm kiếm
  onSearchInput(event: any) {
    this.searchText = event.target.value;
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Chọn/deselect một mục
  toggleSelection(option: string) {
    if (this.selectedItems.includes(option)) {
      this.selectedItems = this.selectedItems.filter((item) => item !== option);
    } else {
      this.selectedItems.push(option);
    }
    this.selectedChange.emit(this.selectedItems);
  }

  // Chọn tất cả
  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedItems = [...this.options];
    } else {
      this.selectedItems = [];
    }
    this.selectedChange.emit(this.selectedItems);
  }

  // Kiểm tra xem một mục đã được chọn chưa
  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }

  // Hiển thị text trong ô input
  getSelectedText(): string {
    if (this.selectedItems.length === 0) return this.placeholder;
    if (this.selectedItems.length > this.maxItems) {
      return `${this.selectedItems.length} đã chọn`;
    }
    return this.selectedItems.join(', ');
  }
}
