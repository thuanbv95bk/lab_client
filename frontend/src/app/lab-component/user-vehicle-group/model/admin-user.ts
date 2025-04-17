export class User {
  pK_UserID: string;
  FK_CompanyID!: number;
  userName!: string;
  userNameLower!: string;
  fullName!: string;
  userType!: number;
  isLock!: boolean;
  isDeleted!: boolean;
  isActivated!: boolean;
  constructor(obj?: Partial<User>) {
    this.pK_UserID = obj?.pK_UserID || '';
    this.FK_CompanyID = obj?.FK_CompanyID || null;
    this.userName = obj?.userName || '';
    this.userNameLower = obj?.userNameLower || '';
    this.fullName = obj?.fullName || '';
    this.isLock = obj?.isLock || false;
    this.isDeleted = obj?.isDeleted || false;
  }
}

export class UsersFilter {
  PK_UserID!: string;
  FK_CompanyID!: number | null;
  userName!: string;
  userNameLower!: string;
  fullName!: string;
  isLock!: boolean;
  isDeleted!: boolean;
  isActived!: boolean;
  constructor(obj?: Partial<UsersFilter>) {
    this.PK_UserID = obj?.PK_UserID || '';
    this.FK_CompanyID = obj?.FK_CompanyID || null;
    this.userName = obj?.userName || '';
    this.userNameLower = obj?.userNameLower || '';
    this.fullName = obj?.fullName || '';
    this.isLock = obj?.isLock || false;
    this.isDeleted = obj?.isDeleted || false;
  }
}
