import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GroupsService } from './service/groups.service';
import { User, UsersFilter } from './model/user';
import { Groups, GroupsFilter } from './model/groups';

@Component({
  selector: 'app-user-vehicle-group',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('open => closed', [animate('0.5s ease-out')]),
      transition('closed => open', [animate('0.5s ease-in')]),
    ]),
    trigger('showHide', [
      state(
        'open',
        style({
          opacity: '1',
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: '0',
        })
      ),
      transition('open => closed', [animate('0.5s ease-in')]),
      transition('closed => open', [animate('0.5s ease-out')]),
    ]),
  ],
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
  listGroups: Groups[] = [];
  // listGroups: Groups[] = [
  //   {
  //     PK_VehicleGroupID: 1,
  //     parentVehicleGroupId: null,
  //     name: 'Đội xe 1',
  //     isSelected: false,
  //     isHide: false,
  //     hasChild: true,
  //     isHideChildren: false,
  //     FK_CompanyID: null,
  //     status: false,
  //     isDeleted: false,
  //     groupsChild: [],
  //   },
  //   {
  //     PK_VehicleGroupID: 2,
  //     parentVehicleGroupId: 1,
  //     name: 'Đội xe 1.1',
  //     isSelected: false,
  //     isHide: false,
  //     hasChild: false,
  //     isHideChildren: false,
  //     FK_CompanyID: null,
  //     status: false,
  //     isDeleted: false,
  //     groupsChild: [],
  //   },
  //   {
  //     PK_VehicleGroupID: 3,
  //     parentVehicleGroupId: null,
  //     name: 'Đội xe 2',
  //     isSelected: false,
  //     isHide: false,
  //     hasChild: false,
  //     isHideChildren: false,
  //     FK_CompanyID: null,
  //     status: false,
  //     isDeleted: false,
  //     groupsChild: [],
  //   },
  // ];

  assignedGroups: Groups[] = [];

  selectedUser: User | null = null;
  selectedId!: string;

  constructor(private service: UserService, private groupsService: GroupsService) {}

  ngOnInit() {
    this.getMasterData();
    // this.listUser = this.generateMockUsers();
  }
  selectUser(user: User) {
    this.selectedUser = user;
  }
  onClickRow(item: User) {
    if (this.selectedId != item.PK_UserID) {
      this.selectedId = item.PK_UserID;
    } else {
      this.selectedId = '';
    }
  }

  assignGroups() {
    const toAssign = this.listGroups.filter((g) => g.isSelected);
    toAssign.forEach((g) => {
      g.isSelected = false;
      this.assignedGroups.push(g);
    });
    this.listGroups = this.listGroups.filter((g) => !g.isSelected);
  }

  unassignGroups() {
    const toUnassign = this.assignedGroups.filter((g) => g.isSelected);
    toUnassign.forEach((g) => {
      g.isSelected = false;
      this.listGroups.push(g);
    });
    this.assignedGroups = this.assignedGroups.filter((g) => !g.isSelected);
  }

  save() {
    console.log('Save:', {
      user: this.selectedUser,
      assignedGroups: this.assignedGroups.map((g) => g.name),
    });
  }

  cancel() {
    // this.openError();
    // return;
    this.selectedUser = null;
    this.assignedGroups = [];
  }

  generateMockUsers(count: number = 60): User[] {
    const users: User[] = [];

    for (let i = 1; i <= count; i++) {
      const user: User = new User({
        PK_UserID: `USR${i.toString().padStart(4, '0')}`,
        FK_CompanyID: Math.floor(Math.random() * 5) + 1,
        username: `user${i}`,
        userNameLower: `user${i}`.toLowerCase(),
        fullName: `User Name ${i}`,
        userType: i % 3,
        isLock: i % 10 === 0, // mỗi 10 user thì khóa 1
        updatedByUser: `admin`,
        updatedDate: new Date(),
        isDeleted: false,
        phoneNumber: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: `user${i}@example.com`,
      });

      users.push(user);
    }

    return users;
  }
  getMasterData() {
    this.getListUser();
    this.getListGroups();
  }
  getListUser() {
    this.userFilter.FK_CompanyID = this.FK_CompanyID;
    this.service.getList(this.userFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.log(res);
          // console.error(res);
          return;
        }
        console.log(res.data);
        this.listUser = res.data;
      },
      (err) => {
        console.log(err);
        // this.dialogService.openErrorDialog(err);
      }
    );
  }

  getListGroups() {
    this.groupsFilter.FK_CompanyID = this.FK_CompanyID;
    this.groupsService.getList(this.groupsFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        console.log(res.data);
        this.listGroups = res.data;
        if (this.listGroups && Array.isArray(this.listGroups) && this.listGroups.length > 0) {
          for (let i = 0; i < this.listGroups.length; i++) {
            // const element = this.listGroups[i];
            // if (element.parentVehicleGroupId !== null && element.parentVehicleGroupId > 0) {
            //   const parentT = this.listGroups.find((x) => x.PK_VehicleGroupID === element.parentVehicleGroupId);
            //   element.hasChild = true;
            //   if (parentT && !parentT.isHideChildren) {
            //     element.isHide = false;
            //   }
            // } else if (element.parentVehicleGroupId == 0) {
            //   element.hasChild = false;
            //   // element.isHideChildren = true;
            // }
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  isExpandAll = false;
  paddingLevel(item: Groups) {
    if (item.parentVehicleGroupId) {
      return 'padding-' + item.level;
    }
    return 'padding-0';
  }

  toggleExpandAll() {
    this.isExpandAll = !this.isExpandAll;
    if (!this.isExpandAll) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }
  // mở rộng
  expandAll() {
    for (let i = 0; i < this.listGroups.length; i++) {
      const element = this.listGroups[i];
      element.isHide = false;
      element.isHideChildren = false;
    }
    // if (this.filteredTasks && Array.isArray(this.filteredTasks) && this.filteredTasks.length > 0) {
    //   for (let i = 0; i < this.filteredTasks.length; i++) {
    //     const element = this.filteredTasks[i];
    //     element.IsHide = false;
    //     element.IsHideChildren = false;
    //   }
    // }
  }

  collapseAll() {
    for (let i = 0; i < this.listGroups.length; i++) {
      const element = this.listGroups[i];
      if (this.listGroups.find((x) => x.PK_VehicleGroupID === element.parentVehicleGroupId)) {
        element.isHide = true;
      }
      element.isHideChildren = true;
    }
    // if (this.item && Array.isArray(this.filteredTasks) && this.filteredTasks.length > 0) {
    //   for (let i = 0; i < this.filteredTasks.length; i++) {
    //     const element = this.filteredTasks[i];
    //     if (
    //       ((!this.filterNameText || this.filterNameText.trim() === '') && element.TreeNodeLevel > 0) ||
    //       this.filteredTasks.find((x) => x.C_Task_Id === element.Parent_Id)
    //     ) {
    //       element.IsHide = true;
    //     }
    //     element.IsHideChildren = true;
    //   }
    // }
  }
  showHideChildren(item: Groups) {
    if (item.isHideChildren) {
      this.showChildren1(item);
    } else {
      this.hideChildren1(item);
    }
  }

  //

  showChildren1(item: Groups) {
    item.isHideChildren = false;

    if (item.groupsChild.length == 0) return;

    item.groupsChild.forEach((x) => {
      const index = this.listGroups.findIndex((y) => y.parentVehicleGroupId == x.parentVehicleGroupId && y.parentVehicleGroupId > 0);
      console.log(index);

      if (index > -1) {
        this.listGroups[index].isHide = false;
        this.listGroups[index].isHideChildren = false;
      }
    });
  }
  hideChildren1(item: Groups) {
    item.isHideChildren = true;
    if (item.groupsChild.length == 0) return;

    item.groupsChild.forEach((x) => {
      const index = this.listGroups.findIndex((y) => y.parentVehicleGroupId == x.parentVehicleGroupId && y.parentVehicleGroupId > 0);
      console.log(index);
      if (index > -1) {
        this.listGroups[index].isHide = true;
        this.listGroups[index].isHideChildren = true;
      }
    });
  }
}
