import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vehicle } from '../../model/vehicle.model';

@Injectable({
  providedIn: 'root',
})

/** Service để cập nhật lại danh sách xe=> cho các widget
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class WidgetUpdateDataService {
  private _filteredVehicles = new BehaviorSubject<Vehicle[]>([]);
  filteredVehicles$ = this._filteredVehicles.asObservable();

  // Cập nhật danh sách xe
  updateFilteredVehicles(newVehicles: Vehicle[]) {
    this._filteredVehicles.next(newVehicles);
  }
}
