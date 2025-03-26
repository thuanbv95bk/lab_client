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
  dashboardModel = new Dashboard();
  locationEnum = LocationEnum;
  filteredVehicles: Vehicle[] = [];

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
  @ViewChild(DashboardDoughnutComponent, { static: false })
  borderGate!: DashboardDoughnutComponent;

  @ViewChild(DashboardDoughnutComponent, { static: false })
  onTheRoad!: DashboardDoughnutComponent;

  constructor(private vehicleService: VehicleDataService) {
    this.totalVehicles = this.vehicles.length;
  }

  async ngOnInit(): Promise<void> {
    this.vehicles = await this.vehicleService.getVehicles();
    this.filteredVehicles = [...this.vehicles];
    this.getDataToDashBoard(this.filteredVehicles);
  }

  onSelectedChangeVehicle(selectedItems: Vehicle[]) {
    this.getDataToDashBoard(selectedItems);
  }

  getDataToDashBoard(listVehicles: Vehicle[]) {
    this.dashboardModel = {
      totalVehicles: 0,
      emptyVehicles: 0,
      loadedVehicles: 0,
      vehicleBorderGate: [],
      vehicleOnTheRoad: [],
      listVehicleAtTheFactory: [],
      listVehicleAtThePort: [],
    };

    this.dashboardModel = {
      totalVehicles: listVehicles.length,
      emptyVehicles: listVehicles.filter((x) => x.isLoaded == false).length,

      loadedVehicles: listVehicles.filter((x) => x.isLoaded == true).length,

      vehicleBorderGate: this.vehicleService.getSummary(
        listVehicles,
        this.locationEnum.CuaKhau
      ),
      vehicleOnTheRoad: this.vehicleService.getSummary(
        listVehicles,
        this.locationEnum.TrenDuong
      ),

      listVehicleAtTheFactory: this.vehicleService.getCompanySummary(
        listVehicles.filter((x) => x.location == this.locationEnum.NhaMay)
      ),
      listVehicleAtThePort: this.vehicleService.getCompanySummary(
        listVehicles.filter((x) => x.location == this.locationEnum.TaiCang)
      ),
    };
    console.log(this.dashboardModel);
  }

  refreshOverView() {
    this.dashboardModel.totalVehicles = this.filteredVehicles.length;
    this.dashboardModel.emptyVehicles = this.filteredVehicles.filter(
      (x) => x.isLoaded == false
    ).length;
    this.dashboardModel.loadedVehicles = this.filteredVehicles.filter(
      (x) => x.isLoaded == true
    ).length;
  }

  refreshBorderGate() {
    this.dashboardModel.vehicleBorderGate = this.vehicleService.getSummary(
      this.filteredVehicles,
      this.locationEnum.CuaKhau
    );
  }
  refreshOnTheRoad() {
    this.dashboardModel.vehicleOnTheRoad = this.vehicleService.getSummary(
      this.filteredVehicles,
      this.locationEnum.TrenDuong
    );
  }
  refreshAtTheFactory() {
    this.dashboardModel.listVehicleAtTheFactory =
      this.vehicleService.getCompanySummary(
        this.filteredVehicles.filter(
          (x) => x.location == this.locationEnum.NhaMay
        )
      );
  }
  refreshAtThePort() {
    this.dashboardModel.listVehicleAtThePort =
      this.vehicleService.getCompanySummary(
        this.filteredVehicles.filter(
          (x) => x.location == this.locationEnum.TaiCang
        )
      );
  }
}
