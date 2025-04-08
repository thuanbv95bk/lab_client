import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TokenStorage } from './token.storage';
import { CommonService } from '../../service/common.service';
import { UserInfo } from '../../model/app-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public commonService: CommonService,
    protected httpClient: HttpClient,
    private router: Router
  ) {
    this.listenEvent();
  }

  /**
   * Listens event: Tạo sự kiện để lắng nghe
   * Khi người dùng đăng xuất -> các tab đã đăng nhập bị logout
   * Khi người dùng đóng 1 trình duyệt
   */
  private listenEvent() {
    window.addEventListener('storage', (event) => {
      if (event.key == TokenStorage.HANDELOGOUT) {
        sessionStorage.removeItem(TokenStorage.ISLOGGEDIN);
        this.router.navigate(['/login']);
      }
    });
    // Lắng nghe sự kiện đóng trình duyệt để xóa HANDELOGIN
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem(TokenStorage.HANDELOGIN);
    });
  }

  /**
   * Go page home
   * Chuyển đến trạng mặc định
   */
  private goPageHome() {
    this.router.navigateByUrl('');
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
  async signIn(userName: string, passWord: string, isRememberMe: boolean = false) {
    try {
      const use = new UserInfo();
      use.userName = userName;
      use.passWord = passWord;
      use.isRememberMe = isRememberMe;

      if (use.userName == 'admin' && use.passWord == 'admin@123') {
        if (isRememberMe == true) {
          localStorage.setItem(TokenStorage.ISLOGGEDIN, 'true');
          localStorage.setItem(TokenStorage.ISREMBERME, 'true');
        } else {
          localStorage.removeItem(TokenStorage.ISREMBERME);
        }
        sessionStorage.setItem(TokenStorage.ISLOGGEDIN, 'true');
        localStorage.setItem(TokenStorage.HANDELOGIN, Date.now().toString());
        localStorage.removeItem(TokenStorage.HANDELOGOUT);
        this.goPageHome();
        this.commonService.showSuccess('Đăng nhập thành công');
      } else {
        this.commonService.showError('Tài khoản hoặc và mật khẩu không đúng.');
      }
    } catch (err) {
      alert(err);
      return false;
    }
    return true;
  }

  /**
   * Signs out đăng xuất
   * Trả về Page Login hệ thống
   */
  signOut() {
    TokenStorage.clearToken();
    // Gửi tín hiệu logout cho các tab khác
    localStorage.setItem(TokenStorage.HANDELOGOUT, Date.now().toString());
    this.goPageLogin();
  }

  /**
   * Checks logged in: kiểm tra trạng thái đăng nhập
   * @returns  Về page Mặc định hoặc về lại page login nếu mất quyền truy cập
   */
  checkLoggedIn() {
    //Khôi phục session từ localStorage
    if (localStorage.getItem(TokenStorage.ISLOGGEDIN)) {
      sessionStorage.setItem(TokenStorage.ISLOGGEDIN, 'true');
    }

    if (sessionStorage.getItem(TokenStorage.ISLOGGEDIN)) {
      this.goPageHome();
      return;
    }
    // Nếu localStorage có handelLogin từ tab khác, khôi phục sessionStorage
    if (localStorage.getItem(TokenStorage.HANDELOGIN)) {
      sessionStorage.setItem(TokenStorage.ISLOGGEDIN, 'true');
    }

    if (sessionStorage.getItem(TokenStorage.ISLOGGEDIN) == 'true') {
      this.goPageHome();
    } else {
      this.goPageLogin();
    }
  }
}
