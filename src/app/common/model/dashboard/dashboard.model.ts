import { Subscription } from 'rxjs';
import { LocationEnum, TypeChartEnum } from '../enum/location.enum';
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
  constructor(
    obj?: Partial<Widget>,
    private updateDataService?: WidgetUpdateDataService
  ) {
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
      this.subscription = this.updateDataService.filteredVehicles$.subscribe(
        (vehicles) => {
          this.dataModel = vehicles;
        }
      );
    }
  }
  // Hủy subscribe khi widget bị xóa
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
