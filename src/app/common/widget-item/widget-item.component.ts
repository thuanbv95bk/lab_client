import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { VehicleWidgetComponent } from '../chart-items/vehicle-widget/vehicle-widget.component';
import { LocationEnum, TypeChartEnum } from '../model/vehicle/location.enum';
import { DashboardDoughnutComponent } from '../chart-items/dashboard-doughnut/dashboard-doughnut.component';
import {
  VehicleCompany,
  VehicleLoaded,
} from '../model/dashboard/dashboard.model';
import { BarChartComponent } from '../chart-items/bar-chart/bar-chart.component';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrl: './widget-item.component.scss',
})
export class WidgetItemComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() isVisible: boolean = true;
  @Input() setClassForChild: string = '';
  @Input() chartType!: TypeChartEnum;
  @Input() location!: LocationEnum;
  @Input() color: string = '';
  @Output() eventWidthSelected = new EventEmitter<any>();
  @Output() eventRefreshData = new EventEmitter<any>();
  typeChartEnum = TypeChartEnum;

  @Input() dataModel: any;

  locationEnum = LocationEnum;

  dynamicComponentData: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setDashboardToComponent();
    }, 100);
  }

  setDashboardToComponent() {
    if (this.chartType == this.typeChartEnum.vehicleWidget) {
      this.dynamicComponentData = {
        component: VehicleWidgetComponent,
        inputs: {
          dataModel: this.dataModel,
          setClass: this.setClassForChild,
        },
      };
    } else if (this.chartType == this.typeChartEnum.doughnut) {
      const data = this.dataModel as VehicleLoaded;
      this.dynamicComponentData = {
        component: DashboardDoughnutComponent,
        inputs: {
          dataModel: data,
        },
      };
    } else if (this.chartType == this.typeChartEnum.bar) {
      const data = this.dataModel as VehicleCompany;

      this.dynamicComponentData = {
        component: BarChartComponent,
        inputs: {
          dataModel: data,
          minLabelWidth: 100,
          defaultVisibleItems: 3,
          barColor: this.color,
        },
      };
    }
  }

  /**
   * Changes width selected
   * @event sự kiện click chọn option thay đỗi kích
   * thước màn hình của các widget
   * @param selectWidth
   * @param locationEnum vị trí tương ứng định nghĩa ở enum location
   */

  changeWidthSelected(
    size: 'auto' | 'small' | 'medium' | 'large',
    location: LocationEnum
  ) {
    console.log(size);

    // xử lý khi resize với 2 biểu đồ Doughnut,
    // fix lỗi phải click vào màn hinh mới tự đông cập nhật 2 biểu đồ về đùng vị trí
    // => do chart.js của 2 biểu đồ này còn hạn chế

    // if (
    //   location == this.locationEnum.CuaKhau ||
    //   location == this.locationEnum.TrenDuong
    // ) {
    //   this.chartsDoughnut.forEach((chart) => chart.buildChart());
    // }

    // xử lý khi chọn widget tổng quan là : small hoặc medium thì các dashboard bên trong phải set về 3 hàng
    if (
      location == this.locationEnum.TongQuan &&
      (size == 'small' || size == 'medium')
    ) {
      this.setClassForChild = 'col-12';
      this.setDashboardToComponent();
    } else if (
      location == this.locationEnum.TongQuan &&
      (size == 'auto' || size == 'large')
    ) {
      this.setClassForChild = 'col-12 col-sm-4';
      this.setDashboardToComponent();
    }
    this.eventWidthSelected.emit(size);
  }

  refreshData(location: LocationEnum) {
    this.eventRefreshData.emit(location);
    this.setDashboardToComponent();
  }
}
