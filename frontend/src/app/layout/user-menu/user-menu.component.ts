import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from '../../lab-component/login/model/app-model';
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
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
