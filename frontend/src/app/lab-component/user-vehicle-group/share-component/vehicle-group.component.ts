import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { User } from '../model/admin-user';
import { UserVehicleGroupView } from '../model/user-vehicle-group';
import { directionMoveGroupsEnum } from '../enum/vehicle-group.enum';
import { Groups } from '../model/groups';
import { GroupsService } from '../service/groups.service';

@Component({
  selector: 'app-vehicle-group',
  templateUrl: './vehicle-group.component.html',
  styleUrls: ['./vehicle-group.component.scss'],
})
export class VehicleGroupComponent implements OnChanges {
  @Input() title: string = '';
  @Input() listItem: UserVehicleGroupView[]; //danh sách nhóm phương tiện- cha-con
  @Input() isTree: boolean = false;
  @Input() groupType: directionMoveGroupsEnum;
  @Output() eventChange = new EventEmitter<{ listItem: UserVehicleGroupView[]; groupType: directionMoveGroupsEnum }>();
  @Output() isChangeBtn = new EventEmitter<boolean>();
  listItemFlatten: UserVehicleGroupView[]; //danh sách nhóm phương tiện- làm phẳng
  lengthList: number = 0;

  directionMoveGroupsEnum = directionMoveGroupsEnum; // enum
  stringSearch: string;

  // selectedId = new User(); // useKey chon người dùng
  // first: number = 0; // kiểm tra- lấy dữ liệu lần đầu cho nhóm
  // currentGroupIdsStr = ''; // string-key check sự thay đổi của các nhóm
  // originalGroupIdsStr = ''; // string-key-original check sự thay đổi của các nhóm

  // allCompleteAssign: boolean = false; // check-all nhóm đã gán
  isAllItem: boolean = false; // check-all nhóm chưa gán

  isBtnActive: boolean = false; // check có sự thay đổi của nhóm chưa gán
  // isBtnUnAssignGroupsActive: boolean = false; // check có sự thay đổi của nhóm chưa gán
  // isBtnAssignGroupsActive: boolean = false; // check có sự thay đổi của nhóm đã gán

  constructor(private groupsService: GroupsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listItem']) {
      if (!this.listItem) {
        this.lengthList = 0;
      } else {
        this.listItemFlatten = this.isTree == true ? this.groupsService.flattenGroupTree(this.listItem) : this.listItem;
        if (this.listItem.length > 0 && this.isTree == false) {
          this.listItem = this.groupsService.buildHierarchy(this.listItemFlatten);
        }

        this.lengthList = this.listItemFlatten?.length || 0;
      }
    }
  }

  /**
   * Determines whether check all unassign groups on
   * @event click vào check all nhóm
   */

  onCheckAll() {
    this.isAllItem = !this.isAllItem;
    this.isBtnActive = this.isAllItem;

    this.listItem.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.isAllItem));
      x.isSelected = this.isAllItem;
      x.allComplete = this.isAllItem;
    });
    console.log('this.isBtnActive:' + this.isBtnActive);
    this.isChangeBtn.emit(this.isBtnActive);
  }

  /**
   * Determines whether selected change on
   * @event outEvent khi người dùng chọn 1 item của các nhóm
   * @param item Groups
   * @param list Groups[]
   * @param type 'unassign' | 'assign'
   */
  onSelectedChange(item: Groups, list: Groups[]) {
    let status = false;
    if (
      list.some((x) => x.isSelected == true) ||
      item.isUiCheck == true ||
      (item.hasChild == true && item.groupsChild.some((x) => x.isSelected == true))
    ) {
      status = true;
    } else status = false;

    this.isBtnActive = status;

    this.isChangeBtn.emit(this.isBtnActive);
  }
}
