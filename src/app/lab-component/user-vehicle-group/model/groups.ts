import { UserVehicleGroupView } from './user-vehicle-group';

/** thông tin của  Nhóm phương tiện
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class Groups {
  pK_VehicleGroupID!: number | null;
  fK_CompanyID!: number | null;
  parentVehicleGroupId!: number | 0;
  name!: string;
  status!: boolean;
  isDeleted!: boolean;
  hasChild!: boolean;
  isHideChildren!: boolean;
  isHide: boolean;
  level: number;
  allComplete!: boolean;
  groupsChild!: UserVehicleGroupView[];

  isSelected!: boolean | false;
  isUiCheck: boolean = false;

  constructor(obj?: Partial<Groups>) {
    this.pK_VehicleGroupID = obj?.pK_VehicleGroupID || null;
    this.fK_CompanyID = obj?.fK_CompanyID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || 0;
    this.name = obj?.name || '';
    this.status = obj?.status || true;
    this.isDeleted = obj?.isDeleted || false;
    this.hasChild = obj?.hasChild || false;
    this.isHideChildren = obj?.isHideChildren || false;
    this.level = obj?.level || 0;
    this.isHide = obj?.isHide || false;
    this.groupsChild = obj?.groupsChild || [];
    this.allComplete == obj?.allComplete || false;
  }
}

/** bộ lọc để lấy ra các Nhóm phương tiện
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class GroupsFilter {
  pK_VehicleGroupID!: number | null;
  fK_CompanyID!: number | null;
  parentVehicleGroupId!: number | null;
  name!: string;
  status!: boolean;
  isDeleted!: boolean;
  pK_UserID: string;

  constructor(obj?: Partial<GroupsFilter>) {
    this.pK_VehicleGroupID = obj?.pK_VehicleGroupID || null;
    this.fK_CompanyID = obj?.fK_CompanyID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || null;
    this.name = obj?.name || '';
    this.status = obj?.status || null;
    this.isDeleted = obj?.isDeleted || null;
    this.pK_UserID = obj?.pK_UserID || '';
  }
}

/**
 * Group service
 * Xây dựng cây -cha-con từ 1 danh sách
 * ép cây-cha con về 1 list phẳng
 */
export class GroupService {
  // Tạo cây cha-con từ danh sách phẳng
}
