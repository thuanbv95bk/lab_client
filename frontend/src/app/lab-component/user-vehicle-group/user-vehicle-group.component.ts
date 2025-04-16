import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './service/user.service';
import { GroupsService } from './service/groups.service';
import { Groups, GroupService, GroupsFilter } from './model/groups';
import { UserVehicleGroupFilter, UserVehicleGroupView, VehicleGroupModel } from './model/user-vehicle-group';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
import { AppGlobals } from '../../common/app-global';
import { CommonService } from '../../service/common.service';
import equal from 'fast-deep-equal';
import { User, UsersFilter } from './model/admin-user';
import { directionMoveGroupsEnum } from './enum/vehicle-group.enum';

@Component({
  selector: 'app-user-vehicle-group',
  templateUrl: './user-vehicle-group.component.html',
  styleUrls: ['./user-vehicle-group.component.scss'],
})
export class UserVehicleGroupComponent implements OnInit {
  companyID: number = 15076; // ID công ty mặc định
  userSearch = ''; // filter User
  unAssignGroupsSearch = ''; // filter nhóm chưa gán
  assignGroupsSearch = ''; // filter nhóm đã gán

  listUser: User[] = []; // danh sách người dùng
  userFilter = new UsersFilter(); // filter người dùng

  groupsFilter = new GroupsFilter(); // filter nhóm chưa gán
  groupsViewFilter = new UserVehicleGroupFilter(); // filter nhóm đã gán

  listUnassignGroups: UserVehicleGroupView[] = []; // nhóm chưa gán
  lengthUnassign = 0;
  listAssignGroups: UserVehicleGroupView[] = []; // nhóm đã gán
  lengthAssign = 0;

  // selectedUser: User | null = null;
  // appGlobals!: AppGlobals;
  selectedId = new User(); // useKey chon người dùng
  first: number = 0; // kiểm tra- lấy dữ liệu lần đầu cho nhóm
  currentGroupIdsStr = ''; // string-key check sự thay đổi của các nhóm
  originalGroupIdsStr = ''; // string-key-original check sự thay đổi của các nhóm

  allCompleteAssign: boolean = false; // check-all nhóm đã gán
  allCompleteUnAssign: boolean = false; // check-all nhóm chưa gán
  isBtnUnAssignGroupsActive: boolean = false; // check có sự thay đổi của nhóm chưa gán
  isBtnAssignGroupsActive: boolean = false; // check có sự thay đổi của nhóm đã gán

  @ViewChild('closeModal') closeModal;
  directionMoveGroupsEnum = directionMoveGroupsEnum;

  constructor(
    private service: UserService,
    private groupsService: GroupsService,
    private userVehicleGroupService: UserVehicleGroupService,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    this.getMasterData();
  }

  /**
   * Gets master data
   * Lấy các data từ DB khi mở giao diện
   */
  getMasterData() {
    this.getListUser();
  }
  /**
   * sự kiện click vào row chọn người dùng
   * @param item User
   * @returns danh sách của nhóm chưa gán, đã gán
   */
  onClickRow(item: User) {
    if (this.selectedId != item) {
      this.selectedId = item;
      if (!item || item.pK_UserID == '') return;
      this.getListUnassignGroups(item.pK_UserID);
      this.first = 0;
      this.getListAssignGroups(item.pK_UserID);
    } else {
      this.selectedId = new User();
      this.listUnassignGroups = [];
      this.listAssignGroups = [];
      this.refreshAllBottom();
    }
  }

  /**
   * thiết lập string-key Original để check sự thay đổi
   * của các nhóm
   * @param fromList
   * @param key string-key
   */
  markOriginal(fromList: any[], key: string) {
    this.originalGroupIdsStr = this.getSortedIdString(fromList, key);
  }

