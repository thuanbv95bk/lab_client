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
  @Input() selectedItem: 'auto' | 'small' | 'medium' | 'large' =
    'auto' as const;
  @Output() widthSelected = new EventEmitter<
    'auto' | 'small' | 'medium' | 'large'
  >();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownWidth') dropdownWidth!: ElementRef;

  isMenuOpen = false;
  isSubMenuLeft = false;

  listWidthWidget: DropdownItem[] = [
    {
      id: 'width-options',
      name: 'Độ rộng',
      children: [
        { id: 'auto', name: 'Tự động' },
        { id: 'small', name: 'Nhỏ' },
        { id: 'medium', name: 'Trung bình' },
        { id: 'large', name: 'Lớn' },
      ],
    },
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  selectWidth(child: DropdownItem) {
    this.selectedItem = child.id as 'auto' | 'small' | 'medium' | 'large';
    this.widthSelected.emit(this.selectedItem);
    this.closeMenu();
  }

  @HostListener('click')
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.adjustMenuPosition();
    }
  }

  @HostListener('mouseleave')
  closeMenu() {
    this.isMenuOpen = false;
  }

  adjustMenuPosition() {
    if (this.dropdownMenu) {
      const dropdownMenu = this.dropdownMenu.nativeElement;
      const buttonRect = this.el.nativeElement.getBoundingClientRect();
      const menuRect = dropdownMenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const offsetSubMenu = `${menuRect.width - 2}px`;

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
