import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TokenStorage } from './token.storage';
import { CommonService } from '../../service/common.service';
import { UserInfo } from '../../model/app-model';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../lab-component/user-vehicle-group/model/admin-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public commonService: CommonService,
    protected httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // /**
  //  * Listens event: Tạo sự kiện để lắng nghe
  //  * Khi người dùng đăng xuất -> các tab đã đăng nhập bị logout
  //  * Khi người dùng đóng 1 trình duyệt
  //  */
  // private listenEvent() {
  //   window.addEventListener('storage', (event) => {
  //     if (event.key == TokenStorage.HandelLogout) {
  //       sessionStorage.removeItem(TokenStorage.IsLoggedIn);
  //       this.router.navigate(['login']);
  //     }
  //   });
  //   // Lắng nghe sự kiện đóng trình duyệt để xóa HANDELOGIN
  //   window.addEventListener('beforeunload', () => {
  //     localStorage.removeItem(TokenStorage.HandelLogin);
  //   });
  // }

  /**
   * Go page home
   * Chuyển đến trạng mặc định
   */
  private goPageHome() {
    this.router.navigateByUrl('dash-board');
    // console.log('/dash-board');
  }

  /**
   * Go page login
   * Chuyển đén page login
   */
  private goPageLogin() {
    this.router.navigateByUrl('login');
  }

  /**
   * Signs in
   * @param userName
   * @param passWord
   * @param [isRememberMe] true/false trạng thái ghi nhớ đăng nhập
   * @returns true- đăng nhập thành công và ngược lại
   */
  async signIn(userName: string, passWord: string, isRemembered: boolean = false) {
    const use = new UserInfo();
    use.userName = userName;
    use.passWord = passWord;
    use.isRememberMe = isRemembered;

    if (use.userName == 'admin' && use.passWord == 'admin@123') {
      // Lưu thông tin đăng nhập
      if (isRemembered) {
        localStorage.setItem(TokenStorage.User, JSON.stringify(use));
        localStorage.setItem(TokenStorage.IsRememberMe, 'true');
      } else {
        this.cookieService.set(
          TokenStorage.User,
          JSON.stringify(use),
          undefined, // Session cookie (hết hạn khi đóng trình duyệt)
          '/',
          undefined,
          false,
          'Lax'
        );
      }

      this.router.navigate(['/dash-board']);
      return true;
    } else {
      this.commonService.showError('Tài khoản hoặc mật khẩu không đúng');
      return false;
    }
  }
  /**
   * Signs out đăng xuất
   * Trả về Page Login hệ thống
   */
  signOut() {
    TokenStorage.clearToken();

    // Gửi tín hiệu logout cho các tab khác
    this.cookieService.delete(TokenStorage.User);
    this.router.navigate(['/login']);
    this.goPageLogin();
  }

  /**
   * Kiểm tra đăng nhập từ localStorage hoặc cookie
   * @returns true if authenticated
   */
  isAuthenticated(): boolean {
    return localStorage.getItem(TokenStorage.User) !== null || this.cookieService.check(TokenStorage.User);
  }

  /**
   * Lấy thông tin user lưu trong localStorage ||cookieService
   * @returns current user
   */
  getCurrentUser(): UserInfo {
    const userData = localStorage.getItem(TokenStorage.User) || this.cookieService.get(TokenStorage.User);
    return userData ? JSON.parse(userData) : null;
  }
}
