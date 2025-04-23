import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Urls } from '../model/urls/user-vehicle-group.urls';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { RespondData } from '../../../service/API-service/base.service';
import { UserVehicleGroupFilter, VehicleGroupModel } from '../model/user-vehicle-group';

/** Service GỌI API của nhóm phương tiện cho người dùng
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
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
  /**gọi API lấy về danh sách nhóm đã gán
   * @param filterModel bộ lọc nhóm phương tiện theo user
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getListAssignGroups(filterModel: UserVehicleGroupFilter): Promise<RespondData> {
    return this.postData(this._getListAssignGroupsUrl, filterModel, false);
  }

  /** gọi API thêm/ xóa nhóm phương tiện của user
   * @param model Model thêm danh sách phương tiện
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  addOrEditList(model: VehicleGroupModel): Promise<RespondData> {
    return this.postData(this._addOrEditListUrl, model, false);
  }
}
