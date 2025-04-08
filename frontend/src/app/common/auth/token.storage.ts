export class TokenStorage {
  public static readonly JWT_TOKEN = 'JWT_TOKEN';
  public static readonly USER_NAME = 'userName';
  public static readonly PASS_WORD = 'passWord';
  public static readonly ISLOGGEDIN = 'loggedIn';
  public static readonly ISREMBERME = 'isRemberMe';
  public static readonly HANDELOGIN = 'handelLogin';
  public static readonly HANDELOGOUT = 'handelLogout';

  /**
   * Clears token Xóa các key ở localStorage
   */
  public static clearToken() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.ISLOGGEDIN);
    localStorage.removeItem(this.ISREMBERME);
    localStorage.removeItem(this.USER_NAME);
    localStorage.removeItem(this.PASS_WORD);
    sessionStorage.removeItem(this.ISLOGGEDIN);
    localStorage.removeItem(this.HANDELOGIN);
  }
}
