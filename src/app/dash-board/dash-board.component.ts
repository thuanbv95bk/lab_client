import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { VehicleDataService } from '../service/vehicle-data/vehicle-data.service';
import { Vehicle } from '../common/model/vehicle/vehicle.model';
import { Dashboard } from '../common/model/dashboard/dashboard.model';
import { LocationEnum } from '../common/model/vehicle/location.enum';
import { DashboardDoughnutComponent } from '../common/widget-item/dashboard-doughnut/dashboard-doughnut.component';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})
export class DashBoardComponent implements OnInit {
  vehicles: Vehicle[] = [];
  totalVehicles: number = 0;
  // dashboardModel: Dashboard | undefined;
  public dashboardModel: Dashboard | undefined;

  locationEnum = LocationEnum;

  chartValues = [
    { label: 'Cty Sedovina (trang thiết bị trường học)', value: 2 },
    { label: 'Keyhinge Hòa Cầm', value: 1 },
    { label: 'Sợi Phú Nam', value: 1 },
    { label: 'Sợi Thiên phú', value: 3 },
    { label: 'Vinaco next', value: 13 },
    // { label: 'Window', value: 3 },
    // { label: 'samsung', value: 3 },
    // { label: 'Nokia', value: 3 },
    // { label: 'oppo', value: 3 },
  ];
  chartValuesTheFactory = [
    { label: '504', value: 40 },
    { label: 'Anh Minh', value: 40 },
    { label: 'Anh Bữu, Đại đồng, Đại Lộc', value: 40 },
    { label: 'Anh Lợi Tĩnh', value: 40 },
    { label: 'An Phú Tải', value: 50 },
    { label: 'Anh Bữu (giác trầm, làm hương)', value: 40 },
    { label: 'Anh Bữu, Đại đồng, Đại Lộc', value: 40 },
    { label: 'Bãi 1/4 VSC Quy nhơn', value: 20 },
    { label: 'Bãi contemner chân thật', value: 10 },

    { label: 'Bãi contemner Công ty Hoàng Bão Anh', value: 30 },
    { label: 'Bãi contemner Hoàng Bão Anh', value: 60 },
    { label: 'Bãi contemner Hoàng Bão Anh (KCN BPA)', value: 40 },
    { label: 'Bãi dăm bạch đàn', value: 30 },
    { label: 'Bãi X50', value: 30 },
    { label: 'Bãi xe 223 Trường Chính (trả hàng)', value: 40 },
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

  constructor(private vehicleService: VehicleDataService) {
    this.totalVehicles = this.vehicles.length;
  }

  async ngOnInit(): Promise<void> {
    this.vehicles = await this.vehicleService.getVehicles();
    this.initData();
    // this.filteredVehicles = [...this.vehicles];
  }

  ngAfterViewInit(): void {}

  onSelectedChange(selectedItems: any) {
    console.log('Mục đã chọn:', selectedItems);
  }
  change(x: string) {}

  onSelectedChangeVehicle(selectedItems: Vehicle[]) {
    console.log('Selected Items:');
    console.log('Selected Items:', selectedItems);
  }

  initData() {
    this.dashboardModel = {
      totalVehicles: this.vehicles.length,
      emptyVehicles: this.vehicles.filter((x) => x.isLoaded == false).length,

      loadedVehicles: this.vehicles.filter((x) => x.isLoaded == true).length,

      emptyBorderGate: this.vehicles.filter(
        (x) => x.isLoaded == false && x.location == this.locationEnum.CuaKhau
      ).length,

      loadedBorderGate: this.vehicles.filter(
        (x) => x.isLoaded == true && x.location == this.locationEnum.CuaKhau
      ).length,
    };
    // this._TabDonHangComponent.ngOnChanges();
    console.log(this.dashboardModel);
  }
}
