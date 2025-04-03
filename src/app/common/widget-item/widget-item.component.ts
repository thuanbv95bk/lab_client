import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { VehicleWidgetComponent } from '../chart-items/vehicle-widget/vehicle-widget.component';
import { LocationEnum, TypeChartEnum } from '../model/enum/location.enum';
import { DashboardDoughnutComponent } from '../chart-items/dashboard-doughnut/dashboard-doughnut.component';
import { Widget } from '../model/dashboard/dashboard.model';
import { BarChartComponent } from '../chart-items/bar-chart/bar-chart.component';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrl: './widget-item.component.scss',
})
export class WidgetItemComponent implements AfterViewInit {
  @Input() widget!: Widget;
  @Output() eventWidthSelected = new EventEmitter<any>();
  @Output() eventRefreshData = new EventEmitter<any>();
  typeChartEnum = TypeChartEnum;
  locationEnum = LocationEnum;
  dynamicComponentData: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setDashboardToComponent();
    }, 100);
  }

  /**
   * Sets dashboard to component
   * build các component khi thiết lập giao diện
   * đồng thời dùng để update lại dữ liệu
   */
  setDashboardToComponent() {
    if (this.widget.chartType == this.typeChartEnum.vehicleWidget) {
      this.dynamicComponentData = {
        component: VehicleWidgetComponent,
        inputs: {
          widget: this.widget,
        },
      };
    } else if (this.widget.chartType == this.typeChartEnum.doughnut) {
      this.dynamicComponentData = {
        component: DashboardDoughnutComponent,
        inputs: {
          widget: this.widget,
        },
      };
    } else if (this.widget.chartType == this.typeChartEnum.bar) {
      this.dynamicComponentData = {
        component: BarChartComponent,
        inputs: {
          widget: this.widget,
          minLabelWidth: 100,
          defaultVisibleItems: 3,
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
    // xử lý khi chọn widget tổng quan là : small hoặc medium thì các dashboard bên trong phải set về 3 hàng
    if (
      location == this.locationEnum.TongQuan &&
      (size == 'small' || size == 'medium')
    ) {
      this.widget.setClassForChild = 'col-12';
      this.setDashboardToComponent();
    } else if (
      location == this.locationEnum.TongQuan &&
      (size == 'auto' || size == 'large')
    ) {
      this.widget.setClassForChild = 'col-12 col-sm-4';
      this.setDashboardToComponent();
    }
    this.eventWidthSelected.emit(size);
  }

  /**
   * Tải lại dữ liệu cho từng widget tương ứng
   * @param location
   */
  refreshData(location: LocationEnum) {
    this.eventRefreshData.emit(location);
    this.setDashboardToComponent();
  }
}
