import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Groups } from '../../model/groups';
@Component({
  selector: 'app-select-row-groups',
  templateUrl: './select-row-groups.component.html',
  styleUrls: ['./select-row-groups.component.scss'],
})
export class SelectRowGroupsComponent implements AfterViewInit {
  @Input()
  attribute!: Groups;

  @Input() allSelected: boolean = false;
  @Output() selectedChange = new EventEmitter<Groups>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // this.cdRef.detectChanges();
  }

  /**
   * Toggles select all
   * @description chọn/ bỏ chọn check all
   * emit sự kiện ra ngoài: trả về danh sách
   */
  toggleSelectAll() {
    if (this.allSelected) {
      this.attribute.allComplete = true;
      this.attribute.isSelected = true;
      this.attribute.groupsChild.forEach((x) => (x.isSelected = true));
    } else {
      this.attribute.allComplete = false;
      this.attribute.isSelected = false;
      this.attribute.groupsChild.forEach((x) => (x.isSelected = false));
    }
    this.attribute.isUiCheck = this.allSelected;
    this.selectedChange.emit(this.attribute);
  }

  /**
   * Padding level
   * Thêm padding cho item nếu nó là cấp con
   * @param item
   * @returns
   */
  paddingLevel(item: Groups) {
    if (item.parentVehicleGroupId) {
      return 'padding-' + (item.level - 1);
    }
    return 'padding-0';
  }

  /**
   * Updates all complete
   * chọn all từ 1 cấp cha
   * @param Attribute
   */
  updateAllComplete(Attribute: Groups) {
    Attribute.allComplete = Attribute.groupsChild != null && Attribute.groupsChild.every((t) => t.isSelected);
    this.attribute.isSelected = Attribute.allComplete;
  }

  someComplete(node: Groups): boolean {
    if (node.groupsChild == null) {
      return false;
    }

    return node.groupsChild.filter((t) => t.isSelected).length > 0 && !node.allComplete;
  }

  onCheckboxChange(event: Event, item: Groups): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    item.isSelected = isChecked;
    this.changeEditNode(isChecked, item);
    if (this.attribute.groupsChild.length == 1) this.attribute.isSelected = isChecked;
    this.attribute.isUiCheck = isChecked;
    this.selectedChange.emit(this.attribute);
  }

  changeEditNode(checked: boolean, Attribute: Groups) {
    Attribute.allComplete = checked;
    Attribute.isSelected = checked;
    if (Attribute.groupsChild == null) {
      return;
    }
    Attribute.groupsChild.forEach((t) => (t.isSelected = checked));
  }

  /**
   * Toggles visibility
   * Mở / đóng 1 cây
   * @param attribute
   */
  toggleVisibility(attribute: Groups) {
    attribute.isHideChildren = !attribute.isHideChildren; // Mở hoặc đóng
  }
}
