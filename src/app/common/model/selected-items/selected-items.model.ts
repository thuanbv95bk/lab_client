/**
 * Languages loading danh sách các ngôn ngữ
 * @author thuan.bv
 */
export class vehicle {
  id: number;
  code: string;

  constructor(obj?: Partial<vehicle>) {
    this.id = obj?.id || 0;
    this.code = obj?.code || '';
  }
}
