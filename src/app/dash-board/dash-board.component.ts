import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})
export class DashBoardComponent {
  vehicleList = [
    '43C01338_C',
    '43C01339_C',
    '43C01340_C',
    '43C03402_C',
    '43C03880_C',
    '43C05815_C',
  ];

  chartValues = [
    { label: 'Cty Sedovina (trang thiết bị trường học)', value: 2 },
    { label: 'Keyhinge Hòa Cầm', value: 1 },
    { label: 'Sợi Phú Nam', value: 1 },
    { label: 'Sợi Thiên phú', value: 3 },
    { label: 'Vinaco next', value: 4 },
    { label: 'Window', value: 3 },
    { label: 'Appple', value: 3 },
  ];

  onSelectionChange(selectedItem: any) {
    console.log('Đã chọn:', selectedItem);
  }

  /**
   * Determines whether visible overview is
   *@description Ẩn hiện widget TỔNG QUAN CÔNG TY
   *@value true: hiện
   *@value false: Ẩn đi
   */
  isVisibleOverView: boolean = true;
  /**
   * Determines whether visible overview is
   *@description Ẩn hiện widget TỔNG QUAN CÔNG TY
   *@value True: hiện
   *@value false: Ẩn đi
   */

  /**
   * Determines whether visible border gate is
   * @description Ẩn hiện widget PHƯƠNG TIỆN TẠI CỬA KHẨU
   * true: hiện
   * false: Ẩn đi
   */
  isVisibleBorderGate: boolean = true;

  /**
   * Determines whether visible on the road is
   * @description Ẩn hiện widget PHƯƠNG TIỆN ĐANG TRÊN ĐƯỜNG
   * @value true: hiện
   * @value false: Ẩn đi
   */
  isVisibleOnTheRoad: boolean = true;
  /**
   * Determines whether visible at the factory
   * @description Ẩn hiện widget PHƯƠNG TIỆN TẠI NHÀ MÁY
   * @value true: hiện
   * @value false: Ẩn đi
   */
  isVisibleAtTheFactory: boolean = true;

  /**
   * Determines whether visible at the port is
   * @description Ẩn hiện widget PHƯƠNG TIỆN TẠI CẢNG
   * @value true: hiện
   * @value false: Ẩn đi
   */
  isVisibleAtThePort: boolean = true;

  widthSelected: string = '';

  constructor() {}

  ngAfterViewInit(): void {}

  onSelectedChange(selectedItems: any) {
    console.log('Mục đã chọn:', selectedItems);
  }
  change(x: string) {}

  onSelectedChangex(selectedItems: string[]) {
    console.log('Selected Items:', selectedItems);
  }
}
