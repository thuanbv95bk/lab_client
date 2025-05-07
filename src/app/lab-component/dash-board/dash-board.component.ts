import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { WidgetItemComponent } from './share-component/widget-item/widget-item.component';
import { WidgetUpdateDataService } from './service/vehicle-data/widget-update-data.service';
import { VehicleDataService } from './service/vehicle-data/vehicle-data.service';
import { Vehicle } from './model/vehicle.model';
import { LocationEnum, SizeEnum, TypeChartEnum } from './enum/location.enum';
import { Widget, WidgetSizeConfig } from './model/dashboard.model';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})

/** Component => hiển thị màn hinh dash board
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class DashBoardComponent implements OnInit, OnDestroy {
  /** Danh sách xe */
  vehicles: Vehicle[] = [];
  /** danh sách xe được chọn */
  filteredVehicles: Vehicle[] = [];
  /** Chọn all xe */
  isAllSelectedVehicles: boolean = false;

  /** class mặc định cho widget tổng quan công ty */
  setOverViewClass = 'col-12 col-sm-4'; //

  /** widget tổng quan công ty */
  widgetOverView!: Widget;
  /** widget tại cửa khẩu */
  widgetBorderGate!: Widget;
  /** widget trên đường */
  widgetOnTheRoad!: Widget;
  /** widget tại nhà máy */
  widgetAtTheFactory!: Widget;
  /** widget tại cảng */
  widgetAtThePort!: Widget;

  /** setup vị trí */
  widgetSizeConfig = WidgetSizeConfig;

  /** enum các kích thước */
  sizeEnum = SizeEnum;

  /**Thời gian để tải lại dữ liệu, Mặc đinh 5 phút
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  intervalRefresh: number = 300000;
  /** intervalId  */
  intervalId: any;

  @ViewChildren(WidgetItemComponent)
  WidgetItem!: QueryList<WidgetItemComponent>;

  constructor(private vehicleService: VehicleDataService, private widgetUpdateDataService: WidgetUpdateDataService) {
    /** Set các giá trị cho các Widget
     * @Author thuan.bv
     * @Created 23/04/2025
     * @Modified date - user - description
     */
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

  /** khởi tạo giá trị ban đầu
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.updateFilteredVehicles(this.filteredVehicles);
    this.startInterval();
  }

  /** Hủy đăng ký Observable khi component bị hủy
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  ngOnDestroy() {
    this.stopInterval();
    // Hủy đăng ký Observable khi component bị hủy
    this.widgetOverView.destroy();
    this.widgetBorderGate.destroy();
    this.widgetOnTheRoad.destroy();
    this.widgetAtTheFactory.destroy();
    this.widgetAtThePort.destroy();
  }

  /** Khởi tạo dữ liệu của danh sách xe
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  async initData() {
    this.vehicles = await this.vehicleService.getVehicles();
    this.filteredVehicles = [...this.vehicles];
  }

  /** Cập nhật danh sách của xe để loading về cho các widget
   * @param listVehicles  danh sách xe muốn truyền đi
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  updateFilteredVehicles(listVehicles: Vehicle[]) {
    this.widgetUpdateDataService.updateFilteredVehicles(listVehicles);
    this.WidgetItem.forEach((x) => x.setDashboardToComponent());
  }

  /** Bật time để cho loading dữ liệu :
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  startInterval() {
    this.intervalId = setInterval(async () => {
      await this.initData();
      this.updateFilteredVehicles(this.filteredVehicles);
    }, this.intervalRefresh);
  }

  /**  Xóa interval
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /** Hàm này đồng thời tính toán dữ liệu để đẩy sang đồng bộ với các widget, event khi chọn xe từ select màn hình
   * @param selectedItems : danh sách xe đã chọn/click ở màn hình
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  onSelectedChangeVehicle(selectedItems: Vehicle[]) {
    if (selectedItems.length == 0) {
      selectedItems = [...this.vehicles];
    }
    this.filteredVehicles = selectedItems;

    this.updateFilteredVehicles(this.filteredVehicles);
  }

  /** sự kiện click chọn option thay đỗi kích
   * @param selectWidth  kích thước
   * @param locationEnum  vị trí tương ứng định nghĩa ở enum location
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  changeWidthSelected(widget: Widget, size: SizeEnum) {
    widget.currentSize = size;
    this.widgetSizeConfig.setCurrentSize(widget.location, size);
  }

  /** set class lại cho col
   * @param location LocationEnum
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getWidgetClass(location: LocationEnum): string {
    return this.widgetSizeConfig.getClass(location);
  }
}
