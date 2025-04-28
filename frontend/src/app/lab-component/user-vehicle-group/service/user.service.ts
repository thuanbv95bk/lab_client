import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { HttpClient } from '@angular/common/http';
import { Urls } from '../model/urls/user.urls';

/**Service GỌI API User
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseDataService {
  getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  getListUrl = AppConfig.apiEndpoint + Urls.getList;
  addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  deleteUrl = AppConfig.apiEndpoint + Urls.delete;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
