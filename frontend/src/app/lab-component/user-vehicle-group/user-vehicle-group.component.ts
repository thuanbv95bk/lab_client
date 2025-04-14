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
  unAssignGroupsSearch = '';
  assignGroupsSearch = '';
  childRows = new UserVehicleGroupView();
  listUser: User[] = [];
  userFilter = new UsersFilter();
  groupsFilter = new GroupsFilter();

  groupsViewFilter = new UserVehicleGroupFilter();
  listUnassignGroups: UserVehicleGroupView[] = [];

  listAssignGroups: UserVehicleGroupView[] = [];

  selectedUser: User | null = null;
  appGlobals!: AppGlobals;
  selectedId = new User();

  allComplete: boolean = false;
  isBtnUnAssignGroupsActive: boolean = false;
  isBtnAssignGroupsActive: boolean = false;
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
    const toAssign = this.listUnassignGroups.filter((g) => g.isSelected);
    toAssign.forEach((g) => {
      if (!g.hasChild || g.allComplete == true) {
        g.isSelected = false;
        this.listAssignGroups.push(g);
      } else {
        console.log('ffff');

        g.groupsChild.forEach((x) => {
          if (x.isSelected == true) {
            this.listAssignGroups.push(x);
            toAssign.push(x);
          }
        });
      }
    });
    console.log(toAssign);
    toAssign.forEach((x) => {
      const index = this.listUnassignGroups.findIndex((y) => y.pK_VehicleGroupID == x.pK_VehicleGroupID);
      if (index > -1) {
        this.listUnassignGroups.splice(index, 1);
      }
    });

    // this.listUnassignGroups = this.listUnassignGroups.filter((g) => !g.isSelected);
  }

  unassignGroups() {
    const toUnassign = this.listAssignGroups.filter((g) => g.isSelected);
    toUnassign.forEach((g) => {
      g.isSelected = false;
      this.listUnassignGroups.push(g);
    });
    this.listAssignGroups = this.listAssignGroups.filter((g) => !g.isSelected);
  }

  save() {
    // console.log('Save:', {
    //   user: this.selectedUser,
    //   assignedGroups: this.listUserVehicleGroup.map((g) => g.name),
    // });
  }

  cancel() {
    // this.selectedUser = null;
    // this.listUserVehicleGroup = [];
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
    // this.groupsFilter.isDeleted = false;
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
    this.userVehicleGroupService.getListAssignGroups(this.groupsViewFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listAssignGroups = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //-----------------------------------------------------------------------------------//
  // updateAllComplete(Attribute: Groups) {
  //   Attribute.allComplete = Attribute.groupsChild != null && Attribute.groupsChild.every((t) => t.isSelected);
  // }

  // someComplete(node: Groups): boolean {
  //   if (node.groupsChild == null) {
  //     return false;
  //   }
  //   return node.groupsChild.filter((t) => t.isSelected).length > 0 && !node.allComplete;
  // }
  // onCheckboxChange(event: Event, attribute: any): void {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   this.changeEditNode(isChecked, attribute);
  // }
  // changeEditNode(checked: boolean, Attribute: Groups) {
  //   Attribute.allComplete = checked;
  //   if (Attribute.groupsChild == null) {
  //     return;
  //   }
  //   Attribute.groupsChild.forEach((t) => (t.isSelected = checked));
  // }

  // toggleVisibility(attribute: Groups) {
  //   attribute.isHide = !attribute.isHide; // Mở hoặc đóng
  // }

  onCheckAll($event, list: Groups[]) {
    this.allComplete = !this.allComplete;
    console.log(this.allComplete);
    console.log(list);
    this.isBtnAssignGroupsActive = this.allComplete;

    list.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.allComplete));
      x.isSelected = this.allComplete;
      x.allComplete = this.allComplete;
    });
  }
  onSelectedChange(item: Groups, list: Groups[]) {
    console.log('onSelectedChange');
    console.log(item);
    console.log(list);
    this.isBtnAssignGroupsActive = list.some((x) => x.isSelected == true) || item.isUiCheck;
  }
}
