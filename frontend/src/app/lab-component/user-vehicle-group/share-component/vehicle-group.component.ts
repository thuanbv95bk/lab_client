import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  /**  tiêu đề */
  @Input() title: string = '';
  /** Id User */
  @Input() userId: string = '';
  /** danh sách nhóm phương tiện- cha-con */
  @Input() listItem: UserVehicleGroupView[];

  /** đã được build cha-con hay chưa */
  @Input() isTree: boolean = false;
  /** outPut sự kiện chọn nhóm */

  @Output() isChangeBtn = new EventEmitter<boolean>();
  /** danh sách nhóm phương tiện- làm phẳng. k có cha-con */

  listItemFlatten: UserVehicleGroupView[]; //

  /** số phần tử của nhóm */
  lengthList: number = 0;

  /** enum dùng cho html */
  directionMoveGroupsEnum = directionMoveGroupsEnum;

  /**  key search */
  stringSearch: string;

  /** check-all */
  isAllItem: boolean = false;

  /** check có sự thay đổi của nhóm */
  isBtnActive: boolean = false;

  constructor(private groupsService: GroupsService) {}

  /** kiểm tra sự thay đỗi của data:userId ,listItem
   * @param SimpleChanges hook
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {
      this.isAllItem = false;
      this.stringSearch = null;
    }

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

  /**click vào check all nhóm, event sự kiên ra cha
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  onCheckAll() {
    this.isAllItem = !this.isAllItem;
    this.isBtnActive = this.isAllItem;

    this.listItem.forEach((x) => {
      x.groupsChild.forEach((t) => (t.isSelected = this.isAllItem));
      x.isSelected = this.isAllItem;
      x.allComplete = this.isAllItem;
    });
    this.isChangeBtn.emit(this.isBtnActive);
  }

  /** khi người dùng chọn 1 item của các nhóm
   * @param item nhóm đã chọn
   * @param list: Groups[] danh sách của tát cả nhóm
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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
