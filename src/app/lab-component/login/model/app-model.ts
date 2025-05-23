/** Menu phục vụ cho danh sách menu ở màn hình login
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class Menu {
  href: string;
  code: string;
  constructor(obj?: Partial<Menu>) {
    this.href = obj?.href || '';
    this.code = obj?.code || '';
  }
}

/** News loading danh sách tin tức ở màn hình login
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class News {
  index: number | null;
  imageUrl: string;
  title: string;
  shortContent: string;
  link: string;
  constructor(obj?: Partial<News>) {
    this.index = obj?.index || null;
    this.imageUrl = obj?.imageUrl || '';
    this.title = obj?.title || '';
    this.shortContent = obj?.shortContent || '';
    this.link = obj?.link || '';
  }
}

/** Branch loading danh sách các chi nhánh ở màn hình login
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class Branch {
  index: number | null;
  name: string;
  address: SubAddress[];
  constructor(obj?: Partial<Branch>) {
    this.index = obj?.index || null;
    this.name = obj?.name || '';
    this.address = obj?.address || [];
  }
}

/**  Sub address định chỉ con của từng chi nhanh
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class SubAddress {
  index: number | null;
  add: string;
  constructor(obj?: Partial<SubAddress>) {
    this.index = obj?.index || null;
    this.add = obj?.add || '';
  }
}

/** Languages loading danh sách các ngôn ngữ
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class Languages {
  code: string;
  name: string;
  flag: string;
  constructor(obj?: Partial<Languages>) {
    this.code = obj?.code || '';
    this.name = obj?.name || '';
    this.flag = obj?.flag || '';
  }
}

/** Thông tin của 1 User
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class UserInfo {
  userName: string | null;
  passWord: string | null;
  isRememberMe: boolean;

  constructor(obj?: Partial<UserInfo>) {
    this.userName = obj?.userName || '';
    this.passWord = obj?.passWord || '';
    this.isRememberMe = obj?.isRememberMe || false;
  }
}
