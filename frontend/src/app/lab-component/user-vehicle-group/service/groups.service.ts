import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { Urls } from '../model/urls/groups.urls';
import { RespondData } from '../../../service/API-service/base.service';
import { UserVehicleGroupView } from '../model/user-vehicle-group';

/**
 * Injectable
 * Service GỌI API của nhóm phương tiện
 */
@Injectable({
  providedIn: 'root',
})
export class GroupsService extends BaseDataService {
  _getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  _getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  _getListUrl = AppConfig.apiEndpoint + Urls.getList;
  _addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  _deleteUrl = AppConfig.apiEndpoint + Urls.delete;
  _getListUnassignGroupsUrl = AppConfig.apiEndpoint + Urls.getListUnassignGroups;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Gets list unassign groups
   * gọi API lấy về danh sách nhóm chưa gán
   * @param filterModel bộ lọc nhóm phương tiện theo user
   * @param [noLoadingMark]
   * @returns list unassign groups
   */
  getListUnassignGroups(filterModel: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this._getListUnassignGroupsUrl, filterModel, noLoadingMark);
  }

  buildHierarchy(listItem: UserVehicleGroupView[]): UserVehicleGroupView[] {
    const map = new Map<number, UserVehicleGroupView>();
    const roots: UserVehicleGroupView[] = [];

    // Gán mặc định và lưu vào map
    listItem.forEach((item) => {
      item.groupsChild = [];
      item.hasChild = false;
      item.isHide = false;
      item.level = 1;

      map.set(item.pK_VehicleGroupID!, item);
    });

    // Duyệt gán vào cây
    listItem.forEach((item) => {
      if (item.parentVehicleGroupId && map.has(item.parentVehicleGroupId)) {
        const parent = map.get(item.parentVehicleGroupId)!;
        item.level = parent.level + 1;
        item.isSelected = false;
        parent.groupsChild.push(item);
        parent.hasChild = true;
      } else {
        if (item.isSelected == true || item.allComplete == true) {
          item.isNewItem = true;
          item.isSelected = false;
          item.allComplete = false;
        }
        roots.push(item);
      }
    });

    return roots;
  }

  /**
   * Gom 1 nhóm và toàn bộ con cháu vào 1 mảng phẳng
   * @param tree
   * @param [pK_UserID]
   * @returns danh sách Group theo -cha-con
   */
  flattenGroupTree(tree: UserVehicleGroupView[], pK_UserID: string = null): UserVehicleGroupView[] {
    const result: UserVehicleGroupView[] = [];

    const flatten = (group: UserVehicleGroupView) => {
      // if (group.isSelected == true) {
      //   group.isNewItem = true;
      // }
      // item.isSelected = false; //
      // item.allComplete = false; //
      result.push(group); // Thêm phần tử cha vào kết quả

      // Đệ quy qua tất cả các nhóm con
      group.groupsChild?.forEach((child) => {
        child.PK_UserID = pK_UserID ?? pK_UserID;

        flatten(child);
      });
    };

    tree.forEach((g) => {
      g.PK_UserID = pK_UserID ?? pK_UserID;
      if (g.isSelected == true) {
        g.isNewItem = true;
      }
      flatten(g);
    }); // Bắt đầu với từng nhóm gốc trong cây

    return result;
  }
}
