export class Groups {
  PK_VehicleGroupID!: number | null;
  FK_CompanyID!: number | null;
  parentVehicleGroupId!: number | 0;
  name!: string;
  status!: boolean;
  isDeleted!: boolean;
  hasChild!: boolean;
  isHideChildren!: boolean;
  isHide!: boolean;
  level: number;
  groupsChild!: Groups[];

  isSelected!: boolean | false;
  constructor(obj?: Partial<Groups>) {
    this.PK_VehicleGroupID = obj?.PK_VehicleGroupID || null;
    this.FK_CompanyID = obj?.FK_CompanyID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || 0;
    this.name = obj?.name || '';
    this.status = obj?.status || true;
    this.isDeleted = obj?.isDeleted || false;
    this.hasChild = obj?.hasChild || false;
    this.isHideChildren = obj?.isHideChildren || false;
    this.level = obj?.level || 0;
    this.isHide = obj?.isHide || false;
    this.groupsChild = obj?.groupsChild || [];
  }
}

export class GroupsFilter {
  PK_VehicleGroupID!: number | null;
  FK_CompanyID!: number | null;
  parentVehicleGroupId!: number | null;
  name!: string;
  status!: boolean;
  isDeleted!: boolean;

  constructor(obj?: Partial<GroupsFilter>) {
    this.PK_VehicleGroupID = obj?.PK_VehicleGroupID || null;
    this.FK_CompanyID = obj?.FK_CompanyID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || null;
    this.name = obj?.name || '';
    this.status = obj?.status || true;
    this.isDeleted = obj?.isDeleted || false;
  }
}
