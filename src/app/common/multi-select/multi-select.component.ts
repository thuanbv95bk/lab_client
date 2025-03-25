import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

// interface SelectItem {
//   id: number;
//   code: string;
//   name: string;
// }

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Select';
  @Input() search: boolean = true;
  @Input() selectAll: boolean = true;
  @Input() maxItems: number = 3;

  @Output() selectedChange = new EventEmitter<string[]>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  selectedItems: string[] = [];
  filteredOptions: string[] = [];
  searchQuery: string = '';
  isOpen: boolean = false;
  allSelected: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterOptions();
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

  filterOptions() {
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleOption(option: string) {
    const index = this.selectedItems.indexOf(option);
    if (index === -1) {
      if (this.selectedItems.length < this.maxItems) {
        this.selectedItems.push(option);
      }
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.selectedChange.emit(this.selectedItems);
    this.allSelected = this.selectedItems.length === this.options.length;
  }

  removeItem(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedChange.emit(this.selectedItems);
    }
    this.allSelected = this.selectedItems.length === this.options.length;
  }

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = [...this.options];
    } else {
      this.selectedItems = [];
    }
    this.selectedChange.emit(this.selectedItems);
  }

  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }

  getDisplayText(): string {
    if (!this.selectedItems.length || !this.allSelected) return '';

    if (this.allSelected == true) {
      return `Tất cả (${this.options.length})`; // Hiển thị "Tất cả (số lượng item)"
    }
    if (this.selectedItems.length > 0) {
      return `${this.selectedItems.length} được chọn`;
    }
    return '';
  }
}
