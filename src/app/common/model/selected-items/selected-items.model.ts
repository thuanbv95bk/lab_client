/**
 * Languages loading danh sách các ngôn ngữ
 * @author thuan.bv
 */
export class languages {
  code: string;
  name: string;
  flag: string;
  constructor(obj?: Partial<languages>) {
    this.code = obj?.code || '';
    this.name = obj?.name || '';
    this.flag = obj?.flag || '';
  }
}
