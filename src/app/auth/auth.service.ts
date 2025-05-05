import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TokenStorage } from './token.storage';
import { CommonService } from '../service/common.service';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../lab-component/login/model/app-model';
import { AppGlobals } from '../app-global';

/** AuthService
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

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

  /** goPageHome set về trang chủ
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  private goPageHome() {
    this.router.navigateByUrl('dash-board');
    // console.log('/dash-board');
  }

  /** Chuyển đén page login
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  private goPageLogin() {
    this.router.navigateByUrl('login');
  }

  /** Signs in đằng nhập hệ thống
   * @param userName UserName
   * @param passWord passWord
   * @param isRemembered true/false trạng thái ghi nhớ đăng nhập
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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
      AppGlobals.activeMenuId = '/dash-board';
      return true;
    } else {
      this.commonService.showError('Tài khoản hoặc mật khẩu không đúng');
      return false;
    }
  }

  /** Signs out đăng xuất
   *  Trả về Page Login hệ thống
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  signOut() {
    TokenStorage.clearToken();
    this.cookieService.delete(TokenStorage.User);
    this.router.navigate(['/login']);
    this.goPageLogin();
  }

  /** Kiểm tra đăng nhập từ localStorage hoặc cookie
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  isAuthenticated(): boolean {
    return localStorage.getItem(TokenStorage.User) !== null || this.cookieService.check(TokenStorage.User);
  }

  /** Lấy thông tin user lưu trong localStorage ||cookieService
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getCurrentUser(): UserInfo {
    const userData = localStorage.getItem(TokenStorage.User) || this.cookieService.get(TokenStorage.User);
    return userData ? JSON.parse(userData) : null;
  }
}
