import { Component, OnInit } from '@angular/core';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
import { DialogService } from '../../service/dialog.service';
import { User, UsersFilter } from './model/User';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface Group {
  groupId: number;
  parentId: number | null;
  name: string;
  selected: boolean;
  IsHide: boolean;
  HasChild: boolean;
  IsHideChildren: boolean;
}
@Component({
  selector: 'app-user-vehicle-group',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          // transform: 'rotate(-90deg)'
        })
      ),
      state(
        'closed',
        style({
          transform: 'rotate(-90deg)',
        })
      ),
      transition('open => closed', [animate('0.3s ease-out')]),
      transition('closed => open', [animate('0.3s ease-in')]),
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
      transition('open => closed', [animate('0.3s ease-in')]),
      transition('closed => open', [animate('0.3s ease-out')]),
    ]),
    trigger('filterButton', [
      state('open', style({})),
      state(
        'closed',
        style({
          transform: 'rotate(-180deg)',
        })
      ),
      transition('open => closed', [animate('0.6s ease-out')]),
      transition('closed => open', [animate('0.6s ease-in')]),
    ]),
  ],
  templateUrl: './user-vehicle-group.component.html',
  styleUrls: ['./user-vehicle-group.component.scss'],
})
export class UserVehicleGroupComponent implements OnInit {
  userSearch = '';
  availableGroupSearch = '';
  assignedGroupSearch = '';

  listUser: User[] = [];
  userFilter = new UsersFilter();

  availableGroups: Group[] = [
    {
      groupId: 1,
      parentId: null,
      name: 'Đội xe 1',
      selected: false,
      IsHide: false,
      HasChild: true,
      IsHideChildren: false,
    },
    {
      groupId: 2,
      parentId: 1,
      name: 'Đội xe 2',
      selected: false,
      IsHide: false,
      HasChild: false,
      IsHideChildren: false,
    },
    {
      groupId: 3,
      parentId: null,
      name: 'Petrolimex Hà Nội',
      selected: false,
      IsHide: false,
      HasChild: false,
      IsHideChildren: false,
    },
  ];

  assignedGroups: Group[] = [];

  selectedUser: User | null = null;
  selectedId!: string;
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
    const toAssign = this.availableGroups.filter((g) => g.selected);
    toAssign.forEach((g) => {
      g.selected = false;
      this.assignedGroups.push(g);
    });
    this.availableGroups = this.availableGroups.filter((g) => !g.selected);
  }

  unassignGroups() {
    const toUnassign = this.assignedGroups.filter((g) => g.selected);
    toUnassign.forEach((g) => {
      g.selected = false;
      this.availableGroups.push(g);
    });
    this.assignedGroups = this.assignedGroups.filter((g) => !g.selected);
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
  constructor(private _service: UserVehicleGroupService, private dialogService: DialogService) {}

  ngOnInit() {
    // this.getMasterData();
    this.listUser = this.generateMockUsers();
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
    this.userFilter.FK_CompanyID = 15076;
    this._service.getList(this.userFilter).then(
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

  isExpandAll = false;
  cssTaskLevel(item: Group) {
    if (item.parentId) {
      return 'padding-1';
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
    for (let i = 0; i < this.availableGroups.length; i++) {
      const element = this.availableGroups[i];
      element.IsHide = false;
      element.IsHideChildren = false;
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
    for (let i = 0; i < this.availableGroups.length; i++) {
      const element = this.availableGroups[i];
      if (this.availableGroups.find((x) => x.groupId === element.parentId)) {
        element.IsHide = true;
      }
      element.IsHideChildren = true;
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
  showHideChildren(item: Group) {
    if (item.IsHideChildren) {
      this.showChildren1(item);
    } else {
      this.hideChildren1(item);
    }
  }

  showChildren1(item: Group) {
    // lấy danh sách công viêc có công việc trước đó là Item
    item.IsHideChildren = false;
    const childRows = this.availableGroups.find((x) => x.parentId == item.groupId);
    if (!childRows) {
      return;
    }
    this.availableGroups.forEach((x) => {
      if (x.parentId === item.groupId) {
        x.IsHide = false;
        x.IsHideChildren = false;
      }
    });
    this.showChildren1(childRows);
  }

  hideChildren1(item: Group) {
    // lấy danh sách công viêc có công việc trước đó là Item
    item.IsHideChildren = true;
    const childRows = this.availableGroups.find((x) => x.parentId == item.groupId);
    if (!childRows) {
      return;
    }
    this.availableGroups.forEach((x) => {
      if (x.parentId === item.groupId) {
        x.IsHide = true;
        x.IsHideChildren = true;
      }
    });
    this.hideChildren1(childRows);
  }
}
