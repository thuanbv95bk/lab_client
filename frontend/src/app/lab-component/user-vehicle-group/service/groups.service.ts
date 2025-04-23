import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { Urls } from '../model/urls/groups.urls';
import { RespondData } from '../../../service/API-service/base.service';
import { UserVehicleGroupView } from '../model/user-vehicle-group';
import { GroupsFilter } from '../model/groups';

/**  Service GỌI API của nhóm phương tiện
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
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

  /** gọi API lấy về danh sách nhóm chưa gán
   * @param filterModel bộ lọc nhóm phương tiện theo user
   * @param param2 Mô tả param 2
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getListUnassignGroups(filterModel: GroupsFilter): Promise<RespondData> {
    return this.postData(this._getListUnassignGroupsUrl, filterModel, false);
  }

  /** Xây cây cha-con từ danh sách nhóm
   * @param listItem danh sách nhóm
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

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

  /** Gom 1 nhóm và toàn bộ con cháu vào 1 mảng phẳng
   * @param tree danh sách Group theo -cha-con
   * @param pK_UserID chèn pK_UserID vào từng nhóm nếu có
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  flattenGroupTree(tree: UserVehicleGroupView[], pK_UserID: string = null): UserVehicleGroupView[] {
    const result: UserVehicleGroupView[] = [];

    const flatten = (group: UserVehicleGroupView) => {
      // Thêm phần tử cha vào kết quả
      result.push(group);
      // Đệ quy qua tất cả các nhóm con
      group.groupsChild?.forEach((child) => {
        child.pK_UserID = pK_UserID ?? pK_UserID;

        flatten(child);
      });
    };

    tree.forEach((g) => {
      g.pK_UserID = pK_UserID ?? pK_UserID;
      if (g.isSelected == true) {
        g.isNewItem = true;
      }
      flatten(g);
    });
    // Bắt đầu với từng nhóm gốc trong cây
    return result;
  }

  /** Hàm chuyển các item giữa các nhóm  với nhau, và build lại cây cha-con
   * @param fromList  UserVehicleGroupView/ Groups nhóm cần chuyển
   * @param param2 UserVehicleGroupView/ Groups nhóm được chuyển
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public moveGroups(fromList: UserVehicleGroupView[], toList: UserVehicleGroupView[]) {
    const toMove = fromList.filter((g) => g.isSelected == true || g.hasChild == true || g.allComplete == true);
    let movedItems: UserVehicleGroupView[] = [];

    toMove.forEach((g) => {
      if (g.allComplete) {
        if (!g.hasChild) {
          movedItems.push(g);
          g.isSelected = false;
        } else {
          movedItems.push(g);
        }
      } else if (g.hasChild) {
        g.groupsChild.forEach((child) => {
          if (child.isSelected) {
            movedItems.push(child);
          }
        });
      }
    });

    // Xóa item chính khỏi danh sách nguồn
    const isMoved = (item) => movedItems.includes(item);

    // Cập nhật danh sách đích
    toList.unshift(...movedItems);
    const updatedFromList = fromList.filter((g) => !isMoved(g));
    // Xử lý nhóm con chưa được di chuyển hết
    updatedFromList.forEach((g) => {
      if (g.hasChild && !g.allComplete) {
        const selectedChildren = g.groupsChild.filter((x) => x.isSelected);
        g.groupsChild = g.groupsChild.filter((x) => !selectedChildren.includes(x));
      }
    });

    // Gán lại danh sách nguồn đã được lọc
    const allRelatedGroups = this.flattenGroupTree(updatedFromList);
    return this.buildHierarchy(allRelatedGroups);
  }

  /** Tạo chuỗi ID sau khi và sort data asc
   * @param groups danh sách nhóm
   * @param ket key để lấy value
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public getSortedIdString(groups: UserVehicleGroupView[], key: string): string {
    return [...groups]
      .map((g) => String(g[key]))
      .sort((a, b) => a.localeCompare(b))
      .join(',');
  }
}
