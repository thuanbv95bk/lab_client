import { UserVehicleGroupView } from './user-vehicle-group';

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

export class GroupService {
  // 1. Tạo cây cha-con từ danh sách phẳng
  buildHierarchy(listItem: UserVehicleGroupView[]): UserVehicleGroupView[] {
    const map = new Map<number, UserVehicleGroupView>();
    const roots: UserVehicleGroupView[] = [];

    // Bước 1: Gán mặc định và lưu vào map
    listItem.forEach((item) => {
      item.groupsChild = [];
      item.hasChild = false;
      item.isHide = false;
      item.level = 1;
      map.set(item.pK_VehicleGroupID!, item);
    });

    // Bước 2: Duyệt gán vào cây
    listItem.forEach((item) => {
      if (item.parentVehicleGroupId && map.has(item.parentVehicleGroupId)) {
        const parent = map.get(item.parentVehicleGroupId)!;
        item.level = parent.level + 1;
        parent.groupsChild.push(item);
        parent.hasChild = true;
      } else {
        roots.push(item); // Gốc (parentId == 0 hoặc null)
      }
    });

    return roots;
  }

  // 2. Hàm đệ quy để tìm các nhóm con theo parentId
  private getChildGroups(listItem: UserVehicleGroupView[], parentId: number | null, level: number): UserVehicleGroupView[] {
    const children = listItem.filter((x) => x.parentVehicleGroupId === parentId);

    for (const child of children) {
      child.level = level;
      child.groupsChild = this.getChildGroups(listItem, child.pK_VehicleGroupID, level + 1);
      child.hasChild = child.groupsChild.length > 0;
      child.isHide = false;
    }

    return children;
  }

  // 3. Gom 1 nhóm và toàn bộ con cháu vào 1 mảng phẳng
  flattenGroupTree(tree: UserVehicleGroupView[], pK_UserID: string = null): UserVehicleGroupView[] {
    const result: UserVehicleGroupView[] = [];

    const flatten = (group: UserVehicleGroupView) => {
      result.push(group); // Thêm phần tử cha vào kết quả

      // Đệ quy qua tất cả các nhóm con
      group.groupsChild?.forEach((child) => {
        child.PK_UserID = pK_UserID ?? pK_UserID;
        flatten(child);
      });
    };

    tree.forEach((g) => {
      g.PK_UserID = pK_UserID ?? pK_UserID;
      flatten(g);
    }); // Bắt đầu với từng nhóm gốc trong cây

    return result;
  }
}
