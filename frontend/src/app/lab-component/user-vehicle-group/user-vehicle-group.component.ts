import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GroupsService } from './service/groups.service';
import { Groups, GroupService, GroupsFilter } from './model/groups';
import { UserVehicleGroupFilter, UserVehicleGroupView, VehicleGroupModel } from './model/user-vehicle-group';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
import { User, UsersFilter } from './model/user';
import { AppGlobals } from '../../common/app-global';
import { CommonService } from '../../service/common.service';
import equal from 'fast-deep-equal';
@Component({
  selector: 'app-user-vehicle-group',
  templateUrl: './user-vehicle-group.component.html',
  styleUrls: ['./user-vehicle-group.component.scss'],
})
export class UserVehicleGroupComponent implements OnInit {
  FK_CompanyID: number = 15076;
  userSearch = '';
  unAssignGroupsSearch = '';
  assignGroupsSearch = '';
  childRows = new UserVehicleGroupView();
  listUser: User[] = [];
  userFilter = new UsersFilter();
  groupsFilter = new GroupsFilter();

  groupsViewFilter = new UserVehicleGroupFilter();
  listUnassignGroups: UserVehicleGroupView[] = [];

  listAssignGroups: UserVehicleGroupView[] = [];
  listOriginalAssignGroups: UserVehicleGroupView[] = [];
  selectedUser: User | null = null;
  appGlobals!: AppGlobals;
  selectedId = new User();

  allCompleteAssign: boolean = false;
  allCompleteUnAssign: boolean = false;
  isBtnUnAssignGroupsActive: boolean = false;
  isBtnAssignGroupsActive: boolean = false;
  constructor(
    private service: UserService,
    private groupsService: GroupsService,
    private userVehicleGroupService: UserVehicleGroupService,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    this.getMasterData();
  }
  selectUser(user: User) {
    this.selectedUser = user;
  }

  onClickRow(item: User) {
    if (this.selectedId != item) {
      this.selectedId = item;
      if (!item || item.pK_UserID == '') return;
      this.getListUnassignGroups(item.pK_UserID);
      this.getListAssignGroups(item.pK_UserID);
      // this.setOriginal();
    } else {
      this.selectedId = new User();
      this.listUnassignGroups = [];
      this.listAssignGroups = [];
      this.refreshAllBottom();
    }
  }
  // Hàm clone ban đầu (nên dùng deep copy để đảm bảo)
  setOriginal() {
    this.listOriginalAssignGroups = JSON.parse(JSON.stringify(this.listAssignGroups));
  }
  /**
   * Assigns groups
   */

  private moveGroups(fromList: any[], toList: any[], direction: 'assign' | 'unassign') {
    const toMove = fromList.filter((g) => g.isSelected || g.hasChild || g.allComplete);
    const movedItems = [];

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

    if (direction === 'assign') {
      this.listUnassignGroups = groupService.buildHierarchy(allRelatedGroups);
    } else {
      this.listAssignGroups = groupService.buildHierarchy(allRelatedGroups);
    }
  }

  assignGroups() {
    this.moveGroups(this.listUnassignGroups, this.listAssignGroups, 'assign');
    const groupService = new GroupService();
    const _temp = this.listAssignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(_temp);
    this.listAssignGroups = groupService.buildHierarchy(allRelatedGroups);
    this.isBtnAssignGroupsActive = false;
    this.isBtnUnAssignGroupsActive = !this.isBtnAssignGroupsActive;
  }

  unassignGroups() {
    this.moveGroups(this.listAssignGroups, this.listUnassignGroups, 'unassign');
    const groupService = new GroupService();
    const _temp = this.listUnassignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(_temp);
    this.listUnassignGroups = groupService.buildHierarchy(allRelatedGroups);
    this.isBtnUnAssignGroupsActive = false;
    // this.isBtnAssignGroupsActive = !this.isBtnUnAssignGroupsActive;
  }

  save() {
    // if (!this.listAssignGroups || this.listAssignGroups.length == 0) {
    //   return this.commonService.showWarning('Danh sách trống!');
    // }
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
        this.commonService.showSuccess('Cập nhật thành công');
      },
      (err) => this.commonService.showError('Cập nhật thất bại')
    );
  }
  cancel() {
    // this.selectedUser = null;
    // this.listUserVehicleGroup = [];
  }

  getMasterData() {
    this.getListUser();
  }

  getListUser() {
    this.userFilter.FK_CompanyID = this.FK_CompanyID;
    this.userFilter.isLock = false;
    this.userFilter.isDeleted = false;
    this.service.getList(this.userFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.log(res);
          return;
        }
        console.log(res);
        this.listUser = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getListUnassignGroups(pK_UserID: string) {
    this.groupsFilter.fK_CompanyID = this.FK_CompanyID;
    this.groupsFilter.pK_UserID = pK_UserID;
    this.groupsFilter.isDeleted = false;
    this.groupsService.getListUnassignGroups(this.groupsFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        console.log(res.data);
        this.listUnassignGroups = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

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
        this.listOriginalAssignGroups = JSON.parse(JSON.stringify(this.listAssignGroups));
        this.setOriginal();

        const groupService = new GroupService();
        this.listAssignGroups = groupService.buildHierarchy(this.listAssignGroups);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onCheckAllUnassignGroups() {
    this.allCompleteUnAssign = !this.allCompleteUnAssign;
    this.isBtnAssignGroupsActive = this.allCompleteUnAssign;

    this.listUnassignGroups.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.allCompleteUnAssign));
      x.isSelected = this.allCompleteUnAssign;
      x.allComplete = this.allCompleteUnAssign;
    });
  }
  onCheckAllAssignGroups() {
    this.allCompleteAssign = !this.allCompleteAssign;
    this.isBtnUnAssignGroupsActive = this.allCompleteAssign;

    this.listAssignGroups.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.allCompleteAssign));
      x.isSelected = this.allCompleteAssign;
      x.allComplete = this.allCompleteAssign;
    });
  }

  onSelectedChange(item: Groups, list: Groups[], type: 'unassign' | 'assign') {
    const status = list.some((x) => x.isSelected == true) || item.isUiCheck;
    if (type == 'assign') this.isBtnUnAssignGroupsActive = status;
    else this.isBtnAssignGroupsActive = status;
  }
  refreshAllBottom() {
    this.allCompleteAssign = false;
    this.allCompleteUnAssign = false;
    this.isBtnUnAssignGroupsActive = false;
    this.isBtnAssignGroupsActive = false;
  }
  // Getter kiểm tra có thay đổi không
  get isAssignGroupsChanged(): boolean {
    // Nếu chưa từng set bản gốc thì coi như chưa thay đổi
    if (!this.listOriginalAssignGroups || this.listOriginalAssignGroups.length == 0) return false;
    console.log('this.listOriginalAssignGroups');
    console.log(this.listOriginalAssignGroups);

    return !equal(this.listAssignGroups, this.listOriginalAssignGroups);
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
}
