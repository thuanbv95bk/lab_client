export class TokenStorage {
  public static readonly JwtToken = 'JWT_TOKEN';
  public static readonly IsLoggedIn = 'loggedIn';
  public static User = 'userName';
  public static IsRememberMe = 'IsRememberMe';

  /** Clears token Xóa các key ở localStorage
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public static clearToken() {
    localStorage.removeItem(TokenStorage.User);
    localStorage.removeItem(TokenStorage.IsRememberMe);
  }
}
