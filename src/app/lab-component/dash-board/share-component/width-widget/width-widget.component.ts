import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { SizeEnum } from '../../enum/location.enum';

/** hiển thị menu chọn độ rộng width
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
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

/** Component để chọn vị trí cho tưng widget
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class WidthWidgetComponent {
  /** vị trí đang chọn */
  @Input() selectedItem: SizeEnum = SizeEnum.Auto as const;

  /** EventEmitter */
  @Output() widthSelected = new EventEmitter<SizeEnum>();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  @ViewChild('dropdownWidth') dropdownWidth!: ElementRef;

  isMenuOpen = false;
  isSubMenuOpen = false;
  isMenuLeft = false;
  isSubMenuLeft = false;

  /** Biến kiểm soát trạng thái mở do click */
  isClickOpen = false;

  /** Khởi tạo item cho menu chọn width của widget
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  listWidthWidget: DropdownItem[] = [
    {
      id: 'width-options',
      name: 'Độ rộng',
      children: [
        { id: SizeEnum.Auto, name: 'Tự động' },
        { id: SizeEnum.Small, name: 'Nhỏ' },
        { id: SizeEnum.Medium, name: 'Trung bình' },
        { id: SizeEnum.Large, name: 'Lớn' },
      ],
    },
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  /** Opens menu,Hover hoặc click vào nút mở menu chính & submenu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  openMenu() {
    this.isMenuOpen = true;
    this.isSubMenuOpen = true;
    this.adjustMenuPosition();
    this.adjustSubMenuPosition();
  }

  /** Click vào nút menu sẽ mở và giữ menu không đóng khi rời chuột
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  clickOpenMenu() {
    this.isMenuOpen = true;
    this.isSubMenuOpen = true;
    // Đánh dấu đã click để không đóng menu khi di chuột ra ngoài
    this.isClickOpen = true;
    this.updateMenuPosition();
  }

  /**  Khi chọn một item trong submenu, đóng menu
   * @param child :chọn item
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  selectWidth(child: DropdownItem) {
    this.selectedItem = child.id as SizeEnum;
    this.widthSelected.emit(this.selectedItem);
    this.isMenuOpen = false;
    this.isSubMenuOpen = false;
    this.isClickOpen = false;
  }

  /** Cập nhật vị trí menu chính và submenu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  updateMenuPosition() {
    setTimeout(() => {
      this.adjustMenuPosition();
      this.adjustSubMenuPosition();
    }, 0);
  }

  /** Adjusts menu position Kiểm tra & điều chỉnh vị trí menu chính (trái/phải)
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /** Kiểm tra & điều chỉnh vị trí submenu theo menu chính
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /**Hosts listener, Nếu hover vào menu thì giữ menu mở
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @HostListener('mouseenter')
  keepMenuOpen() {
    this.isMenuOpen = true;
  }

  /**Hosts listener, Nếu rời chuột khỏi menu và chưa click vào nút thì đóng menu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @HostListener('mouseleave')
  closeMenuOnHover() {
    if (!this.isClickOpen) {
      this.isMenuOpen = false;
      this.isSubMenuOpen = false;
    }
  }

  /**Hosts listener,  Đóng menu khi click ra ngoài, nhưng KHÔNG đóng nếu chỉ di chuột ra ngoài
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.isSubMenuOpen = false;
      this.isClickOpen = false;
    }
  }

  /**Hosts listener,  Lắng nghe sự kiện RESIZE màn hình để cập nhật vị trí menu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.isMenuOpen) {
      this.updateMenuPosition();
    }
  }
}
