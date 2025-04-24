import { Injectable } from '@angular/core';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Urls } from './hrm-employees.urls';
import { RespondData } from '../../../service/API-service/base.service';

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
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  getListCbx(FkCompanyID: number): Promise<RespondData> {
    const params = new HttpParams().append('FkCompanyID', FkCompanyID);
    return this.postParams(this._getListCbxUrl, params, false);
  }
}
