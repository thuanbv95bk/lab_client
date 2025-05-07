import { AppGlobals } from '../app-global';

/** Bộ lọc phân trang
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */
export class PagingModel {
  /** trang hiện tại: giá trị mặc định = 0 */
  pageIndex: number = 0;
  /** số phần tử 1 trang, mặc định = 20 , định nghĩ trong AppGlobals.pageSizeOptions */
  pageSize: number = AppGlobals.pageSizeOptions[1];
  length: number = 0;
}

/** PageEvent : dùng để lưu các thông tin của page hiện tại
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */
export class PageEvent {
  /** The current page index. */
  pageIndex: number;
  /**
   * Index of the page that was selected previously.
   * @breaking-change 8.0.0 To be made into a required property.
   */
  previousPageIndex?: number;
  /** The current page size */
  pageSize: number;
  /** The current total number of items being paged */
  length: number;
}

/** dùng để lưu dữ liệu Paging khi gọi về từ API chức năng phân trang
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 */
export interface PagingResult {
  /** Tổng số item */
  totalCount: number;
  /** Data để chứa dữ liệu */
  data: any[];
}
