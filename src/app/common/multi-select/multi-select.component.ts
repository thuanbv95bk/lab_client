import { Component, EventEmitter, Input, Output } from '@angular/core';

interface SelectItem {
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent {
  @Input() items: SelectItem[] = []; // List dữ liệu động
  @Input() placeholder: string = 'Chọn mục'; // Placeholder động
  @Output() selectedChange = new EventEmitter<SelectItem[]>(); // Trả về danh sách chọn

  selectedItems: SelectItem[] = [];
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(item: SelectItem): boolean {
    return this.selectedItems.some((i) => i.id === item.id);
  }

  toggleItem(item: SelectItem) {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter((i) => i.id !== item.id);
    } else {
      this.selectedItems.push(item);
    }
    this.selectedChange.emit(this.selectedItems);
  }

  isAllSelected(): boolean {
    return this.selectedItems.length === this.items.length;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedItems = [...this.items];
    } else {
      this.selectedItems = [];
    }
    this.selectedChange.emit(this.selectedItems);
  }
}
