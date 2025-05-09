import { PagingModel } from '../../../app-model/paging';
/** message xác nhận thay đỗi dự liệu
 * @Author thuan.bv
 * @Created 07/05/2025
 * @Modified date - user - description
 */
export const messageConfirm = 'Tồn tại dữ liệu đã có thay đổi, bạn muốn tiếp tục không?';

/** Class Cho danh sách lái xe
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified 08/05/2024 - thuan.bv - bổ sung thêm trường set hiệu lực: isActive
 */
export class HrmEmployees {
  /** Id lái xe */
  pkEmployeeId: number;
  /** Tên hiển thị */
  displayName: string;
  /** Tên */
  name: string;
  /** Số điện thoại */
  mobile: string;
  /** Giấy phép lái xe */
  driverLicense: string;
  /** Ngày cấp */
  issueLicenseDate: Date;
  /** Ngày hết hạn */
  expireLicenseDate: Date;
  /** Nơi cấp */
  issueLicensePlace: string;
  /** loại bằng */
  licenseType: string;
  /**Ten loại bằng */
  LicenseTypeName: string;
  /** Ngày cập nhật */
  updatedDate: Date;

  /** Hiệu lực */
  activeValue: string;

  /** Trạng thái chỉnh sửa
   * true nếu row có ít nhất 1 field thay đổi */
  isEdit: boolean = false;

  /** Trạng thái hợp lệ
   * true nếu row có ít nhất 1 field thay đổi và tất cả field hợp lệ. */
  isValid: boolean = false;
  /**Lưu trạng thái hợp lệ và chỉnh sửa từng field
   * lưu trạng thái { isEdited, isValid } cho từng field,
   * được cập nhật từ ValidatedInputComponent qua output fieldStatusChange. */
  fieldStatus?: {
    [field: string]: {
      /** đã được sửa */
      isEdited: boolean;
      /** hợp lệ */
      isValid: boolean;
    };
  };

  /** Cảnh báo nếu trùng */
  isWarning: boolean = false;
}
/** Bộ lọc danh sách lái xe, kèm PagingFilter
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */
export class HrmEmployeesFilter extends PagingModel {
  /** Id lái xe */
  fkCompanyId: number;
  /** Tên hiển thị */
  displayName: string;
  /** Giấy phép lái xe */
  driverLicense: string;
  /** nơi cấp Giấy phép lái xe */
  issueLicensePlace: string;
  /** loại bằng */
  licenseType: string;
  /** chuối id của danh sách lái xe cần tìm kiếm
   */
  listStringEmployeesId: string;
  /** chuối id của danh sách loại bằng lái cần tìm kiếm
   */
  listStringLicenseTypesId: string;
  /** loại field cần tim kiếm */
  option: SearchOption;
  constructor(obj?) {
    super();
    obj = obj || {};
    this.fkCompanyId = obj.fkCompanyId || null;
    this.displayName = obj.displayName || '';
    this.driverLicense = obj.driverLicense || '';
    this.licenseType = obj.licenseType || '';
    this.issueLicensePlace = obj.issueLicensePlace || '';
    this.listStringEmployeesId = obj.listStringEmployeesId || '';
    this.listStringLicenseTypesId = obj.listStringLicenseTypesId || '';
    this.option = obj.option || new SearchOption();
  }
}

export class HrmEmployeesFilterExcel {
  /** Id lái xe */
  fkCompanyId: number;
  /** Tên hiển thị */
  displayName: string;
  /** Giấy phép lái xe */
  driverLicense: string;
  /** loại bằng */
  licenseType: string;
  /** nơi cấp Giấy phép lái xe */
  issueLicensePlace: string;
  /** chuối id của danh sách lái xe cần tìm kiếm*/
  listStringEmployeesId: string;
  /** chuối tên của danh sách lái xe cần tìm kiếm
   * dùng để hiển thị danh sách filter
   */
  listStringEmployeesName: string;
  /** chuối id của danh sách loại bằng lái cần tìm kiếm
   */
  listStringLicenseTypesId: string;
  /** chuối tên của danh sách loại bằng lái cần tìm kiếm
   * dùng để hiển thị danh sách filter
   */
  listStringLicenseTypesName: string;
  /** loại field cần tim kiếm */
  option: SearchOption;
  constructor(obj?) {
    obj = obj || {};
    this.fkCompanyId = obj.fkCompanyId || null;
    this.displayName = obj.displayName || '';
    this.driverLicense = obj.driverLicense || '';
    this.licenseType = obj.licenseType || '';
    this.issueLicensePlace = obj.issueLicensePlace || '';
    this.listStringEmployeesId = obj.listStringEmployeesId || '';
    this.listStringEmployeesName = obj.listStringEmployeesName || '';
    this.listStringLicenseTypesName = obj.listStringLicenseTypesName || '';
    this.option = obj.option || new SearchOption();
  }
}

/** dùng để lưu dữ liệu Employees, cho vào combobox ở màn hình
 * @Author thuan.bv
 * @Created 24/04/2025
 * @Modified date - user - description
 */

export class HrmEmployeesCbx {
  /** Tên lái xe */
  displayName: string;
  /** Số giấy phép lái xe */
  driverLicense: string;
}

/** dùng để set giá trị của field cần tìm theo cặp key-value
 * @Author thuan.bv
 * @Created 24/04/2025
 * @Modified date - user - description
 */

export class SearchOption {
  /** key */
  key: string = '';
  /** giá trị */
  value: string = '';
  /** tên hiển thị ở UI */
  name: string = '';
}
