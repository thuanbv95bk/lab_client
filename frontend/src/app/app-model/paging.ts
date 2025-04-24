import { AppGlobals } from '../app-global';

export class PagingModel {
  PageIndex: number = 0;
  PageSize: number = AppGlobals.pageSizeOptions[0];
}

export declare class PageEvent {
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
