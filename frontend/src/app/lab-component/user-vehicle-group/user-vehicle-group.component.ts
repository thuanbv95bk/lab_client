import { Component, OnInit } from '@angular/core';
interface User {
  name: string;
}
interface Group {
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-user-vehicle-group',
  templateUrl: './user-vehicle-group.component.html',
  styleUrls: ['./user-vehicle-group.component.scss'],
})
export class UserVehicleGroupComponent implements OnInit {
  userSearch = '';
  availableGroupSearch = '';
  assignedGroupSearch = '';

  users: User[] = [
    { name: '29H16823' },
    { name: '29H20925' },
    { name: 'Công ty xăng dầu Khu vực III' },
  ];

  availableGroups: Group[] = [
    { name: 'Đội xe 1', selected: false },
    { name: 'Đội xe 2', selected: false },
    { name: 'Petrolimex Hà Nội', selected: false },
  ];

  assignedGroups: Group[] = [];

  selectedUser: User | null = null;

  selectUser(user: User) {
    this.selectedUser = user;
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
    this.selectedUser = null;
    this.assignedGroups = [];
  }
  constructor() {}

  ngOnInit() {}
}
