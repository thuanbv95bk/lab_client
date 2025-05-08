import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from '../../lab-component/login/model/app-model';
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})

/** hiển thị icon user và nút đăng xuất
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class UserMenuComponent implements OnInit {
  /** thông tin user */
  user = new UserInfo();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  /** Khi người dung đăng xuất, đi về trang login
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  logOut() {
    this.authService.signOut();

    this.router.navigateByUrl('login');
  }
}
