import { HttpParams } from '@angular/common/http';
import { BaseService, RespondData } from './base.service';

/** interface IBaseDataService định nghĩa các hàm cơ bản để gọi API
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export interface IBaseDataService {
  getById(id: string): Promise<RespondData>;
  getAll(): Promise<RespondData>;
  getList(model: any): Promise<RespondData>;
  addOrEdit(model: any): Promise<RespondData>;
  delete(id: string): Promise<RespondData>;
}

/**  BaseDataService VIẾT các hàm cơ bản để gọi API
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export abstract class BaseDataService extends BaseService implements IBaseDataService {
  abstract getByIdUrl: string;
  abstract getAllUrl: string;
  abstract getListUrl: string;
  abstract addOrEditUrl: string;
  abstract deleteUrl: string;

  /** getById lấy dữ liệu về bới Id
   * @param id :string | number
   * @param noLoadingMark = false: có thể dung để set hiệu ứng ref của màn hình
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getById(id: string | number, noLoadingMark = false): Promise<RespondData> {
    const params = new HttpParams().append('id', id);
    return this.postParams(this.getByIdUrl, params, noLoadingMark);
  }

  /** getAll  lấy dữ liệu nobody,
     @todo phải viết lại để dùng phương thức GET
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getAll(): Promise<RespondData> {
    return this.post(this.getAllUrl);
  }

  /** getList lấy về 1 danh sách
   * @param filterModel:  any model để lọc dữ liệu
   * @param noLoadingMark = false: có thể dung để set hiệu ứng ref của màn hình
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getList(filterModel: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this.getListUrl, filterModel, noLoadingMark);
  }

  /** addOrEdit : thêm, cập nhật 1 item
   * @param model:  any model
   * @param noLoadingMark = false: có thể dung để set hiệu ứng ref của màn hình
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  addOrEdit(model: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this.addOrEditUrl, model, noLoadingMark);
  }

  /** delete : xóa 1 item
   * @param id: string | number:  any model
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */
  delete(id: string | number): Promise<RespondData> {
    const params = new HttpParams().append('id', id);
    return this.postParams(this.deleteUrl, params);
  }
}
