import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { AppConfig } from '../../../app.config';
import { Urls } from './bca-license-types.urls';
import { RespondData } from '../../../service/API-service/base.service';

@Injectable({
  providedIn: 'root',
})
export class BcaLicenseTypesService extends BaseDataService {
  _getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  _getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  _getListUrl = AppConfig.apiEndpoint + Urls.getList;
  _addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  _deleteUrl = AppConfig.apiEndpoint + Urls.delete;

  _getListActiveUrl = AppConfig.apiEndpoint + Urls.getListActive;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  getListActive(): Promise<RespondData> {
    return this.get(this._getListActiveUrl, false);
  }
}
