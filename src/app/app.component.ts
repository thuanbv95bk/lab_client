import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/auth.service';
import { AppGlobals } from './app-global';
import { AppConfig } from './app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  /** tiêu đề của app */
  title = 'LAB';

  /** mặc định tiếng việt */
  defaultLang: string = 'vi';

  constructor(public translate: TranslateService, private authService: AuthService, private router: Router) {}

  /** initTranslate() khởi tao ngôn ngữ mặc định, check auth
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnInit(): void {
    this.initTranslate();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/driving-info']);
      AppGlobals.activeMenuId = '/driving-info';
    }
  }

  /** Inits translate init ngôn ngữ để load về giao diện khi bật application
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  initTranslate() {
    const savedLang = AppGlobals.getLang().toString();

    if (!savedLang || savedLang == '') {
      this.translate.setDefaultLang(this.defaultLang);
      AppGlobals.setLang(this.defaultLang);
      return;
    }
    this.translate.setDefaultLang(savedLang || this.defaultLang);
  }
}
