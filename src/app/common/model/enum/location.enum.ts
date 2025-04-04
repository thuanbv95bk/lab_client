/**
 * Location enum
 * enum các vị trí của xe
 */
export enum LocationEnum {
  tongQuan = 'overView',
  cuaKhau = 'borderGate',
  trenDuong = 'onTheRoad',
  nhaMay = 'atTheFactory',
  taiCang = 'atThePort',
}

/**
 * Type chart enum
 * enum mô tả loại chart
 */
export enum TypeChartEnum {
  bar = 'bar',
  doughnut = 'doughnut',
  vehicleWidget = 'vehicleWidget',
}

export enum SizeEnum {
  auto = 'auto',
  small = 'small',
  medium = 'medium',
  large = 'large',
}
export const LOCATION_OPTIONS: LocationEnum[] = Object.values(LocationEnum);

export function isLocation(value: string): value is LocationEnum {
  return LOCATION_OPTIONS.includes(value as LocationEnum);
}
