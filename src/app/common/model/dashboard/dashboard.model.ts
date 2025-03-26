import { Vehicle } from '../vehicle/vehicle.model';

export interface Dashboard {
  totalVehicles: number | 0;
  emptyVehicles: number | 0; // Phương tiện không hàng
  loadedVehicles: number | 0; // Phương tiện có hàng

  emptyBorderGate: number; // Phương tiện không hàng
  loadedBorderGate: number; // Phương tiện có hàng

  // listVehiclesBorderGate: Vehicle[]; // danh sách phương tiện tại cửa khẩu
}

export interface VehiclesByType extends Vehicle {
  type: string; // loại
}
