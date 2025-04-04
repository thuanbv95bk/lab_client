import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { SizeEnum } from '../../model/enum/location.enum';

interface DropdownItem {
  id: string;
  name: string;
  children?: DropdownItem[];
}

@Component({
  selector: 'app-width-widget',
  templateUrl: './width-widget.component.html',
  styleUrls: ['./width-widget.component.scss'],
})
export class WidthWidgetComponent {
  @Input() selectedItem: SizeEnum = SizeEnum.auto as const;
  @Output() widthSelected = new EventEmitter<SizeEnum>();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownWidth') dropdownWidth!: ElementRef;

  isMenuOpen = false;
  isSubMenuOpen = false;
  isMenuLeft = false;
  isSubMenuLeft = false;
  isClickOpen = false; // Biến kiểm soát trạng thái mở do click

  listWidthWidget: DropdownItem[] = [
    {
      id: 'width-options',
      name: 'Độ rộng',
      children: [
        { id: SizeEnum.auto, name: 'Tự động' },
        { id: SizeEnum.small, name: 'Nhỏ' },
        { id: SizeEnum.medium, name: 'Trung bình' },
        { id: SizeEnum.large, name: 'Lớn' },
      ],
    },
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  /**
   * Opens menu
   * @description Hover hoặc click vào nút mở menu chính & submenu
   */
  openMenu() {
    this.isMenuOpen = true;
    this.isSubMenuOpen = true;
    this.adjustMenuPosition();
    this.adjustSubMenuPosition();
  }

  /**
   * Clicks open menu
   * @description Click vào nút menu sẽ mở và giữ menu không đóng khi rời chuột
   */
  clickOpenMenu() {
    this.isMenuOpen = true;
    this.isSubMenuOpen = true;
    this.isClickOpen = true; // Đánh dấu đã click để không đóng menu khi di chuột ra ngoài
    this.updateMenuPosition();
  }

  /**
   * Selects width
   * @param child
   * @description Khi chọn một item trong submenu, đóng menu
   */
  selectWidth(child: DropdownItem) {
    this.selectedItem = child.id as SizeEnum;
    this.widthSelected.emit(this.selectedItem);
    this.isMenuOpen = false;
    this.isSubMenuOpen = false;
    this.isClickOpen = false;
  }

  /**
   * Updates menu position
   * @description * Cập nhật vị trí menu chính và submenu
   */
  updateMenuPosition() {
    setTimeout(() => {
      this.adjustMenuPosition();
      this.adjustSubMenuPosition();
    }, 0);
  }

  /**
   * @description   Adjusts menu position Kiểm tra & điều chỉnh vị trí menu chính (trái/phải)
   * @returns
   */
  adjustMenuPosition() {
    if (!this.dropdownMenu) return;

    const dropdownMenu = this.dropdownMenu.nativeElement;
    const buttonRect = this.el.nativeElement.getBoundingClientRect();
    const menuRect = dropdownMenu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (buttonRect.left + menuRect.width > viewportWidth) {
      this.renderer.setStyle(dropdownMenu, 'left', 'auto');
      this.renderer.setStyle(dropdownMenu, 'right', '0');
      this.isMenuLeft = true;
    } else {
      this.renderer.setStyle(dropdownMenu, 'left', '0');
      this.renderer.setStyle(dropdownMenu, 'right', 'auto');
      this.isMenuLeft = false;
    }
  }

  /**
   * Adjusts sub menu position
   * @description  Kiểm tra & điều chỉnh vị trí submenu theo menu chính
   * @returns
   */
  adjustSubMenuPosition() {
    if (!this.dropdownWidth) return;

    const dropdownWidth = this.dropdownWidth.nativeElement;
    if (this.isMenuLeft) {
      this.renderer.setStyle(dropdownWidth, 'left', 'auto');
      this.renderer.setStyle(dropdownWidth, 'right', '100%');
      this.isSubMenuLeft = true;
    } else {
      this.renderer.setStyle(dropdownWidth, 'left', '100%');
      this.renderer.setStyle(dropdownWidth, 'right', 'auto');
      this.isSubMenuLeft = false;
    }
  }

  /**
   * Hosts listener
   * @description Nếu hover vào menu thì giữ menu mở
   */
  @HostListener('mouseenter')
  keepMenuOpen() {
    this.isMenuOpen = true;
  }

  /**
   * Hosts listener
   * @description Nếu rời chuột khỏi menu và chưa click vào nút thì đóng menu
   */
  @HostListener('mouseleave')
  closeMenuOnHover() {
    if (!this.isClickOpen) {
      this.isMenuOpen = false;
      this.isSubMenuOpen = false;
    }
  }

  /**
   * Hosts listener
   * @description  Đóng menu khi click ra ngoài, nhưng KHÔNG đóng nếu chỉ di chuột ra ngoài
   * @param event
   */
  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.isSubMenuOpen = false;
      this.isClickOpen = false;
    }
  }

  /**
   * Hosts listener
   * @description  Lắng nghe sự kiện RESIZE màn hình để cập nhật vị trí menu
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.isMenuOpen) {
      this.updateMenuPosition();
    }
  }
}
