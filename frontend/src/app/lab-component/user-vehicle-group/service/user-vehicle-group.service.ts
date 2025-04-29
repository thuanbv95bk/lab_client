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
  getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  getListUrl = AppConfig.apiEndpoint + Urls.getList;
  addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  deleteUrl = AppConfig.apiEndpoint + Urls.delete;
  getListAssignGroupsUrl = AppConfig.apiEndpoint + Urls.getListAssignGroups;
  addOrEditListUrl = AppConfig.apiEndpoint + Urls.addOrEditList;
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
    return this.postData(this.getListAssignGroupsUrl, filterModel, false);
  }

  /** gọi API thêm/ xóa nhóm phương tiện của user
   * @param model Model thêm danh sách phương tiện
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  addOrEditList(model: VehicleGroupModel): Promise<RespondData> {
    return this.postData(this.addOrEditListUrl, model, false);
  }
}
