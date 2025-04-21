import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './service/user.service';
import { GroupsService } from './service/groups.service';
import { Groups, GroupService, GroupsFilter } from './model/groups';
import { UserVehicleGroupFilter, UserVehicleGroupView, VehicleGroupModel } from './model/user-vehicle-group';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
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
  keyId: string = 'pK_VehicleGroupID';
  userSearch = ''; // filter User

  listUser: User[] = []; // danh sách người dùng
  userFilter = new UsersFilter(); // filter người dùng

  groupsFilter = new GroupsFilter(); // filter nhóm chưa gán
  groupsViewFilter = new UserVehicleGroupFilter(); // filter nhóm đã gán

  listUnassignGroups: UserVehicleGroupView[] = []; // nhóm chưa gán
  listAssignGroups: UserVehicleGroupView[] = []; // nhóm đã gán

  selectedId = new User(); // useKey chon người dùng
  first: number = 0; // kiểm tra- lấy dữ liệu lần đầu cho nhóm
  currentGroupIdsStr = ''; // string-key check sự thay đổi của các nhóm
  originalGroupIdsStr = ''; // string-key-original check sự thay đổi của các nhóm

  isBtnUnAssignGroupsActive: boolean = false; // check có sự thay đổi của nhóm chưa gán
  isBtnAssignGroupsActive: boolean = false; // check có sự thay đổi của nhóm đã gán

  @ViewChild('closeModal') closeModal;

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
  async onClickRow(item: User) {
    if (this.selectedId != item) {
      this.selectedId = item;
      if (!item || item.pK_UserID == '') return;
      this.first = 0;
      this.getListAssignGroups(item.pK_UserID);
      this.getListUnassignGroups(item.pK_UserID);
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
  markOriginal(fromList: UserVehicleGroupView[], key: string) {
    this.originalGroupIdsStr = this.groupsService.getSortedIdString(fromList, key);
    this.currentGroupIdsStr = this.originalGroupIdsStr;
  }

  /**
   * Assigns groups
   * Hàm chuyển từ nhóm chưa gán sang nhóm đã gán
   * Xây lại cây cha-con
   */
  assignGroups() {
    this.listUnassignGroups = this.groupsService.moveGroups(this.listUnassignGroups, this.listAssignGroups);

    const tempList = this.listAssignGroups;
    const allRelatedGroups = this.groupsService.flattenGroupTree(tempList);
    this.currentGroupIdsStr = this.groupsService.getSortedIdString(allRelatedGroups, this.keyId);
    this.listAssignGroups = this.groupsService.buildHierarchy(allRelatedGroups);

    this.isBtnAssignGroupsActive = false;
  }

  /**
   * Assigns groups
   * Hàm chuyển từ nhóm đã sang nhóm chưa gán
   * Xây lại cây cha-con
   */
  unassignGroups() {
    this.listAssignGroups = this.groupsService.moveGroups(this.listAssignGroups, this.listUnassignGroups);

    const tempListUn = this.listUnassignGroups;

    const allRelatedGroups = this.groupsService.flattenGroupTree(tempListUn);
    this.listUnassignGroups = this.groupsService.buildHierarchy(allRelatedGroups);

    this.currentGroupIdsStr = this.groupsService.getSortedIdString(
      this.groupsService.flattenGroupTree(this.listAssignGroups),
      this.keyId
    );

    this.isBtnUnAssignGroupsActive = false;
  }

  /**
   * Saves user vehicle group component
   * Lưu lại giá trị nhóm đã gán vào DB
   */
  save() {
    const tempList = this.listAssignGroups;
    const allRelatedGroups = this.groupsService.flattenGroupTree(tempList, this.selectedId.pK_UserID);
    const item = new VehicleGroupModel();
    item.pK_UserID = this.selectedId.pK_UserID;
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
        this.commonService.showSuccess('Cập nhật thành công');
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
    this.userFilter.fK_CompanyID = this.companyID;
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

  async getListUnassignGroups(pK_UserID: string) {
    this.groupsFilter.fK_CompanyID = this.companyID;
    this.groupsFilter.pK_UserID = pK_UserID;
    this.groupsFilter.isDeleted = false;
    this.groupsService.getListUnassignGroups(this.groupsFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          this.commonService.showError(res.errorMessage);
          return;
        }
        this.listUnassignGroups = res.data;
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
      (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listAssignGroups = res.data;
        if (this.first == 0) {
          const allRelatedGroups = this.groupsService.flattenGroupTree(
            this.listAssignGroups,
            this.selectedId.pK_UserID
          );
          this.markOriginal(allRelatedGroups, this.keyId);
          this.first = 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Refresh all bottom
   * bỏ đi các giá trị active của các bottom
   */
  refreshAllBottom() {
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
    let outPut = false;
    if (this.first == 0) return false;

    outPut = !equal(this.currentGroupIdsStr, this.originalGroupIdsStr);
    return outPut;
  }
}
