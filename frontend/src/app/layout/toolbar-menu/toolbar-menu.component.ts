import { Component, HostListener, OnInit } from '@angular/core';
import { Menu } from '../../model/app-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
})
export class ToolbarMenuComponent implements OnInit {
  selectedId: string;
  isCollapsed = true;
  isMobileView = false;

  /**
   * List menu of toolbar menu component
   * Danh sách menu hiển thị
   */
  listMenu: Menu[] = [
    {
      href: '/dash-board',
      code: 'Dashboard',
    },
    {
      href: '/user-vehicle-group',
      code: 'Nhóm phương tiện',
    },
  ];
  constructor(private router: Router) {}

  /**
   *router về trang home khi click vào logo
   */
  onclickLogo() {
    this.router.navigate(['/']);
  }
  /**
   * Go page home
   * Chuyển đến trạng theo link
   */
  goPage(item: Menu) {
    this.selectedId = item.href;
    this.router.navigateByUrl(item.href);
  }

  /**
   * Set mặc định về trang dash-board
   */
  ngOnInit() {
    this.checkViewport();
    this.selectedId = '/dash-board';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth < 992; // Bootstrap lg breakpoint
    if (!this.isMobileView) {
      this.isCollapsed = true; // Đảm bảo menu đóng khi chuyển sang desktop
    }
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }
}
