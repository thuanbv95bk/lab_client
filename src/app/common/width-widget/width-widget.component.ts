import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
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
  selector: 'app-width-widget',
  templateUrl: './width-widget.component.html',
  styleUrls: ['./width-widget.component.scss'],
})
export class WidthWidgetComponent {
  @Input() selectedItem: number = 0;
  @Output() widthSelected = new EventEmitter<number>();
  @ViewChild('dropdownMenu')
  dropdownMenu!: ElementRef;
  @ViewChild('dropdownWidth')
  dropdownWidth!: ElementRef;
  isSubMenuLeft: boolean = false;

  isMenuOpen = false; // Trạng thái menu mở / đóng
  listWidthWidget: DropdownItem[] = [
    {
      id: 1,
      name: 'Độ rộng',
      children: ([] = [
        { id: 0, name: 'Tự động' },
        { id: 1, name: 'Nhỏ' },
        { id: 2, name: 'Trung bình' },
        { id: 3, name: 'Lớn' },
      ]),
    },
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  selectWidth(child: DropdownItem) {
    this.selectedItem = child.id;
    this.widthSelected.emit(this.selectedItem);
  }

  // Khi hover vào nút thì mở menu
  // @HostListener('mouseenter')
  // click() {
  //   this.adjustMenuPosition();
  // }
  @HostListener('click')
  click() {
    this.adjustMenuPosition();
  }

  adjustMenuPosition() {
    if (this.dropdownMenu) {
      const dropdownMenu = this.dropdownMenu.nativeElement;
      const buttonRect = this.el.nativeElement.getBoundingClientRect();
      const menuRect = dropdownMenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const offsetSubMenu = menuRect.width - 2 + 'px';

      if (buttonRect.left + menuRect.width > viewportWidth) {
        this.renderer.setStyle(dropdownMenu, 'left', 'auto');
        this.renderer.setStyle(dropdownMenu, 'right', '0');

        const dropdownWidth = this.dropdownWidth.nativeElement;
        this.renderer.setStyle(dropdownWidth, 'left', 'auto');
        this.renderer.setStyle(dropdownWidth, 'right', offsetSubMenu);
        this.isSubMenuLeft = true;
      } else {
        this.renderer.setStyle(dropdownMenu, 'left', '0');
        this.renderer.setStyle(dropdownMenu, 'right', 'auto');
        this.isSubMenuLeft = false;
      }
    }
  }
}
