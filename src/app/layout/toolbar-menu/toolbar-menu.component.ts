import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../lab-component/login/model/app-model';
import { AppGlobals } from '../../app-global';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
})
/** khu menu chính của app
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class ToolbarMenuComponent implements OnInit {
  /** Kiểm tra đóng mở side menu */
  isCollapsed = true;

  /** check trạng thái porter màn hình */
  isMobileView = false;

  appGlobals = AppGlobals;
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
    AppGlobals.activeMenuId = item.href;
    this.router.navigateByUrl(item.href);
  }

  /** Set mặc định về trang dash-board
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnInit() {
    this.checkViewport();
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
    // Bootstrap lg breakpoint
    this.isMobileView = window.innerWidth < 992;
    if (!this.isMobileView) {
      // Đảm bảo menu đóng khi chuyển sang desktop
      this.isCollapsed = true;
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
