import { Component, Input } from '@angular/core';
import { User } from '../model/admin-user';
import { UserVehicleGroupView } from '../model/user-vehicle-group';
import { directionMoveGroupsEnum } from '../enum/vehicle-group.enum';
import { Groups } from '../model/groups';

@Component({
  selector: 'app-vehicle-group',
  templateUrl: './vehicle-group.component.html',
  styleUrls: ['./vehicle-group.component.scss'],
})
export class VehicleGroupComponent {
  @Input() title: string = '';
  @Input() lengthList: number = 0;

  @Input() listUnassignGroups: UserVehicleGroupView[]; // nhóm chưa gán
  directionMoveGroupsEnum = directionMoveGroupsEnum;

  unAssignGroupsSearch: string;

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
   * Determines whether selected change on
   * @event outEvent khi người dùng chọn 1 item của các nhóm
   * @param item Groups
   * @param list Groups[]
   * @param type 'unassign' | 'assign'
   */
  onSelectedChange(item: Groups, list: Groups[], type: directionMoveGroupsEnum) {
    let status = false;
    if (
      list.some((x) => x.isSelected == true) ||
      item.isUiCheck == true ||
      (item.hasChild == true && item.groupsChild.some((x) => x.isSelected == true))
    ) {
      status = true;
    } else status = false;
    console.log(item.isUiCheck);

    if (type == directionMoveGroupsEnum.Assign) this.isBtnUnAssignGroupsActive = status;
    else this.isBtnAssignGroupsActive = status;
  }
  get getIsDataUnAssignGroups() {
    if (this.listUnassignGroups?.length > 0) return true;
    return false;
  }
}
