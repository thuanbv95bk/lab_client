import { Subscription } from 'rxjs';
import { LocationEnum, SizeEnum, TypeChartEnum } from '../enum/location.enum';
import { Vehicle } from './vehicle.model';
import { WidgetUpdateDataService } from '../service/vehicle-data/widget-update-data.service';

/** các thuộc tính của 1 Widget
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export class Widget {
  orderValue: number = 0;
  title: string = '';
  color: string = '';
  backgroundColor: string = '';
  setClassForChild: string = '';
  location!: LocationEnum;
  isVisible: boolean = true;
  chartType!: TypeChartEnum;
  currentSize!: SizeEnum;
  // Sử dụng Observable thay vì dữ liệu tĩnh
  dataModel: Vehicle[] = [];
  private subscription!: Subscription;
  constructor(obj?: Partial<Widget>, private updateDataService?: WidgetUpdateDataService) {
    this.orderValue = obj?.orderValue || 0;
    this.title = obj?.title || '';
    this.color = obj?.color || '';
    this.backgroundColor = obj?.backgroundColor || '';
    this.setClassForChild = obj?.setClassForChild || '';
    this.isVisible = obj?.isVisible || true;
    this.chartType = obj?.chartType!;
    this.location = obj?.location!;
    this.dataModel = obj?.dataModel || [];
    this.currentSize = obj?.currentSize || SizeEnum.Auto;
    // Nếu có vehicleService, lắng nghe filteredVehicles$
    if (this.updateDataService) {
      this.subscription = this.updateDataService.filteredVehicles$.subscribe((vehicles) => {
        this.dataModel = vehicles;
      });
    }
  }
  // Hủy subscribe khi widget bị xóa
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

/** Cấu hình class cho từng kích thước của widget theo location
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class WidgetSizeConfig {
  //
  private static readonly sizeConfig: Record<LocationEnum, Record<SizeEnum, string>> = {
    [LocationEnum.TongQuan]: {
      auto: 'col-12 flex-grow-1',
      small: 'col-12 col-md-4',
      medium: 'col-12 col-md-8',
      large: 'col-12',
    },
    [LocationEnum.CuaKhau]: {
      auto: 'col-12 col-sm-6 col-lg-4 flex-grow-1',
      small: 'col-12 col-md-4',
      medium: 'col-12 col-md-8',
      large: 'col-12',
    },
    [LocationEnum.TrenDuong]: {
      auto: 'col-12 col-sm-6 col-lg-4 flex-grow-1',
      small: 'col-12 col-md-4',
      medium: 'col-12 col-md-8',
      large: 'col-12',
    },
    [LocationEnum.NhaMay]: {
      auto: 'col-12 col-md-6 col-lg-4 flex-grow-1',
      small: 'col-12 col-md-4',
      medium: 'col-12 col-md-8',
      large: 'col-12',
    },
    [LocationEnum.TaiCang]: {
      auto: 'col-12 col-md-4 col-lg-4 flex-grow-1',
      small: 'col-12 col-md-4',
      medium: 'col-12 col-md-8',
      large: 'col-12',
    },
  };

  /** Trạng thái kích thước hiện tại cho từng location
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  private static currentSize: Record<LocationEnum, SizeEnum> = {
    [LocationEnum.TongQuan]: SizeEnum.Auto,
    [LocationEnum.CuaKhau]: SizeEnum.Auto,
    [LocationEnum.TrenDuong]: SizeEnum.Auto,
    [LocationEnum.NhaMay]: SizeEnum.Auto,
    [LocationEnum.TaiCang]: SizeEnum.Auto,
  };

  /** Lấy class theo `currentSize` của một location
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  static getClass(location: LocationEnum): string {
    const size = this.currentSize[location] ?? SizeEnum.Auto;
    return this.sizeConfig[location]?.[size];
  }

  /** Cập nhật `currentSize` cho một location
   * @param location Vị trí widget
   * @param size Kích thước mới
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  static setCurrentSize(location: LocationEnum, size: SizeEnum): void {
    if (this.sizeConfig[location] && this.sizeConfig[location][size]) {
      this.currentSize[location] = size;
    }
  }

  /** Lấy `currentSize` của một location
   * @param location Vị trí widget
   * @returns Kích thước hiện tại (SizeEnum)
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  static getCurrentSize(location: LocationEnum): SizeEnum {
    return this.currentSize[location];
  }
}
