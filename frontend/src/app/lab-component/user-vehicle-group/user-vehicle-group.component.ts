import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GroupsService } from './service/groups.service';
import { Groups, GroupsFilter } from './model/groups';
import { UserVehicleGroupFilter, UserVehicleGroupView } from './model/user-vehicle-group';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
import { User, UsersFilter } from './model/user';
import { AppGlobals } from '../../common/app-global';

@Component({
  selector: 'app-user-vehicle-group',
  templateUrl: './user-vehicle-group.component.html',
  styleUrls: ['./user-vehicle-group.component.scss'],
})
export class UserVehicleGroupComponent implements OnInit {
  FK_CompanyID: number = 15076;
  userSearch = '';
  availableGroupSearch = '';
  assignedGroupSearch = '';
  childRows = new Groups();
  listUser: User[] = [];
  userFilter = new UsersFilter();
  groupsFilter = new GroupsFilter();

  groupsViewFilter = new UserVehicleGroupFilter();
  listGroups: Groups[] = [];

  listUserVehicleGroup: UserVehicleGroupView[] = [];

  selectedUser: User | null = null;
  appGlobals!: AppGlobals;
  selectedId = new User();

  constructor(private service: UserService, private groupsService: GroupsService, private userVehicleGroupService: UserVehicleGroupService) {}

  ngOnInit() {
    this.getMasterData();
  }
  selectUser(user: User) {
    this.selectedUser = user;
  }

  onClickRow(item: User) {
    if (this.selectedId != item) {
      this.selectedId = item;
    } else {
      this.selectedId = new User();
    }
    if (!item || item.pK_UserID == '') return;
    this.getListUnassignGroups(item.pK_UserID);
    this.getListAssignGroups(item.pK_UserID);
  }

  assignGroups() {
    const toAssign = this.listGroups.filter((g) => g.isSelected);
    toAssign.forEach((g) => {
      g.isSelected = false;
      // this.listUserVehicleGroup.push(g);
    });
    this.listGroups = this.listGroups.filter((g) => !g.isSelected);
  }

  unassignGroups() {
    const toUnassign = this.listUserVehicleGroup.filter((g) => g.isSelected);
    toUnassign.forEach((g) => {
      g.isSelected = false;
      this.listGroups.push(g);
    });
    this.listUserVehicleGroup = this.listUserVehicleGroup.filter((g) => !g.isSelected);
  }

  save() {
    console.log('Save:', {
      user: this.selectedUser,
      assignedGroups: this.listUserVehicleGroup.map((g) => g.name),
    });
  }

  cancel() {
    this.selectedUser = null;
    this.listUserVehicleGroup = [];
  }

  getMasterData() {
    this.getListUser();
    // this.getListGroups();
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
        console.log(res.data);
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
    this.groupsService.getListUnassignGroups(this.groupsFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        console.log(res.data);
        this.listGroups = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getListAssignGroups(PK_UserID: string) {
    this.groupsViewFilter.fK_UserID = PK_UserID;
    this.userVehicleGroupService.getListAssignGroups(this.groupsViewFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listUserVehicleGroup = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  paddingLevel(item: Groups) {
    if (item.parentVehicleGroupId) {
      return 'padding-' + item.level;
    }
    return 'padding-0';
  }

  //-----------------------------------------------------------------------------------//
  updateAllComplete(Attribute: Groups) {
    Attribute.allComplete = Attribute.groupsChild != null && Attribute.groupsChild.every((t) => t.isSelected);
  }

  someComplete(node: Groups): boolean {
    if (node.groupsChild == null) {
      return false;
    }
    return node.groupsChild.filter((t) => t.isSelected).length > 0 && !node.allComplete;
  }
  onCheckboxChange(event: Event, attribute: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.changeEditNode(isChecked, attribute);
  }
  changeEditNode(checked: boolean, Attribute: Groups) {
    Attribute.allComplete = checked;
    if (Attribute.groupsChild == null) {
      return;
    }
    Attribute.groupsChild.forEach((t) => (t.isSelected = checked));
  }

  toggleVisibility(attribute: Groups) {
    attribute.isHide = !attribute.isHide; // Mở hoặc đóng
  }
}
