/** Thông tin của User
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export class User {
  pK_UserID: string;
  fK_CompanyID!: number;
  userName!: string;
  userNameLower!: string;
  fullName!: string;
  userType!: number;
  isLock!: boolean;
  isDeleted!: boolean;
  isActived!: boolean;
  constructor(obj?: Partial<User>) {
    this.pK_UserID = obj?.pK_UserID || '';
    this.fK_CompanyID = obj?.fK_CompanyID || null;
    this.userName = obj?.userName || '';
    this.userNameLower = obj?.userNameLower || '';
    this.fullName = obj?.fullName || '';
    this.isLock = obj?.isLock || false;
    this.isDeleted = obj?.isDeleted || false;
  }
}

/** Bộ lọc để lấy ra danh sách User
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class UsersFilter {
  pK_UserID!: string;
  fK_CompanyID!: number | null;
  userName!: string;
  userNameLower!: string;
  fullName!: string;
  isLock!: boolean;
  isDeleted!: boolean;
  isActived!: boolean;
  constructor(obj?: Partial<UsersFilter>) {
    this.pK_UserID = obj?.pK_UserID || '';
    this.fK_CompanyID = obj?.fK_CompanyID || null;
    this.userName = obj?.userName || '';
    this.userNameLower = obj?.userNameLower || '';
    this.fullName = obj?.fullName || '';
    this.isLock = obj?.isLock || false;
    this.isDeleted = obj?.isDeleted || false;
    this.isActived = obj?.isActived || null;
  }
}
