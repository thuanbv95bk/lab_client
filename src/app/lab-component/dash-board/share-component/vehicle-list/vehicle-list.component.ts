import { Component, OnInit } from '@angular/core';
import { LocationEnum } from '../../enum/location.enum';
import { Vehicle } from '../../model/vehicle.model';
import { VehicleDataService } from '../../service/vehicle-data/vehicle-data.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
})

/** hiện danh sách xe
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class VehicleListComponent implements OnInit {
  /** danh sách xe */
  vehicles: Vehicle[] = [];
  /** Tổng số xe */
  numberVehicle: number = 0;
  /** bộ lọc xe */
  filteredVehicles: Vehicle[] = [];
  /** vị trí hiện tại của xe */
  locations = Object.values(LocationEnum);
  /** vị trí chọn */
  selectedLocation: string = '';
  /** vị trí chọn */
  selectedIsLoaded: string = '';

  constructor(private vehicleService: VehicleDataService) {}

  /** Lấy danh sách Vehicles
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  ngOnInit(): void {
    this.vehicles = this.vehicleService.getVehicles();
    this.filteredVehicles = [...this.vehicles];
    this.numberVehicle = this.filteredVehicles.length;
  }

  /** Lọc dah sách xe
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  async filterVehicles(): Promise<void> {
    this.filteredVehicles = await this.vehicles.filter(
      (vehicle) =>
        (this.selectedLocation ? vehicle.location == this.selectedLocation : true) &&
        (this.selectedIsLoaded !== '' ? vehicle.isLoaded.toString() == this.selectedIsLoaded : true)
    );
    this.numberVehicle = this.filteredVehicles.length;
  }
}
