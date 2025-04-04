import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { VehicleDataService } from '../service/vehicle-data/vehicle-data.service';
import { Vehicle } from '../common/model/enum/vehicle.model';
import { Widget, WidgetSizeConfig } from '../common/model/dashboard/dashboard.model';
import { LocationEnum, SizeEnum, TypeChartEnum } from '../common/model/enum/location.enum';
import { WidgetItemComponent } from '../common/widget-item/widget-item.component';
import { WidgetUpdateDataService } from '../service/widget-update-data.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})
export class DashBoardComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = []; // Danh sách xe
  filteredVehicles: Vehicle[] = []; // danh sách xe được chọn
  isAllSelectedVehicles: boolean = false;

  setOverViewClass = 'col-12 col-sm-4'; // class mặc định cho widget tổng quan công ty

  widgetOverView!: Widget; // widget tổng quan công ty
  widgetBorderGate!: Widget; // widget tại cửa khẩu
  widgetOnTheRoad!: Widget; // widget trên đường
  widgetAtTheFactory!: Widget; // widget tại nhà máy
  widgetAtThePort!: Widget; // widget tại cảng

  widgetSizeConfig = WidgetSizeConfig;

  /**
   * Interval refresh of dash board component
   * @description Thời gian để tải lại dữ liệu
   * @value Mặc đinh 5 phút
   */

  intervalRefresh: number = 300000; //5000
  intervalId: any;

  @ViewChildren(WidgetItemComponent)
  WidgetItem!: QueryList<WidgetItemComponent>;

  constructor(private vehicleService: VehicleDataService, private widgetUpdateDataService: WidgetUpdateDataService) {
    this.widgetOverView = new Widget(
      {
        orderValue: 1,
        title: 'TỔNG QUAN CÔNG TY',
        color: '',
        location: LocationEnum.TongQuan,
        isVisible: true,
        setClassForChild: this.setOverViewClass,
        chartType: TypeChartEnum.vehicleWidget,
      },
      this.widgetUpdateDataService
    );

    this.widgetBorderGate = new Widget(
      {
        orderValue: 2,
        title: 'PHƯƠNG TIỆN TẠI CỬA KHẨU',
        color: '',
        location: LocationEnum.CuaKhau,
        isVisible: true,
        setClassForChild: '',
        chartType: TypeChartEnum.doughnut,
      },
      this.widgetUpdateDataService
    );

    this.widgetOnTheRoad = new Widget(
      {
        orderValue: 3,
        title: 'PHƯƠNG TIỆN ĐANG TRÊN ĐƯỜNG',
        color: '',
        location: LocationEnum.TrenDuong,
        isVisible: true,
        setClassForChild: '',
        chartType: TypeChartEnum.doughnut,
        dataModel: this.filteredVehicles,
      },
      this.widgetUpdateDataService
    );

    this.widgetAtTheFactory = new Widget(
      {
        orderValue: 1,
        title: 'PHƯƠNG TIỆN TẠI NHÀ MÁY',
        color: '#e63946',
        location: LocationEnum.NhaMay,
        isVisible: true,
        setClassForChild: '',
        chartType: TypeChartEnum.bar,
        dataModel: this.filteredVehicles,
      },
      this.widgetUpdateDataService
    );

    this.widgetAtThePort = new Widget(
      {
        orderValue: 1,
        title: 'PHƯƠNG TIỆN TẠI CẢNG',
        color: '#20C997',
        location: LocationEnum.TaiCang,
        isVisible: true,
        setClassForChild: '',
        chartType: TypeChartEnum.bar,
        dataModel: this.filteredVehicles,
      },
      this.widgetUpdateDataService
    );
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.updateFilteredVehicles(this.filteredVehicles);
    this.startInterval();
  }

  ngOnDestroy() {
    this.stopInterval();
    this.widgetOverView.destroy(); // Hủy đăng ký Observable khi component bị hủy
    this.widgetBorderGate.destroy(); // Hủy đăng ký Observable khi component bị hủy
    this.widgetOnTheRoad.destroy(); // Hủy đăng ký Observable khi component bị hủy
    this.widgetAtTheFactory.destroy(); // Hủy đăng ký Observable khi component bị hủy
    this.widgetAtThePort.destroy(); // Hủy đăng ký Observable khi component bị hủy
  }

  /**
   * Inits data
   * @description Khởi tạo dữ liệu của danh sách xe
   * @author thuan.bv
   */

  async initData() {
    this.vehicles = await this.vehicleService.getVehicles();
    this.filteredVehicles = [...this.vehicles];
  }

  /**
   * Updates filtered vehicles
   * Cập nhật danh sách của xe để loading về cho các widget
   * @param listVehicles  danh sách xe muốn truyền đi
   */
  updateFilteredVehicles(listVehicles: Vehicle[]) {
    this.widgetUpdateDataService.updateFilteredVehicles(listVehicles);
    this.WidgetItem.forEach((x) => x.setDashboardToComponent());
  }

  /**
   * Starts interval
   * @description Bật time để cho loading dữ liệu :
   * Theo thời gian : intervalRefresh : 5 phút
   */
  startInterval() {
    this.intervalId = setInterval(async () => {
      await this.initData();
      this.updateFilteredVehicles(this.filteredVehicles);
    }, this.intervalRefresh);
  }

  /**
   * Stops interval
   * Xóa interval
   */
  stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Determines whether selected change vehicle on
   * @description event khi chọn xe từ select màn hình
   * @param selectedItems : danh sách xe đã chọn/click ở màn hình
   * @description Hàm này đồng thời tính toán dữ liệu để đẩy sang đồng bộ với các widget
   */
  onSelectedChangeVehicle(selectedItems: Vehicle[]) {
    if (selectedItems.length == 0) {
      selectedItems = [...this.vehicles];
    }

    this.updateFilteredVehicles(selectedItems);
  }

  /**
   * @event sự kiện click chọn option thay đỗi kích
   * thước màn hình của các widget
   * @param selectWidth
   * @param locationEnum vị trí tương ứng định nghĩa ở enum location
   */

  changeWidthSelected(size: SizeEnum, location: LocationEnum) {
    this.widgetSizeConfig.setCurrentSize(location, size);
  }

  /**
   * Gets widget class
   * set class lại cho col
   * @param location LocationEnum
   * @returns widget class
   */
  getWidgetClass(location: LocationEnum): string {
    return this.widgetSizeConfig.getClass(location);
  }
}
