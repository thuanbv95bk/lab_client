import { Component, OnInit } from '@angular/core';
import { TokenStorage } from '../../common/auth/token.storage';
import { AuthService } from '../../common/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../lab-component/user-vehicle-group/model/admin-user';
import { UserInfo } from '../../model/app-model';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  /**
   * User lưu thông tin của user
   */
  user = new UserInfo();
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  /**
   * Logs out
   * Khi người dung đăng xuất
   * đi về trang login
   */
  logOut() {
    this.authService.signOut();

    this.router.navigateByUrl('login');
  }
}
