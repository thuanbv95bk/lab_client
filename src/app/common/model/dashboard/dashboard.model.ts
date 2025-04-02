import { CardWidgetModel } from '../vehicle/vehicle.model';

/**
 * Dashboard
 * @description dữ liệu để đẩy vào các widget hiển thị dữ liệu
 * @author thuan.bv
 */
export class Dashboard {
  totalVehicles: number | 0; // tổng xe
  emptyVehicles: number | 0; // Phương tiện không hàng
  loadedVehicles: number | 0; // Phương tiện có hàng
  isReloadView: boolean; // trigger để loading lại màn hình của widget
  listCardWidgetModel: CardWidgetModel[];
  vehicleBorderGate: VehicleLoaded[]; // Phương tiện tại cửa khẩu không hàng
  vehicleOnTheRoad: VehicleLoaded[]; // Phương tiện trên đường
  listVehicleAtTheFactory: VehicleCompany[]; // danh sách phương tiện tại nhà máy
  listVehicleAtThePort: VehicleCompany[]; // danh sách phương tiện tại cảng

  constructor(obj?: Partial<Dashboard>) {
    this.totalVehicles = obj?.totalVehicles || 0;
    this.emptyVehicles = obj?.emptyVehicles || 0;
    this.loadedVehicles = obj?.loadedVehicles || 0;
    this.isReloadView = obj?.isReloadView || false;
    this.listCardWidgetModel = obj?.listCardWidgetModel || [];

    this.vehicleBorderGate = obj?.vehicleBorderGate || [];
    this.vehicleOnTheRoad = obj?.vehicleOnTheRoad || [];
    this.listVehicleAtTheFactory = obj?.listVehicleAtTheFactory || [];
    this.listVehicleAtThePort = obj?.listVehicleAtThePort || [];
  }

  setDataToVehicleWidget() {
    this.listCardWidgetModel = [];
    const cardWidgetModel1 = new CardWidgetModel();
    cardWidgetModel1.backgroundColor = '#006ADC';
    cardWidgetModel1.title = 'Phương tiện của công ty';
    cardWidgetModel1.totalVehicles = this.totalVehicles;
    cardWidgetModel1.numberVehicle = this.totalVehicles;
    cardWidgetModel1.isDisplayFooter = false;
    cardWidgetModel1.isReloadView = true;

    this.listCardWidgetModel.push(cardWidgetModel1);
    const cardWidgetMode2 = new CardWidgetModel();
    cardWidgetMode2.backgroundColor = '#509447';
    cardWidgetMode2.title = 'Phương tiện có hàng';
    cardWidgetMode2.totalVehicles = this.totalVehicles;
    cardWidgetMode2.numberVehicle = this.loadedVehicles;
    cardWidgetMode2.isDisplayFooter = true;
    this.listCardWidgetModel.push(cardWidgetMode2);
    const cardWidgetModel3 = new CardWidgetModel();
    cardWidgetModel3.backgroundColor = '#E2803C';
    cardWidgetModel3.title = 'Phương tiện không hàng';
    cardWidgetModel3.totalVehicles = this.totalVehicles;
    cardWidgetModel3.numberVehicle = this.emptyVehicles;
    cardWidgetModel3.isDisplayFooter = true;
    this.listCardWidgetModel.push(cardWidgetModel3);
  }
}

export interface VehicleCompany {
  company: string;
  value: number;
}
export interface VehicleLoaded {
  key: string;
  value: number;
}