  /**
   * Hàm chuyển các item giữa các nhóm  với nhau, và build lại cây cha-con
   * @param fromList UserVehicleGroupView/ Groups
   * @param toList UserVehicleGroupView/ Groups
   * @param direction chiều chuyển: 'assign' | 'unassign'
   */
  private moveGroups(fromList: any[], toList: any[], direction: directionMoveGroupsEnum) {
    const toMove = fromList.filter((g) => g.isSelected || g.hasChild || g.allComplete);
    const movedItems = [];

    toMove.forEach((g) => {
      if (g.allComplete) {
        if (!g.hasChild) {
          movedItems.push(g);
          g.isSelected = false;
          g.allComplete = false; //
        } else {
          movedItems.push(g);
        }
      } else if (g.hasChild) {
        g.groupsChild.forEach((child) => {
          if (child.isSelected) {
            // child.allComplete = false; //
            // child.isSelected = false; //
            movedItems.push(child);
          }
        });
      }
    });

    // Cập nhật danh sách đích
    toList.push(...movedItems);

    // Xóa item chính khỏi danh sách nguồn
    const isMoved = (item) => movedItems.includes(item);
    // const isParentGroup = (item) => item.hasChild || item.groupsChild;

    const updatedFromList = fromList.filter((g) => !isMoved(g));

    // Xử lý nhóm con chưa được di chuyển hết
    updatedFromList.forEach((g) => {
      if (g.hasChild && !g.allComplete) {
        const selectedChildren = g.groupsChild.filter((x) => x.isSelected);
        g.groupsChild = g.groupsChild.filter((x) => !selectedChildren.includes(x));
      }
    });

    // Gán lại danh sách nguồn đã được lọc
    const groupService = new GroupService();
    const allRelatedGroups = groupService.flattenGroupTree(updatedFromList);

    if (direction === directionMoveGroupsEnum.Assign) {
      this.listUnassignGroups = groupService.buildHierarchy(allRelatedGroups);
      this.lengthUnassign = allRelatedGroups?.length || 0;
    } else {
      this.lengthAssign = allRelatedGroups?.length || 0;
      this.currentGroupIdsStr = this.getSortedIdString(allRelatedGroups, 'pK_VehicleGroupID');
      this.listAssignGroups = groupService.buildHierarchy(allRelatedGroups);
    }
  }

  /**
   * Assigns groups
   * Hàm chuyển từ nhóm chưa gán sang nhóm đã gán
   * Xây lại cây cha-con
   */
  assignGroups() {
    this.moveGroups(this.listUnassignGroups, this.listAssignGroups, directionMoveGroupsEnum.Assign);
    const groupService = new GroupService();
    const tempList = this.listAssignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(tempList);
    this.lengthAssign = allRelatedGroups?.length || 0;
    this.currentGroupIdsStr = this.getSortedIdString(allRelatedGroups, 'pK_VehicleGroupID');
    this.listAssignGroups = groupService.buildHierarchy(allRelatedGroups);
    this.isBtnAssignGroupsActive = false;
    this.isBtnUnAssignGroupsActive = !this.isBtnAssignGroupsActive;
  }

  /**
   * Assigns groups
   * Hàm chuyển từ nhóm đã sang nhóm chưa gán
   * Xây lại cây cha-con
   */
  unassignGroups() {
    this.moveGroups(this.listAssignGroups, this.listUnassignGroups, directionMoveGroupsEnum.Unassign);
    const groupService = new GroupService();
    const _temp = this.listUnassignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(_temp);
    this.lengthUnassign = allRelatedGroups?.length || 0;
    this.listUnassignGroups = groupService.buildHierarchy(allRelatedGroups);
    this.isBtnUnAssignGroupsActive = false;
  }

  /**
   * Saves user vehicle group component
   * Lưu lại giá trị nhóm đã gán vào DB
   */
  save() {
    const groupService = new GroupService();
    const _temp = this.listAssignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(_temp, this.selectedId.pK_UserID);
    const item = new VehicleGroupModel();
    item.PK_UserID = this.selectedId.pK_UserID;
    item.listGroup = allRelatedGroups;

    this.addOrEditList(item);
  }

