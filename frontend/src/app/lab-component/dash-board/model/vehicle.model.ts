import { LocationEnum } from '../enum/location.enum';

/** các thuộc tính của xe
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export interface Vehicle {
  id: number;
  code: string;
  isLoaded: boolean; // có hàng hay không có hàng : true-> có hàng
  location: string | LocationEnum; // vị trí
  company: string; //
}

/**các thuộc tính của card width
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class CardWidgetModel {
  backgroundColor: string = '';
  title: string = '';
  totalVehicles: number = 0;
  numberVehicle: number = 0;
  isDisplayFooter: boolean = false;
  isReloadView: boolean = false;

  constructor(obj?: Partial<CardWidgetModel>) {
    this.backgroundColor = obj?.backgroundColor || '';
    this.title = obj?.title || '';
    this.totalVehicles = obj?.totalVehicles || 0;
    this.numberVehicle = obj?.numberVehicle || 0;
    this.isDisplayFooter = obj?.isDisplayFooter || false;
    this.isReloadView = obj?.isReloadView || false;
  }

  get percentage(): string {
    if (!this.totalVehicles || this.isDisplayFooter === false) return '';
    return ((this.numberVehicle / this.totalVehicles) * 100).toFixed(2);
  }
}
