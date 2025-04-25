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
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  /** lấy danh sách lái xe để cho vào combobox dùng để filter lái xe
   * @param FkCompanyID Id công ty
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */

  getListCbx(FkCompanyID: number): Promise<RespondData> {
    const params = new HttpParams().append('FkCompanyID', FkCompanyID);
    return this.postParams(this._getListCbxUrl, params, false);
  }

  getPagingToEdit(filterModel: HrmEmployeesFilter): Promise<RespondData> {
    return this.postData(this._getPagingToEditUrl, filterModel, false);
  }

  public getSortedIdString(items: any[], key: string): string {
    return [...items]
      .map((g) => String(g[key]))
      .sort((a, b) => a.localeCompare(b))
      .join(',');
  }
}
