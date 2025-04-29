import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserVehicleGroupView } from '../../model/user-vehicle-group';
@Component({
  selector: 'app-select-row-groups',
  templateUrl: './select-row-groups.component.html',
  styleUrls: ['./select-row-groups.component.scss'],
})
export class SelectRowGroupsComponent {
  /** 1 nhóm cụ thể */
  @Input() attribute!: UserVehicleGroupView;
  /** có chọn all hay không? true:all */
  @Input() allSelected: boolean = false;
  /** Event sự kiện:  */
  @Output() selectedChange = new EventEmitter<UserVehicleGroupView>();

  /**  Thêm padding cho item nếu nó là cấp con
   * @param item nhóm group
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  paddingLevel(item: UserVehicleGroupView) {
    if (item.parentVehicleGroupId) {
      return 'padding-' + (item.level - 1);
    }
    return 'padding-0';
  }

  /** chọn all từ 1 cấp cha
   * @param attribute 1 nhóm
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  updateAllComplete(attribute: UserVehicleGroupView) {
    attribute.allComplete = attribute.groupsChild != null && attribute.groupsChild.every((t) => t.isSelected);
    this.attribute.isSelected = attribute.allComplete;
  }

  /** get selected trạng thái của 1 node trong nhóm
   * @param node 1 nhóm
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  someComplete(node: UserVehicleGroupView): boolean {
    if (node.groupsChild == null) {
      return false;
    }

    return node.groupsChild.filter((t) => t.isSelected).length > 0 && !node.allComplete;
  }

  /** get trang thái selected của 1 node trong nhóm, set vào checkbox
   * và emit sự kiện ra ngoài
   * @param event Event
   * @param item 1 nhóm- node
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  onCheckboxChange(event: Event, item: UserVehicleGroupView): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    item.isSelected = isChecked;
    this.changeEditNode(isChecked, item);
    if (this.attribute.groupsChild.length == 1) this.attribute.isSelected = isChecked;
    this.attribute.isUiCheck = isChecked;
    this.selectedChange.emit(this.attribute);
  }

  /** set các trạng thái của 1 node
   * @param checked trạng thái muốn set
   * @param attribute 1 node cần set
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  changeEditNode(checked: boolean, attribute: UserVehicleGroupView) {
    attribute.allComplete = checked;
    attribute.isSelected = checked;
    if (attribute.groupsChild == null) {
      return;
    }
    attribute.groupsChild.forEach((t) => (t.isSelected = checked));
  }

  /** Mở / đóng 1 cây
   * @param param1 node muốn set
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  toggleVisibility(attribute: UserVehicleGroupView) {
    attribute.isHideChildren = !attribute.isHideChildren; // Mở hoặc đóng
  }
}
