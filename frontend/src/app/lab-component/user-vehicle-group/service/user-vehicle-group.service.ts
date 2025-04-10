import { Injectable } from '@angular/core';
import { Urls } from '../model/user-vehicle-group.urls';
import { AppConfig } from '../../../app.config';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserVehicleGroupService extends BaseDataService {
  _getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  _getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  _getListUrl = AppConfig.apiEndpoint + Urls.getList;
  _addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  _deleteUrl = AppConfig.apiEndpoint + Urls.delete;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
