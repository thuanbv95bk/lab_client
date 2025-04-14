import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GroupsService } from './service/groups.service';
import { Groups, GroupService, GroupsFilter } from './model/groups';
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
    console.log('allRelatedGroups');
    console.log(allRelatedGroups);

    if (direction === 'assign') {
      this.listUnassignGroups = groupService.buildHierarchy(allRelatedGroups);
    } else {
      this.listAssignGroups = groupService.buildHierarchy(allRelatedGroups);
    }
  }

  private buildGroupTree(flatList: UserVehicleGroupView[]): UserVehicleGroupView[] {
    const idMap = new Map<number, UserVehicleGroupView>();
    const roots: UserVehicleGroupView[] = [];

    // Khởi tạo
    flatList.forEach((item) => {
      item.groupsChild = []; // reset trước
      idMap.set(item.pK_VehicleGroupID!, item);
    });

    flatList.forEach((item) => {
      if (item.parentVehicleGroupId && idMap.has(item.parentVehicleGroupId)) {
        const parent = idMap.get(item.parentVehicleGroupId)!;
        parent.groupsChild.push(item);
        parent.hasChild = true;
      } else {
        roots.push(item);
      }
    });

    return roots;
  }

  assignGroups() {
    this.moveGroups(this.listUnassignGroups, this.listAssignGroups, 'assign');
    console.log('assign');
    const groupService = new GroupService();
    const _temp = this.listAssignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(_temp);
    this.listAssignGroups = groupService.buildHierarchy(allRelatedGroups);

    console.log(this.listAssignGroups);
  }

  unassignGroups() {
    this.moveGroups(this.listAssignGroups, this.listUnassignGroups, 'unassign');
    console.log('assign');
    const groupService = new GroupService();
    const _temp = this.listUnassignGroups;
    const allRelatedGroups = groupService.flattenGroupTree(_temp);
    this.listUnassignGroups = groupService.buildHierarchy(allRelatedGroups);
  }
  // assignGroups() {
  //   const toAssign = this.listUnassignGroups.filter((g) => g.isSelected || g.hasChild || g.allComplete);
  //   console.log('toAssign', toAssign);

  //   const groupsToAssign = [];

  //   toAssign.forEach((g) => {
  //     if (g.allComplete) {
  //       // Nếu không có child, trực tiếp gán
  //       if (!g.hasChild) {
  //         groupsToAssign.push(g);
  //         g.isSelected = false;
  //       } else {
  //         groupsToAssign.push(g);
  //       }
  //     } else if (g.hasChild) {
  //       // Nếu có child và chưa hoàn tất, duyệt qua child
  //       g.groupsChild.forEach((x) => {
  //         if (x.isSelected) {
  //           groupsToAssign.push(x);
  //         }
  //       });
  //     }
  //   });

  //   // Cập nhật lại listAssignGroups và listUnassignGroups
  //   this.listAssignGroups.push(...groupsToAssign);
  //   this.listUnassignGroups = this.listUnassignGroups.filter((g) => !groupsToAssign.includes(g));

  //   // Cập nhật các nhóm con trong listUnassignGroups
  //   this.listUnassignGroups.forEach((g) => {
  //     if (g.hasChild && !g.allComplete) {
  //       const selectedChildren = g.groupsChild.filter((x) => x.isSelected);
  //       g.groupsChild = g.groupsChild.filter((item) => !selectedChildren.includes(item));
  //     }
  //   });

  //   // assignGroups() {
  //   //   const toAssign = this.listUnassignGroups.filter((g) => g.isSelected || g.hasChild || g.allComplete);
  //   //   console.log('toAssign', toAssign);

  //   //   toAssign.forEach((g) => {
  //   //     if (!g.hasChild && g.allComplete == true) {
  //   //       this.listAssignGroups.push(g);
  //   //       g.isSelected = false;
  //   //     } else if (g.hasChild && g.allComplete == true) {
  //   //       this.listAssignGroups.push(g);
  //   //     } else if (g.hasChild && g.allComplete == false) {
  //   //       console.log('ffff');

  //   //       g.groupsChild.forEach((x) => {
  //   //         if (x.isSelected == true) {
  //   //           this.listAssignGroups.push(x);
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   this.listUnassignGroups = this.listUnassignGroups.filter((g) => !this.listAssignGroups.includes(g));
  //   //   this.listUnassignGroups.forEach((g) => {
  //   //     if (g.hasChild && g.allComplete == false) {
  //   //       const _remore = g.groupsChild.filter((x) => x.isSelected == true);
  //   //       g.groupsChild = g.groupsChild.filter((item) => !_remore.includes(item));
  //   //     }
  //   //   });
  //   // console.log(toAssign);
  //   // toAssign.forEach((x) => {
  //   //   const index = this.listAssignGroups.findIndex((y) => y.pK_VehicleGroupID == x.pK_VehicleGroupID);
  //   //   if (index > -1) {
  //   //     this.listUnassignGroups.splice(index, 1);
  //   //   }
  //   // });

  //   // this.listUnassignGroups = this.listUnassignGroups.filter((g) => !g.isSelected);
  // }

  // unassignGroups() {
  //   const toUnassign = this.listAssignGroups.filter((g) => g.isSelected || g.hasChild || g.allComplete);
  //   console.log('toUnassign', toUnassign);

  //   const groupsToUnassign = [];

  //   toUnassign.forEach((g) => {
  //     if (g.allComplete) {
  //       if (!g.hasChild) {
  //         groupsToUnassign.push(g);
  //         g.isSelected = false;
  //       } else {
  //         groupsToUnassign.push(g);
  //       }
  //     } else if (g.hasChild) {
  //       g.groupsChild.forEach((x) => {
  //         if (x.isSelected) {
  //           groupsToUnassign.push(x);
  //         }
  //       });
  //     }
  //   });

  //   // Đẩy về listUnassignGroups
  //   this.listUnassignGroups.push(...groupsToUnassign);
  //   this.listAssignGroups = this.listAssignGroups.filter((g) => !groupsToUnassign.includes(g));

  //   // Cập nhật các nhóm con trong listAssignGroups
  //   this.listAssignGroups.forEach((g) => {
  //     if (g.hasChild && !g.allComplete) {
  //       const selectedChildren = g.groupsChild.filter((x) => x.isSelected);
  //       g.groupsChild = g.groupsChild.filter((item) => !selectedChildren.includes(item));
  //     }
  //   });
  // }

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
