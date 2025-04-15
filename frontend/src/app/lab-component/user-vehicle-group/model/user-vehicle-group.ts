import { Groups } from './groups';

export class UserVehicleGroup {
  PK_UserID!: string | null;
  PK_VehicleGroupID!: number | null;
  parentVehicleGroupId!: number | 0;
  isDeleted!: boolean;
  createdByUser!: string | null;
  createdDate!: Date | null;
  constructor(obj?: Partial<UserVehicleGroup>) {
    this.PK_UserID = obj?.PK_UserID || null;
    this.PK_VehicleGroupID = obj?.PK_VehicleGroupID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || 0;
    this.isDeleted = obj?.isDeleted || false;
    this.createdByUser = obj?.createdByUser || '';
    this.createdDate = obj?.createdDate || new Date();
  }
}

export class UserVehicleGroupView extends Groups {
  PK_UserID!: string | null;
  declare isDeleted: boolean;
  constructor(obj?: Partial<UserVehicleGroupView>) {
    super();
    this.PK_UserID = obj?.PK_UserID || null;
    this.isDeleted = obj?.isDeleted || false;
  }
}

export class VehicleGroupModel {
  PK_UserID!: string | null;
  listGroup: UserVehicleGroupView[];
  constructor(obj?: Partial<VehicleGroupModel>) {
    this.PK_UserID = obj?.PK_UserID || null;
    this.listGroup = obj?.listGroup || [];
  }
}
export class UserVehicleGroupFilter {
  fK_UserID!: string;
  fK_VehicleGroupID: number | null;
  parentVehicleGroupId!: number | null;
  isDeleted!: boolean;
  constructor(obj?: Partial<UserVehicleGroupFilter>) {
    this.fK_UserID = obj?.fK_UserID || '';
    this.fK_VehicleGroupID = obj?.fK_VehicleGroupID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || null;
    this.isDeleted = obj?.isDeleted || null;
  }
}
