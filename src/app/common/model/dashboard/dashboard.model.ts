import { Vehicle } from '../vehicle/vehicle.model';

export class Dashboard {
  totalVehicles: number | 0;
  emptyVehicles: number | 0; // Phương tiện không hàng
  loadedVehicles: number | 0; // Phương tiện có hàng
  isReloadView: boolean;
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

export interface VehiclesByType extends Vehicle {
  type: string; // loại
}

export interface VehicleCompany {
  company: string;
  value: number;
}
export interface VehicleLoaded {
  key: string;
  value: number;
}