  addOrEditList(item: VehicleGroupModel) {
    this.userVehicleGroupService.addOrEditList(item).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          this.commonService.showError(res.errorMessage + ' errCode: ' + res.statusCode + ' )');
          return;
        }
        await this.commonService.showSuccess('Cập nhật thành công');
        this.getListAssignGroups(this.selectedId.pK_UserID);
        this.getListUnassignGroups(this.selectedId.pK_UserID);
        this.refreshAllBottom();
      },
      (err) => this.commonService.showError('Cập nhật thất bại')
    );
  }

  /**
   * Cancels user vehicle group component
   * Hàm xác nhận hủy các thay đổi chưa lưu
   * có xác nhận?
   */
  cancel() {
    this.closeModal.nativeElement.click();
    this.getListAssignGroups(this.selectedId.pK_UserID);
    this.getListUnassignGroups(this.selectedId.pK_UserID);
    this.refreshAllBottom();
  }

  /**
   * Gets list user
   * get danh sách users từ DB
   * truyền vào ID công ty = 15076
   * Người dùng có isLock = false và isDeleted = false;
   */
  getListUser() {
    this.userFilter.FK_CompanyID = this.companyID;
    this.userFilter.isLock = false;
    this.userFilter.isDeleted = false;
    this.service.getList(this.userFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listUser = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Gets list unassign groups
   * get danh sách các nhóm chưa gán
   * @param pK_UserID
   * @param isDeleted = false
   * @param companyID = 15076
   */

  getListUnassignGroups(pK_UserID: string) {
    this.groupsFilter.fK_CompanyID = this.companyID;
    this.groupsFilter.pK_UserID = pK_UserID;
    this.groupsFilter.isDeleted = false;
    this.groupsService.getListUnassignGroups(this.groupsFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listUnassignGroups = res.data;
        this.lengthUnassign = this.listUnassignGroups?.length || 0;
        if (this.listUnassignGroups.length > 0) {
          const groupService = new GroupService();
          const temp = this.listUnassignGroups;
          this.lengthUnassign = groupService.flattenGroupTree(temp)?.length || 0;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Gets list unassign groups
   * get danh sách các nhóm chưa gán
   * Set currentGroupIdsStr  string-key để kiểm tra sự thay đổi
   * Xây lại cây cha-con
   * @param pK_UserID
   * @param isDeleted = false
   * @param companyID = 15076
   *
   */
  getListAssignGroups(PK_UserID: string) {
    this.groupsViewFilter.fK_UserID = PK_UserID;
    this.groupsViewFilter.isDeleted = false;
    this.userVehicleGroupService.getListAssignGroups(this.groupsViewFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listAssignGroups = res.data;
        this.lengthAssign = this.listAssignGroups?.length || 0;
        if (this.first == 0) {
          this.markOriginal(this.listAssignGroups, 'pK_VehicleGroupID');
          this.currentGroupIdsStr = this.originalGroupIdsStr;
          this.first++;
        }
        const groupService = new GroupService();
        this.listAssignGroups = groupService.buildHierarchy(this.listAssignGroups);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Determines whether check all unassign groups on
   * @event click vào check all nhóm chưa gán
   */

  onCheckAllUnassignGroups() {
    this.allCompleteUnAssign = !this.allCompleteUnAssign;
    this.isBtnAssignGroupsActive = this.allCompleteUnAssign;

    this.listUnassignGroups.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.allCompleteUnAssign));
      x.isSelected = this.allCompleteUnAssign;
      x.allComplete = this.allCompleteUnAssign;
    });
  }

  /**
   * Determines whether check all assign groups on
   * @event click vào check all nhóm đã gán
   */

  onCheckAllAssignGroups() {
    this.allCompleteAssign = !this.allCompleteAssign;
    this.isBtnUnAssignGroupsActive = this.allCompleteAssign;

    this.listAssignGroups.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.allCompleteAssign));
      x.isSelected = this.allCompleteAssign;
      x.allComplete = this.allCompleteAssign;
    });
  }

  /**
   * Determines whether selected change on
   * @event outEvent khi người dùng chọn 1 item của các nhóm
   * @param item Groups
   * @param list Groups[]
   * @param type 'unassign' | 'assign'
   */
  onSelectedChange(item: Groups, list: Groups[], type: directionMoveGroupsEnum) {
    const status = list.some((x) => x.isSelected == true) || item.isUiCheck;
    if (type == directionMoveGroupsEnum.Assign) this.isBtnUnAssignGroupsActive = status;
    else this.isBtnAssignGroupsActive = status;
  }

  /**
   * Refresh all bottom
   * bỏ đi các giá trị active của các bottom
   */
  refreshAllBottom() {
    this.allCompleteAssign = false;
    this.allCompleteUnAssign = false;
    this.isBtnUnAssignGroupsActive = false;
    this.isBtnAssignGroupsActive = false;
    this.first = 0;
    this.currentGroupIdsStr = '';
    this.originalGroupIdsStr = '';
  }

  /**
   * Gets whether is assign groups changed
   *  kiểm tra có thay đổi của nhóm đã chọn không
   */

  get isAssignGroupsChanged(): boolean {
    let _return = false;
    if (this.first == 0) return false;

    _return = !equal(this.currentGroupIdsStr, this.originalGroupIdsStr);
    return _return;
  }

  get getIsBtnAssignGroupsActive() {
    return this.isBtnAssignGroupsActive;
  }

  get getIsBtnUnAssignGroupsActive() {
    return this.isBtnUnAssignGroupsActive;
  }

  get getIsDataUnAssignGroups() {
    if (this.listUnassignGroups.length > 0) return true;
    return false;
  }

  get getIsDataAssignGroups() {
    if (this.listAssignGroups.length > 0) return true;
    return false;
  }

  /**
   * Tạo chuỗi ID sau khi sort
   */
  /**
   * Gets sorted id string
   * sắp xếp - Tạo chuỗi string-key ID theo key
   * để so sách kiểm tra có sự thay đổi của  nhóm
   * @param groups
   * @param key
   * @returns sorted id string
   */
  public getSortedIdString(groups: any[], key: string): string {
    return [...groups]
      .map((g) => String(g[key]))
      .sort((a, b) => a.localeCompare(b))
      .join(',');
  }

  filterItems(items: any[], searchText: string, field1: string, field2?: string): any[] {
    if (!items || !searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter((item) => {
      const value1 = item[field1]?.toString().toLowerCase() || '';
      const value2 = field2 ? item[field2]?.toString().toLowerCase() || '' : '';
      return value1.includes(searchText) || value2.includes(searchText);
    });
  }
}
