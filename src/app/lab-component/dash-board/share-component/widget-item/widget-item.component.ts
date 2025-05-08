import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleWidgetComponent } from '../../chart-item/vehicle-widget/vehicle-widget.component';
import { LocationEnum, SizeEnum, TypeChartEnum } from '../../enum/location.enum';
import { DashboardDoughnutComponent } from '../../chart-item/dashboard-doughnut/dashboard-doughnut.component';
import { BarChartComponent } from '../../chart-item/bar-chart/bar-chart.component';
import { Widget } from '../../model/dashboard.model';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrl: './widget-item.component.scss',
})
/** Component dùng chung, để setup cho 1 widget
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class WidgetItemComponent implements AfterViewInit {
  /** Input 1 widget */
  @Input() widget!: Widget;
  /**  Output SizeEnum*/
  @Output() eventWidthSelected = new EventEmitter<SizeEnum>();

  /**  Output LocationEnum*/
  @Output() eventRefreshData = new EventEmitter<LocationEnum>();

  /** Component */
  dynamicComponentData: any;

  /** setTimeout, đưa widget vào Component
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setDashboardToComponent();
    }, 100);
  }

  /** build các component khi thiết lập giao diện
   * đồng thời dùng để update lại dữ liệu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  setDashboardToComponent() {
    if (this.widget.chartType == TypeChartEnum.VehicleWidget) {
      this.dynamicComponentData = {
        component: VehicleWidgetComponent,
        inputs: {
          widget: this.widget,
        },
      };
    } else if (this.widget.chartType == TypeChartEnum.Doughnut) {
      this.dynamicComponentData = {
        component: DashboardDoughnutComponent,
        inputs: {
          widget: this.widget,
        },
      };
    } else if (this.widget.chartType == TypeChartEnum.Bar) {
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

  /** sự kiện click chọn option thay đỗi kích thước màn hình của các widget
   * @param selectWidth size màn hình
   * @param locationEnum vị trí tương ứng định nghĩa ở enum location
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  changeWidthSelected(size: SizeEnum, location: LocationEnum) {
    // xử lý khi chọn widget tổng quan là : small hoặc medium thì các dashboard bên trong phải set về 3 hàng
    if (location == LocationEnum.TongQuan && (size == SizeEnum.Small || size == SizeEnum.Medium)) {
      this.widget.setClassForChild = 'col-12';
      this.setDashboardToComponent();
    } else if (location == LocationEnum.TongQuan && (size == SizeEnum.Auto || size == SizeEnum.Large)) {
      this.widget.setClassForChild = 'col-12 col-sm-4';
      this.setDashboardToComponent();
    }
    this.eventWidthSelected.emit(size);
  }

  /** Tải lại dữ liệu cho từng widget tương ứng
   * @param  @param location các vị trí của xe
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  refreshData(location: LocationEnum) {
    this.eventRefreshData.emit(location);
    this.setDashboardToComponent();
  }
}
