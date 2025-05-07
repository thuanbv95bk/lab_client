import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Kiểm tra trạng thái đăng nhập AuthGuard
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

@Injectable({
  providedIn: 'root',
})

/** AuthGuard check isAuthenticated
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  /** Determines whether activate can
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
