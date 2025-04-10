export class User {
  PK_UserID!: string;
  FK_CompanyID!: number;
  username!: string;
  userNameLower!: string;
  password!: string;
  fullName!: string;
  userType!: number;
  isLock!: boolean;
  lastPasswordChanged!: Date;
  changePasswordAfterDays!: number;
  createdByUser!: string;
  createdDate!: Date;
  updatedByUser?: string;
  updatedDate?: Date;
  lastLoginDate?: Date;
  lockLevel?: number;
  isDeleted!: boolean;
  phoneNumber?: string;
  createdIP?: string;
  updatedIP?: string;
  email?: string;
  allowedAccessIP?: string;
  useSecurityCodeSMS?: boolean;
  usernameBAP?: string;
  loginType?: string;
  superiorSaleID?: string;
  extendChangePasswordDays?: number;
  isActivated!: boolean;
  requiredChangePasswordDays?: number;
  weakPassword!: boolean;
  keepWeakPasswordDate?: Date;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, {
        ...data,
      });
    }
  }
}

export class UsersFilter {
  PK_UserID: string | null = null;
  FK_CompanyID: number | null = null;
  userName: string | null = null;
  userNameLower: string | null = null;
  fullName: string | null = null;
  isLock: boolean | null = null;
  constructor(obj?: Partial<UsersFilter>) {
    this.PK_UserID = obj?.PK_UserID || '';
    this.FK_CompanyID = obj?.FK_CompanyID || null;
    this.userName = obj?.userName || '';
    this.userNameLower = obj?.userNameLower || '';
    this.fullName = obj?.fullName || '';
    this.isLock = obj?.isLock || true;
  }
}
