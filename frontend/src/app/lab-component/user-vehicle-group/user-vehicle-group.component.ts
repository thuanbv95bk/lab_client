import { Component, OnInit } from '@angular/core';
import { UserVehicleGroupService } from './service/user-vehicle-group.service';
import { DialogService } from '../../service/dialog.service';
import { User, UsersFilter } from './model/User';

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

  listUser: User[] = [];
  userFilter = new UsersFilter();

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
    // this.openError();
    // return;
    this.selectedUser = null;
    this.assignedGroups = [];
  }
  constructor(private _service: UserVehicleGroupService, private dialogService: DialogService) {}

  ngOnInit() {
    this.getMasterData();
  }

  getMasterData() {
    this.userFilter.FK_CompanyID = 15076;
    this._service.getList(this.userFilter).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        console.log(res.data);
        this.listUser = res.data;
      },
      (err) => {
        // this.dialogService.openErrorDialog(err);
      }
    );
  }

  // Hàm gọi modal
  openError() {
    const errorData = {
      message: 'An error occurred',
      ErrorMessage: 'Something went wrong!',
      Data: 'Additional information',
    };

    const dialogRef = this.dialogService.openErrorDialog(errorData);

    // Bạn có thể kiểm tra hoặc theo dõi khi modal đóng tại đây nếu cần
    dialogRef.closeDialog(); // Đóng modal khi cần thiết (có thể trigger sau khi xử lý)
  }
}
