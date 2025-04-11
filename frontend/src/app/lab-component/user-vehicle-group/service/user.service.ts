import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { HttpClient } from '@angular/common/http';
import { Urls } from '../model/urls/user.urls';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseDataService {
  _getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  _getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  _getListUrl = AppConfig.apiEndpoint + Urls.getList;
  _addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  _deleteUrl = AppConfig.apiEndpoint + Urls.delete;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
