import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

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
  @Output() widthSelected = new EventEmitter<number>();
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownWidth') dropdownWidth!: ElementRef;

  isSubMenuLeft = false;
  selectedItem = 0;
  isMenuOpen = false;
  isSubMenuOpen = false;
  subMenuTimeout: any = null;

  listWidthWidget: DropdownItem[] = [
    {
      id: 1,
      name: 'Độ rộng',
      children: [
        { id: 0, name: 'Tự động' },
        { id: 1, name: 'Nhỏ' },
        { id: 2, name: 'Trung bình' },
        { id: 3, name: 'Lớn' },
      ],
    },
  ];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  selectWidth(child: DropdownItem) {
    this.selectedItem = child.id;
    this.widthSelected.emit(this.selectedItem);
  }

  openSubMenu() {
    this.isSubMenuOpen = true;
    clearTimeout(this.subMenuTimeout);
    this.cdr.detectChanges(); // Cập nhật giao diện ngay lập tức
  }

  closeSubMenuWithDelay() {
    this.subMenuTimeout = setTimeout(() => {
      this.isSubMenuOpen = false;
      this.cdr.detectChanges(); // Cập nhật giao diện ngay lập tức
    }, 200);
  }

  cancelCloseSubMenu() {
    clearTimeout(this.subMenuTimeout);
  }
}
