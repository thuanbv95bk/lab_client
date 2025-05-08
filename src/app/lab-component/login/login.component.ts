import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { AppGlobals } from '../../app-global';
import { AuthService } from '../../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Menu, News, Branch, Languages } from './model/app-model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

/** LoginComponent màn hình đăng nhập
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class LoginComponent implements OnInit, OnDestroy {
  //#region Khởi tạo dữ liệu MasterData

  /** Khởi tạo các giá trị cho Menu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  listMenu: Menu[] = [
    {
      href: 'https://bagps.vn/',
      code: 'menuHome',
    },
    {
      href: 'https://bagps.vn/san-pham-va-giai-phap',
      code: 'menuService',
    },
    {
      href: 'https://bagps.vn/tin-tuc-c10',
      code: 'menuNews',
    },
    {
      href: 'https://bagps.vn/huong-dan-dong-phi-dich-vu-ba-gps-d610',
      code: 'menuPayFee',
    },
    {
      href: 'https://badoc.bagroup.vn/x/SAGhBg',
      code: 'menuInstruct',
    },
    {
      href: 'https://bagps.vn/mang-luoi',
      code: 'menuNetwork',
    },
    {
      href: 'https://bagps.vn/gioi-thieu/',
      code: 'menuAboutUs',
    },
  ];

  /** Danh sách các trang tin tức, và link của tin
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  listNew: News[] = [
    {
      index: 0,
      imageUrl: '../assets/image/baexpress.png',
      title: 'GIẢI PHÁP ĐIỀU HÀNH VẬN TẢI',
      shortContent: 'Camera giám sát ghi hình trong xe ô tô của BA GPS mang đến nhiều lợi ích cho doanh nghiệp vận tải.',
      link: 'https://bagps.vn/trich-xuat-du-lieu-mien-phi-tu-camera-giam-sat-d4221',
    },
    {
      index: 1,
      imageUrl: '../assets/image/chuc_mung_nam_moi.png',
      title: 'Thiết bị định vị ô tô 4G quản lý hành trình hiệu quả',
      shortContent:
        'Thiết bị định vị ô tô 4G đã và đang trở thành một giải pháp quản lý hành trình một cách hiệu quả của doanh nghiệp vận tải trên cả nước.',
      link: 'https://bagps.vn/thiet-bi-dinh-vi-o-to-4g-quan-ly-hanh-trinh-hieu-qua-d4220',
    },
    {
      index: 2,
      imageUrl: '../assets/image/BANNER_1.jpg',
      title: 'An tâm khi xe chở học sinh có camera ô tô',
      shortContent:
        'Có camera ô tô theo quy định sẽ giúp nhà trường và phụ huynh học sinh yên tâm hơn khi tin tưởng sử dụng dịch vụ cho con em mình.',
      link: 'https://bagps.vn/an-tam-khi-xe-cho-hoc-sinh-co-camera-o-to-d4219',
    },
    {
      index: 3,
      imageUrl: '../assets/image/staci_Tinh_nang_moi.jpg',
      title: 'Giám sát phương tiện theo ĐIỂM - VÙNG hiệu quả',
      shortContent:
        'Giám sát phương tiện theo điểm - vùng giúp doanh nghiệp vận tải theo dõi hành trình xe, tối ưu lộ trình, kiểm soát thời gian dừng đỗ và nâng cao hiệu quả quản lý..',
      link: 'https://bagps.vn/giam-sat-phuong-tien-theo-diem-vung-hieu-qua-d4217',
    },
    {
      index: 4,
      imageUrl: '../assets/image/Ship.jpg',
      title: 'Theo dõi và quản lý thời gian lái xe chuẩn Nghị định 71/ 2024/ TT - BCA',
      shortContent:
        'BA GPS cung cấp báo cáo chi tiết và đầy đủ dữ liệu thời lái xe và dữ liệu hình ảnh từ thiết bị ghi nhận hình ảnh người lái xe trên website quản trị, đồng thời quý khách cũng có thể dễ dàng tra cứu thời gian lái xe nhanh chóng ngay trên ứng dụng di động BA GPS..',
      link: 'https://bagps.vn/theo-doi-va-quan-ly-thoi-gian-lai-xe-theo-chuan-nghi-dinh-71-2024-tt-bca-d4216',
    },
  ];

  /**danh sách của các chi nhanh hiện ở footer
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  Listbranch: Branch[] = [
    {
      index: 0,
      name: 'TRỤ SỞ HÀ NỘI',
      address: [
        {
          index: 0,
          add: 'Lô 14 Nguyễn Cảnh Dị, P. Đại Kim, Q. Hoàng Mai, TP. Hà Nội.',
        },
      ],
    },

    {
      index: 1,
      name: 'HẢI PHÒNG',
      address: [
        {
          index: 0,
          add: 'Căn BH 01-47, KĐT Vinhomes Imperia, Đ. Bạch Đằng, P. Thượng Lý, Q. Hồng Bàng, TP. Hải Phòng.',
        },
      ],
    },
    {
      index: 2,
      name: 'CHI NHÁNH MIỀN TRUNG',
      address: [
        {
          index: 0,
          add: 'Số B5-15, ngõ 26, Đ. Nguyễn Thái Học, TP. Vinh, Nghệ An.',
        },
        {
          index: 1,
          add: 'Số 402, Đ. Trần Phú, X. Thạch Trung, TP. Hà Tĩnh, Hà Tĩnh.',
        },
      ],
    },
    {
      index: 3,
      name: 'ĐÀ NẴNG',
      address: [
        {
          index: 0,
          add: 'Lô 1 Khu B2-19, KĐT Biệt thự sinh thái, Công Viên Văn Hóa Làng Quê, P. Hòa Quý, Ngũ Hành Sơn, TP. Đà Nẵng.',
        },
      ],
    },

    {
      index: 4,
      name: 'TP. HỒ CHÍ MINH',
      address: [
        {
          index: 0,
          add: 'Số 9, Đường 37, KĐT Vạn Phúc, P. Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh.',
        },
      ],
    },
    {
      index: 5,
      name: 'THÁI NGUYÊN',
      address: [
        {
          index: 0,
          add: 'Công ty TNHH Định Vị Số, Địa chỉ: Số 158 Đ. Tân Lập, TP. Thái Nguyên, Thái Nguyên.',
        },
      ],
    },
  ];

  /**  List languages of layout grid component
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  listLanguages: Languages[] = [
    { code: 'vi', name: 'Tiếng Việt', flag: 'https://flagcdn.com/w40/vn.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  ];

  //#endregion

  //#region Khởi tạo biến

  /**Lưu userName */
  userName: string = '';
  /**Lưu passWord */
  passWord: string = '';
  /**Lưu isRememberMe ghi nhớ mật khẩu */
  isRememberMe: boolean = false;
  /** Ngôn ngử */
  getLanguages: string;
  selectedLang: Languages = new Languages();

  /**thứ tự của slide hiện tại*/
  currentSlide: number = 0;

  intervalId: any;

  /** thời gian để chuyển sang 1 slide mới */
  intervalSlide: number = 5000; // 5s
  //#endregion

  constructor(
    public commonService: CommonService,
    public translate: TranslateService,
    private authService: AuthService,
    public router: Router
  ) {
    this.getLanguages = AppGlobals.getLang();
    this.switchLanguage(this.getLanguages);
  }
  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  /** đăng nhập hệ thống
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  async login() {
    await this.authService.signIn(this.userName, this.passWord, this.isRememberMe);
  }

  /** Selects language
   * @param lang vi/en code của 1 ngôn ngử chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  selectedLanguage(lang: string) {
    this.switchLanguage(lang);
    AppGlobals.setLang(lang); // Lưu vào localStorage
  }

  /**  Switch language setting lại ngôn ngữ khi người dùng chọn từ giao diện
   * @param lang vi/en code của 1 ngôn ngử được chọn
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  switchLanguage(lang: string) {
    this.translate.use(lang);
    const _index = this.listLanguages.findIndex((x) => x.code == this.getLanguages);
    if (_index != -1) {
      this.selectedLang = this.listLanguages[_index];
    }
  }

  //#region

  /** start chạy slide
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.intervalSlide);
  }

  /**
   * Stop chạy slide
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /** chuyển slide
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  updateSlide(index: number) {
    this.currentSlide = index;
  }

  /** chuyển slide kê tiếp
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.listNew.length;
  }
  /** lùi slide kê tiếp
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.listNew.length) % this.listNew.length;
  }
  //#endregion

  /**
   * Go tab page mở tab chuyển đến trang yêu cầu
   * @param event link của trang cần mở
   */

  /**  mở tab chuyển đến trang yêu cầu
   * @Author thuan.bv
   * @param event link
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  goTabPage(event: string) {
    window.open(event, '_blank');
  }
}
