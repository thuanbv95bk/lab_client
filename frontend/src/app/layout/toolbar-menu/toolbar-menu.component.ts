import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../lab-component/login/model/app-model';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
})
export class ToolbarMenuComponent implements OnInit {
  /** Active menu */
  selectedId: string;
  /** Kiểm tra đóng mở side menu */
  isCollapsed = true;

  /** check trạng thái porter màn hình */
  isMobileView = false;

  /**  Danh sách menu hiển thị
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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
    {
      href: '/driving-info',
      code: 'Thông tin lái xe',
    },
  ];
  constructor(private router: Router) {}

  /** router về trang home khi click vào logo
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  onclickLogo() {
    this.router.navigate(['/']);
  }

  /** Chuyển đến trạng theo link
   * @param item Menu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  goPage(item: Menu) {
    this.selectedId = item.href;
    this.router.navigateByUrl(item.href);
  }

  /** Set mặc định về trang dash-board
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnInit() {
    this.checkViewport();
    this.selectedId = '/dash-board';
  }
  /** theo dõi window:resize để hiển thi bottom side menu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewport();
  }

  /** kiểm tra Viewport, để hiển thi side menu
   * @param param1 Mô tả param 1
   * @param param2 Mô tả param 2
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  checkViewport() {
    this.isMobileView = window.innerWidth < 992; // Bootstrap lg breakpoint
    if (!this.isMobileView) {
      this.isCollapsed = true; // Đảm bảo menu đóng khi chuyển sang desktop
    }
  }

  /** Ần hiện side menu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }
}
