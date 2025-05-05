import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../service/common.service';
import { UserService } from './service/user.service';
import { GroupsService } from './service/groups.service';
import { GroupsFilter } from './model/groups';
import { UserVehicleGroupFilter, UserVehicleGroupView, VehicleGroupModel } from './model/user-vehicle-group';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
import equal from 'fast-deep-equal';
import { User, UsersFilter } from './model/admin-user';

@Component({
  selector: 'app-user-vehicle-group',
  templateUrl: './user-vehicle-group.component.html',
  styleUrls: ['./user-vehicle-group.component.scss'],
})
export class UserVehicleGroupComponent implements OnInit {
  /** ID công ty mặc định */
  companyID: number = 15076;

  /** key để lấy ra đoan string-key */
  keyId: string = 'pK_VehicleGroupID';

  /** filter User */
  userSearch = '';

  /** danh sách người dùng */
  listUser: User[] = [];

  /** filter người dùng */
  userFilter = new UsersFilter();

  /** filter nhóm chưa gán */
  groupsFilter = new GroupsFilter();

  /** filter nhóm đã gán */
  groupsViewFilter = new UserVehicleGroupFilter();

  /** nhóm chưa gán */
  listUnassignGroups: UserVehicleGroupView[] = [];

  /** nhóm đã gán */
  listAssignGroups: UserVehicleGroupView[] = [];

  /** useKey chon người dùng */
  selectedId = new User();

  /** kiểm tra- lấy dữ liệu lần đầu cho nhóm */
  first: number = 0;

  /** string-key check sự thay đổi của các nhóm */
  currentGroupIdsStr = '';

  /** string-key-original check sự thay đổi của các nhóm */
  originalGroupIdsStr = '';

  /** check có sự thay đổi của nhóm chưa gán */
  isBtnUnAssignGroupsActive: boolean = false;

  /** check có sự thay đổi của nhóm đã gán */
  isBtnAssignGroupsActive: boolean = false;

  /** đóng popup thông báo */
  @ViewChild('closeModal') closeModal;

  constructor(
    private service: UserService,
    private groupsService: GroupsService,
    private userVehicleGroupService: UserVehicleGroupService,
    public commonService: CommonService
  ) {}

  /** lấy dữ liệu masterData
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnInit() {
    this.getMasterData();
  }

  /** Lấy các data từ DB khi mở giao diện
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  getMasterData() {
    this.getListUser();
  }

  /** Sự kiện click vào row chọn người dùng
   * @param item Class User
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /** thiết lập string-key Original ban đầu để check sự thay đổi
   * @param fromList UserVehicleGroupView nhóm phương tiện
   * @param key string: pK_VehicleGroupID
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  markOriginal(fromList: UserVehicleGroupView[], key: string) {
    this.originalGroupIdsStr = this.groupsService.getSortedIdString(fromList, key);
    this.currentGroupIdsStr = this.originalGroupIdsStr;
  }

  /** Hàm chuyển từ nhóm chưa gán sang nhóm đã gán
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  assignGroups() {
    // lấy về dah sách nhóm chưa gán
    this.listUnassignGroups = this.groupsService.moveGroups(this.listUnassignGroups, this.listAssignGroups);
    const tempList = this.listAssignGroups;
    const allRelatedGroups = this.groupsService.flattenGroupTree(tempList);
    this.currentGroupIdsStr = this.groupsService.getSortedIdString(allRelatedGroups, this.keyId);
    this.listAssignGroups = this.groupsService.buildHierarchy(allRelatedGroups);
    this.isBtnAssignGroupsActive = false;
  }

  /** Hàm chuyển từ nhóm đã sang nhóm chưa gán - Xây lại cây cha-con
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /** Thêm pK_UserID, tạo list phẳng để lưu DB
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  save() {
    const tempList = this.listAssignGroups;
    const allRelatedGroups = this.groupsService.flattenGroupTree(tempList, this.selectedId.pK_UserID);
    const item = new VehicleGroupModel();
    item.pK_UserID = this.selectedId.pK_UserID;
    item.listGroup = allRelatedGroups;
    this.addOrEditList(item);
  }
  /** Lưu lại giá trị nhóm đã gán vào DB
   * @param VehicleGroupModel danh sách nhóm phẳng(không cha-con)
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

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

  /** Hàm xác nhận hủy các thay đổi chưa lưu,có xác nhận? lại
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  cancel() {
    this.closeModal.nativeElement.click();
    this.getListAssignGroups(this.selectedId.pK_UserID);
    this.getListUnassignGroups(this.selectedId.pK_UserID);
    this.refreshAllBottom();
  }

  /** get danh sách users từ DB
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /** get danh sách các nhóm chưa gán
   * @param pK_UserID Id của user
   * @param isDeleted = false trạng thái
   * @param companyID = 15076 iD công ty
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /** get danh sách các nhóm chưa gán, va  currentGroupIdsStr  string-key để kiểm tra sự thay đổi
   * @param pK_UserID
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /**  bỏ đi các giá trị active của các bottom
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  refreshAllBottom() {
    this.isBtnUnAssignGroupsActive = false;
    this.isBtnAssignGroupsActive = false;
    this.first = 0;
    this.currentGroupIdsStr = '';
    this.originalGroupIdsStr = '';
  }

  /** kiểm tra có thay đổi của nhóm đã chọn không
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  get isAssignGroupsChanged(): boolean {
    let outPut = false;
    if (this.first == 0) return false;

    outPut = !equal(this.currentGroupIdsStr, this.originalGroupIdsStr);
    return outPut;
  }
}
