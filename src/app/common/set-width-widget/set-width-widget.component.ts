import { Component, EventEmitter, Input, Output } from '@angular/core';

interface DropdownItem {
  id: number;
  name: string;
  children?: DropdownItem[]; // Nếu có danh sách con
}

@Component({
  selector: 'app-set-width-widget',
  templateUrl: './set-width-widget.component.html',
  styleUrls: ['./set-width-widget.component.scss'],
})
export class SetWidthWidgetComponent {
  @Input() items: DropdownItem[] = [];
  @Output() selectionChange = new EventEmitter<DropdownItem>();

  listWidthWidget = [
    {
      id: 1,
      name: 'Độ rộng',
      children: [
        { id: 2, name: 'Tự động' },
        { id: 3, name: 'Nhỏ' },
        { id: 4, name: 'Trung bình' },
        { id: 5, name: 'Lớn' },
      ],
    },
  ];

  dropdownOpen: boolean = false;
  subMenuOpen: boolean = false;
  selectedItem: DropdownItem | null = null;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.subMenuOpen = !this.subMenuOpen;
  }

  toggleSubMenu(event: Event) {
    event.stopPropagation(); // Ngăn đóng menu cha
    this.subMenuOpen = !this.subMenuOpen;
  }

  selectItem(item: DropdownItem) {
    this.selectedItem = item;
    this.selectionChange.emit(item);
    this.dropdownOpen = false;
    this.subMenuOpen = false;
  }
}
