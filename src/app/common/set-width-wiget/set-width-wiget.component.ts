import { Component, EventEmitter, Input, Output } from '@angular/core';

interface DropdownItem {
  id: number;
  name: string;
  children?: DropdownItem[]; // Nếu có danh sách con
}

@Component({
  selector: 'app-set-width-wiget',
  templateUrl: './set-width-wiget.component.html',
  styleUrls: ['./set-width-wiget.component.scss'],
})
export class SetWidthWigetComponent {
  @Input() items: DropdownItem[] = [];
  @Output() selectionChange = new EventEmitter<DropdownItem>();

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
