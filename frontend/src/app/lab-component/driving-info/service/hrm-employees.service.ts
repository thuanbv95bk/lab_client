import { Injectable } from '@angular/core';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Urls } from './hrm-employees.urls';
import { RespondData } from '../../../service/API-service/base.service';
import { HrmEmployees, HrmEmployeesFilter } from '../model/hrm-employees.model';

/** Service dùng để gọi API tới backend, lấy dữ liệu
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 * @Modified 28/04/2025 - thuan.bv - Thêm API addOrEditList, deleteSoft
 */

@Injectable({
  providedIn: 'root',
})
export class HrmEmployeesService extends BaseDataService {
  _getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  _getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  _getListUrl = AppConfig.apiEndpoint + Urls.getList;
  _addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  _deleteUrl = AppConfig.apiEndpoint + Urls.delete;

  _getListCbxUrl = AppConfig.apiEndpoint + Urls.getListCbx;
  _getPagingToEditUrl = AppConfig.apiEndpoint + Urls.getPagingToEdit;
  _deleteSoftUrl = AppConfig.apiEndpoint + Urls.deleteSoft;
  _addOrEditListUrl = AppConfig.apiEndpoint + Urls.addOrEditList;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  /** lấy danh sách lái xe để cho vào combobox dùng để filter lái xe
   * @param FkCompanyID Id công ty
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */

  getListCbx(fkCompanyID: number): Promise<RespondData> {
    const params = new HttpParams().append('fkCompanyID', fkCompanyID);
    return this.postParams(this._getListCbxUrl, params, false);
  }

  /** lấy danh sách lái xe dạng paging phân trạng
   * @param filterModel điều kiện tìm kiếm
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  getPagingToEdit(filterModel: HrmEmployeesFilter): Promise<RespondData> {
    return this.postData(this._getPagingToEditUrl, filterModel, false);
  }

  /** gọi API xóa mềm 1 thông tin lái xe
   * @param employeeId id của lái xe
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  deleteSoft(employeeId: number): Promise<RespondData> {
    const params = new HttpParams().append('employeeId', employeeId);
    return this.postParams(this._deleteSoftUrl, params, false);
  }

  /** gọi API cập nhật 1 danh sách lái xe
   * @param models Danh sách lái xe muốn cập nhật
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  addOrEditList(models: HrmEmployees[]): Promise<RespondData> {
    return this.postData(this._addOrEditListUrl, models, false);
  }

  /** tạo string-key danh sách theo id của 1 list
   * @param items Danh sách muốn tạo
   * @param key tên cột muốn tạo
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  public getSortedIdString(items: any[], key: string): string {
    return [...items]
      .map((g) => String(g[key]))
      .sort((a, b) => a.localeCompare(b))
      .join(',');
  }
}
