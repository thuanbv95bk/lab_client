import { Component, Input, OnInit } from '@angular/core';
import { Groups } from '../../model/groups';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-select-row-groups',
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
  templateUrl: './select-row-groups.component.html',
  styleUrls: ['./select-row-groups.component.scss'],
})
export class SelectRowGroupsComponent implements OnInit {
  @Input()
  item!: Groups;
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
    for (let i = 0; i < this.item.groupsChild.length; i++) {
      const element = this.item.groupsChild[i];
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
    for (let i = 0; i < this.item.groupsChild.length; i++) {
      const element = this.item.groupsChild[i];
      if (this.item.groupsChild.find((x) => x.pK_VehicleGroupID === element.parentVehicleGroupId)) {
        element.isHide = true;
      }
      element.isHideChildren = true;
    }
  }
  showHideChildren(item: Groups) {
    if (item.isHideChildren) {
      this.showChildren1(item);
    } else {
      this.hideChildren1(item);
    }
  }

  showChildren1(item: Groups) {
    item.isHideChildren = false;
    const childRows = this.item.groupsChild.find((x) => x.parentVehicleGroupId == item.pK_VehicleGroupID);
    if (!childRows) {
      return;
    }
    this.item.groupsChild.forEach((x) => {
      if (x.parentVehicleGroupId === item.pK_VehicleGroupID) {
        x.isHide = false;
        x.isHideChildren = false;
      }
    });
    this.showChildren1(childRows);
  }

  hideChildren1(item: Groups) {
    item.isHideChildren = true;
    const childRows = this.item.groupsChild.find((x) => x.parentVehicleGroupId == item.pK_VehicleGroupID);
    if (!childRows) {
      return;
    }
    this.item.groupsChild.forEach((x) => {
      if (x.parentVehicleGroupId === item.pK_VehicleGroupID) {
        x.isHide = true;
        x.isHideChildren = true;
      }
    });
    this.hideChildren1(childRows);
  }
}
