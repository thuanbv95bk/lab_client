export class TokenStorage {
  public static readonly JwtToken = 'JWT_TOKEN';
  public static readonly IsLoggedIn = 'loggedIn';
  public static User = 'userName';
  public static IsRememberMe = 'IsRememberMe';

  /**
   * Clears token Xóa các key ở localStorage
   */
  public static clearToken() {
    localStorage.removeItem(TokenStorage.User);
    localStorage.removeItem(TokenStorage.IsRememberMe);
  }
}
