import { Component, Input, OnInit } from '@angular/core';
import { Groups } from '../../model/groups';
@Component({
  selector: 'app-select-row-groups-2',
  templateUrl: './select-row-groups-2.component.html',
  styleUrls: ['./select-row-groups-2.component.scss'],
})
export class SelectRowGroups2Component implements OnInit {
  @Input()
  attribute!: Groups;
  availableGroupSearch = '';
  assignedGroupSearch = '';
  constructor() {}

  ngOnInit() {}

  isExpandAll = false;
  paddingLevel(item: Groups) {
    if (item.parentVehicleGroupId) {
      return 'padding-1';
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
