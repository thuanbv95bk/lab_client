import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Urls } from '../model/urls/user-vehicle-group.urls';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { RespondData } from '../../../service/API-service/base.service';
import { UserVehicleGroupFilter } from '../model/user-vehicle-group';

@Injectable({
  providedIn: 'root',
})
export class UserVehicleGroupService extends BaseDataService {
  _getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  _getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  _getListUrl = AppConfig.apiEndpoint + Urls.getList;
  _addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  _deleteUrl = AppConfig.apiEndpoint + Urls.delete;
  _getListAssignGroupsUrl = AppConfig.apiEndpoint + Urls.getListAssignGroups;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  getListAssignGroups(filterModel: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this._getListAssignGroupsUrl, filterModel, noLoadingMark);
  }
}
