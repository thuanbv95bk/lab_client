import { Component, OnInit } from '@angular/core';
import { Menu } from '../../model/app-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
})
export class ToolbarMenuComponent implements OnInit {
  selectedId: string;

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
    this.selectedId = '/dash-board';
  }
}
