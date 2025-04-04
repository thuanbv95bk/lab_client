import { Subscription } from 'rxjs';
import { LocationEnum, SizeEnum, TypeChartEnum } from '../enum/location.enum';
import { Vehicle } from '../enum/vehicle.model';
import { WidgetUpdateDataService } from '../../../service/widget-update-data.service';

export class Widget {
  orderValue: number = 0;
  title: string = '';
  color: string = '';
  backgroundColor: string = '';
  setClassForChild: string = '';
  location!: LocationEnum;
  isVisible: boolean = true;
  chartType!: TypeChartEnum;
  currentSize!: 'auto' | 'small' | 'medium' | 'large';

  dataModel: Vehicle[] = []; // Sử dụng Observable thay vì dữ liệu tĩnh
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
    this.currentSize = obj?.currentSize || 'auto';
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

export class WidgetSizeConfig {
  // Cấu hình class cho từng kích thước của widget theo location
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

  // Trạng thái kích thước hiện tại cho từng location
  private static currentSize: Record<LocationEnum, SizeEnum> = {
    [LocationEnum.TongQuan]: SizeEnum.auto,
    [LocationEnum.CuaKhau]: SizeEnum.auto,
    [LocationEnum.TrenDuong]: SizeEnum.auto,
    [LocationEnum.NhaMay]: SizeEnum.auto,
    [LocationEnum.TaiCang]: SizeEnum.auto,
  };

  /**
   * Lấy class theo `currentSize` của một location
   * @param location Vị trí widget
   * @returns Class tương ứng
   */
  static getClass(location: LocationEnum): string {
    const size = this.currentSize[location] ?? SizeEnum.auto;
    console.log(size);

    return this.sizeConfig[location]?.[size];
  }

  /**
   * Cập nhật `currentSize` cho một location
   * @param location Vị trí widget
   * @param size Kích thước mới
   */
  static setCurrentSize(location: LocationEnum, size: SizeEnum): void {
    if (this.sizeConfig[location] && this.sizeConfig[location][size]) {
      this.currentSize[location] = size;
    }
  }

  /**
   * Lấy `currentSize` của một location
   * @param location Vị trí widget
   * @returns Kích thước hiện tại (SizeEnum)
   */
  static getCurrentSize(location: LocationEnum): SizeEnum {
    return this.currentSize[location];
  }
}
