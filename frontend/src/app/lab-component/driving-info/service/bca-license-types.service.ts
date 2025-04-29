import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { AppConfig } from '../../../app.config';
import { Urls } from './bca-license-types.urls';
import { RespondData } from '../../../service/API-service/base.service';

@Injectable({
  providedIn: 'root',
})

/** Service BcaLicenseTypes dùng để gọi API tới backend, lấy dữ liệu
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */
export class BcaLicenseTypesService extends BaseDataService {
  getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  getListUrl = AppConfig.apiEndpoint + Urls.getList;
  addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  deleteUrl = AppConfig.apiEndpoint + Urls.delete;

  getListActiveUrl = AppConfig.apiEndpoint + Urls.getListActive;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  /** API get danh sách LicenseTypes được active: isActive = true, isDelete
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */

  getListActive(): Promise<RespondData> {
    return this.get(this.getListActiveUrl);
  }
}
