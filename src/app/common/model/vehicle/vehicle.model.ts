import { LocationEnum } from './location.enum';

/**
 * Vehicle
 * @description các thuộc tính của xe
 */
export interface Vehicle {
  id: number;
  code: string;
  isLoaded: boolean; // có hàng hay không có hàng : true-> có hàng
  location: string | LocationEnum; // vị trí
  company: string; //
}
