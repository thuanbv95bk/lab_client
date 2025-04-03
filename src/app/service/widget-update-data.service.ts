import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vehicle } from '../common/model/enum/vehicle.model';

/**
 * Injectable
 * Service để cập nhật lại danh sách xe=> cho các widget
 */
@Injectable({
  providedIn: 'root',
})
export class WidgetUpdateDataService {
  private _filteredVehicles = new BehaviorSubject<Vehicle[]>([]);
  filteredVehicles$ = this._filteredVehicles.asObservable();

  // Cập nhật danh sách xe
  updateFilteredVehicles(newVehicles: Vehicle[]) {
    this._filteredVehicles.next(newVehicles);
  }
}
