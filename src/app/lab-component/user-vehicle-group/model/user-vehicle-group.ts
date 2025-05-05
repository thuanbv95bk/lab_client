import { Groups } from './groups';

/** Danh sách nhóm theo user
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export class UserVehicleGroup {
  pK_UserID!: string | null;
  pK_VehicleGroupID!: number | null;
  parentVehicleGroupId!: number | 0;
  isDeleted!: boolean;
  createdByUser!: string | null;
  createdDate!: Date | null;
  constructor(obj?: Partial<UserVehicleGroup>) {
    this.pK_UserID = obj?.pK_UserID || null;
    this.pK_VehicleGroupID = obj?.pK_VehicleGroupID || null;
    this.parentVehicleGroupId = obj?.parentVehicleGroupId || 0;
    this.isDeleted = obj?.isDeleted || false;
    this.createdByUser = obj?.createdByUser || '';
    this.createdDate = obj?.createdDate || new Date();
  }
}

/** Nhóm phương tiện của người dùng- để view ở UI
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class UserVehicleGroupView extends Groups {
  pK_UserID!: string | null;
  declare isDeleted: boolean;
  groupType: string;
  isNewItem: boolean = false;
  constructor(obj?: Partial<UserVehicleGroupView>) {
    super();
    this.pK_UserID = obj?.pK_UserID || null;
    this.isDeleted = obj?.isDeleted || false;
  }
}

/** Nhóm phương tiện để thêm mới 1 danh sách nhóm theo pK_UserID
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class VehicleGroupModel {
  /** mô tả */
  pK_UserID!: string | null;
  listGroup: UserVehicleGroupView[];
  constructor(obj?: Partial<VehicleGroupModel>) {
    this.pK_UserID = obj?.pK_UserID || null;
    this.listGroup = obj?.listGroup || [];
  }
}

/**
 * User vehicle group filter
 * bộ lọc Nhóm phương tiện của người dùng
 */
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
