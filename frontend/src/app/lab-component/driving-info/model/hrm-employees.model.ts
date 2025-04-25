/** Class Cho danh sách lái xe
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */

import { PagingModel } from '../../../app-model/paging';

export class HrmEmployees {
  pkEmployeeId: number;
  displayName: string;
  name: string;
  mobile: string;
  driverLicense: string;
  issueLicenseDate: Date;
  expireLicenseDate: Date;
  issueLicensePlace: string;
  licenseType: string;
  updatedDate: Date;
  createdDate: Date;
}
/** Bộ lọc danh sách lái xe, kèm PagingFilter
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */

export class HrmEmployeesFilter extends PagingModel {
  fkCompanyId: number;
  displayName: string;
  driverLicense: string;
  licenseType: string;
  listStringEmployeesId: string;
  listStringLicenseTypesId: string;
  option: SearchOption;
  constructor(obj?) {
    super();
    obj = obj || {};
    this.fkCompanyId = obj.fkCompanyId || null;
    this.displayName = obj.displayName || '';
    this.driverLicense = obj.driverLicense || '';
    this.licenseType = obj.licenseType || '';
    this.listStringEmployeesId = obj.listStringEmployeesId || '';
    this.listStringLicenseTypesId = obj.listStringLicenseTypesId || '';
    this.option = obj.option || new SearchOption();
  }
}

/** dùng để lưu dữ liệu Employees, cho vào combobox ở màn hình
 * @Author thuan.bv
 * @Created 24/04/2025
 * @Modified date - user - description
 */

export class HrmEmployeesCbx {
  displayName: string;
  driverLicense: string;
}

export class SearchOption {
  key: string = '';
  value: string = '';
}
