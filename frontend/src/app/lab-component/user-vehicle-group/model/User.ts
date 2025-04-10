export class User {
  PK_UserID!: string;
  FK_CompanyID!: number;
  username!: string;
  userNameLower!: string;
  password!: string;
  fullName!: string;
  userType!: number;
  isLock!: boolean;
  updatedByUser?: string;
  updatedDate?: Date;
  isDeleted!: boolean;
  phoneNumber?: string;
  email?: string;
  usernameBAP?: string;
  loginType?: string;
  isActivated!: boolean;
  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, {
        ...data,
      });
    }
  }
}

export class UsersFilter {
  PK_UserID!: string;
  FK_CompanyID!: number;
  userName!: string;
  userNameLower!: string;
  fullName!: string;
  isLock!: boolean;
  // constructor(obj?: Partial<UsersFilter>) {
  //   this.PK_UserID = obj?.PK_UserID || '';
  //   this.FK_CompanyID = obj?.FK_CompanyID || null;
  //   this.userName = obj?.userName || '';
  //   this.userNameLower = obj?.userNameLower || '';
  //   this.fullName = obj?.fullName || '';
  //   this.isLock = obj?.isLock || true;
  // }
}

function generateMockUsers(count: number = 60): User[] {
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const user: User = new User({
      PK_UserID: `USR${i.toString().padStart(4, '0')}`,
      FK_CompanyID: Math.floor(Math.random() * 5) + 1,
      username: `user${i}`,
      userNameLower: `user${i}`.toLowerCase(),
      fullName: `User Name ${i}`,
      userType: i % 3,
      isLock: i % 10 === 0, // mỗi 10 user thì khóa 1
      updatedByUser: `admin`,
      updatedDate: new Date(),
      isDeleted: false,
      phoneNumber: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `user${i}@example.com`,
    });

    users.push(user);
  }

  return users;
}
