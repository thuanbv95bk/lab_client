import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements AfterViewInit {
  /**
   * after view init
   * Tính toán chiều cao phần menu để trừ đi
   */
  ngAfterViewInit(): void {
    const navbar = document.querySelector('#main-navbar');
    const container = document.querySelector('#router-outlet-container');

    if (navbar && container) {
      const navbarHeight = navbar.clientHeight;
      container.setAttribute('style', `height: calc(100vh - ${navbarHeight}px); overflow: auto;`);
    }
  }
}
