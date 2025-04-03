/**
 * Location enum
 * enum các vị trí của xe
 */
export enum LocationEnum {
  TongQuan = 'OverView',
  CuaKhau = 'borderGate',
  TrenDuong = 'onTheRoad',
  NhaMay = 'atTheFactory',
  TaiCang = 'atThePort',
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
export const LOCATION_OPTIONS: LocationEnum[] = Object.values(LocationEnum);

export function isLocation(value: string): value is LocationEnum {
  return LOCATION_OPTIONS.includes(value as LocationEnum);
}
