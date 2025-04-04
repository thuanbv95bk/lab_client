/**
 * Location enum
 * enum các vị trí của xe
 */
export enum LocationEnum {
  TongQuan = 'OverView',
  CuaKhau = 'BorderGate',
  TrenDuong = 'OnTheRoad',
  NhaMay = 'AtTheFactory',
  TaiCang = 'AtThePort',
}

/**
 * Type chart enum
 * enum mô tả loại chart
 */
export enum TypeChartEnum {
  bar = 'bar',
  doughnut = 'doughnut',
  vehicleWidget = 'VehicleWidget',
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
