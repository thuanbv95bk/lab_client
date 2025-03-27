// src/app/config/dashboard-config.ts

import { LocationEnum } from '../vehicle/location.enum';
// Cấu hình class cho widget
export const SizeConfig = {
  [LocationEnum.TongQuan]: {
    auto: 'col-12 flex-grow-1',
    small: 'col-12 col-md-4',
    medium: 'col-12 col-md-8',
    large: 'col-12',
  },
  [LocationEnum.CuaKhau]: {
    auto: 'col-12 col-sm-6 col-lg-4 flex-grow-1',
    small: 'col-12 col-md-4',
    medium: 'col-12 col-md-8',
    large: 'col-12',
  },
  [LocationEnum.TrenDuong]: {
    auto: 'col-12 col-sm-6 col-lg-4 flex-grow-1',
    small: 'col-12 col-md-4',
    medium: 'col-12 col-md-8',
    large: 'col-12',
  },
  [LocationEnum.NhaMay]: {
    auto: 'col-12 col-md-12 col-lg-4 flex-grow-1',
    small: 'col-12 col-md-4',
    medium: 'col-12 col-md-8',
    large: 'col-12',
  },
  [LocationEnum.TaiCang]: {
    auto: 'col-12 flex-grow-1',
    small: 'col-12 col-md-4',
    medium: 'col-12 col-md-8',
    large: 'col-12',
  },
};

// Trạng thái kích thước mặc định
export const CurrentSize = {
  [LocationEnum.TongQuan]: 'auto',
  [LocationEnum.CuaKhau]: 'auto',
  [LocationEnum.TrenDuong]: 'auto',
  [LocationEnum.NhaMay]: 'auto',
  [LocationEnum.TaiCang]: 'auto',
};
