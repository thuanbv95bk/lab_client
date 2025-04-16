import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Urls } from '../model/urls/user-vehicle-group.urls';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { RespondData } from '../../../service/API-service/base.service';
import { VehicleGroupModel } from '../model/user-vehicle-group';

/**
 * Injectable
 * Service GỌI API của nhóm phương tiện cho người dùng
 */
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
  _addOrEditListUrl = AppConfig.apiEndpoint + Urls.addOrEditList;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * gọi API lấy về danh sách nhóm đã gán
   * @param filterModel bộ lọc nhóm phương tiện theo user
   * @param [noLoadingMark]
   * @returns list unassign groups
   */

  getListAssignGroups(filterModel: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this._getListAssignGroupsUrl, filterModel, noLoadingMark);
  }

  /**
   * Adds or edit list
   * gọi API thêm/ xóa nhóm phương tiện của user
   * @param model VehicleGroupModel
   * @param [noLoadingMark]
   * @returns or edit list
   */
  addOrEditList(model: VehicleGroupModel, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this._addOrEditListUrl, model, noLoadingMark);
  }
}
