import { Vehicle } from '../vehicle/vehicle.model';

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
  // isToggleView: boolean = false;

  vehicleBorderGate: VehicleLoaded[]; // Phương tiện tại cửa khẩu không hàng
  vehicleOnTheRoad: VehicleLoaded[]; // Phương tiện trên đường
  listVehicleAtTheFactory: VehicleCompany[]; // danh sách phương tiện tại nhà máy
  listVehicleAtThePort: VehicleCompany[]; // danh sách phương tiện tại cảng

  constructor(obj?: Partial<Dashboard>) {
    this.totalVehicles = obj?.totalVehicles || 0;
    this.emptyVehicles = obj?.emptyVehicles || 0;
    this.loadedVehicles = obj?.loadedVehicles || 0;
    this.isReloadView = obj?.isReloadView || false;

    this.vehicleBorderGate = obj?.vehicleBorderGate || [];
    this.vehicleOnTheRoad = obj?.vehicleOnTheRoad || [];
    this.listVehicleAtTheFactory = obj?.listVehicleAtTheFactory || [];
    this.listVehicleAtThePort = obj?.listVehicleAtThePort || [];
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

export enum WidthEnum {
  auto = 0,
  small = 1 / 3,
  medium = 2 / 3,
  big = 3 / 3,
  alone = 12,
}

export class ClassCol {
  auto: string;
  small: string;
  medium: string;
  big: string;

  constructor(obj?: Partial<ClassCol>) {
    this.auto = obj?.auto || '';
    this.small = obj?.small || '';
    this.medium = obj?.medium || '';
    this.big = obj?.big || '';
  }
}
export class DashboardClassCol {
  A: ClassCol;
  B: ClassCol;
  C: ClassCol;
  D: ClassCol;
  constructor(obj?: Partial<DashboardClassCol>) {
    this.A = obj?.A || new ClassCol();
    this.B = obj?.B || new ClassCol();
    this.C = obj?.C || new ClassCol();
    this.D = obj?.D || new ClassCol();
  }

  public setUp() {
    this.A.auto = 'col-12';
    this.A.small = 'col-4';
    this.A.medium = 'col-8';
    this.A.big = 'col-12';

    this.B.auto = 'col-12 col-sm-6 col-lg-4';
    this.B.small = 'col-4';
    this.B.medium = 'col-8';
    this.B.big = 'col-12';

    this.C.auto = 'col-12 col-md-12 col-lg-4';
    this.C.small = 'col-4';
    this.C.medium = 'col-8';
    this.C.big = 'col-12';

    this.D.auto = 'col-12';
    this.D.small = 'col-4';
    this.D.medium = 'col-8';
    this.D.big = 'col-12';
  }
}
