import { Injectable } from '@angular/core';
import { BaseDataService } from '../../../service/API-service/base-data.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Urls } from './hrm-employees.urls';
import { RespondData } from '../../../service/API-service/base.service';
import { HrmEmployees, HrmEmployeesFilter, HrmEmployeesFilterExcel } from '../model/hrm-employees.model';
import { catchError, throwError } from 'rxjs';

/** Service dùng để gọi API tới backend, lấy dữ liệu
 * @Author thuan.bv
 * @Created 25/04/2025
 * @Modified date - user - description
 * @Modified 28/04/2025 - thuan.bv - Thêm API addOrEditList, deleteSoft
 */

@Injectable({
  providedIn: 'root',
})
export class HrmEmployeesService extends BaseDataService {
  getByIdUrl = AppConfig.apiEndpoint + Urls.getById;
  getAllUrl = AppConfig.apiEndpoint + Urls.getAll;
  getListUrl = AppConfig.apiEndpoint + Urls.getList;
  addOrEditUrl = AppConfig.apiEndpoint + Urls.addOrEdit;
  deleteUrl = AppConfig.apiEndpoint + Urls.delete;

  getListCbxUrl = AppConfig.apiEndpoint + Urls.getListCbx;
  getPagingToEditUrl = AppConfig.apiEndpoint + Urls.getPagingToEdit;
  deleteSoftUrl = AppConfig.apiEndpoint + Urls.deleteSoft;
  addOrEditListUrl = AppConfig.apiEndpoint + Urls.addOrEditList;
  exportExcelUrl = AppConfig.apiEndpoint + Urls.exportExcel;
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  /** lấy danh sách lái xe để cho vào combobox dùng để filter lái xe
   * @param FkCompanyID Id công ty
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */

  getListCbx(fkCompanyID: number): Promise<RespondData> {
    const params = new HttpParams().append('fkCompanyID', fkCompanyID);
    return this.postParams(this.getListCbxUrl, params, false);
  }

  /** lấy danh sách lái xe dạng paging phân trạng
   * @param filterModel điều kiện tìm kiếm
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  getPagingToEdit(filterModel: HrmEmployeesFilter, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this.getPagingToEditUrl, filterModel, noLoadingMark);
  }

  /** gọi API xóa mềm 1 thông tin lái xe
   * @param employeeId id của lái xe
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  deleteSoft(employeeId: number, noLoadingMark = false): Promise<RespondData> {
    const params = new HttpParams().append('employeeId', employeeId);
    return this.postParams(this.deleteSoftUrl, params, noLoadingMark);
  }

  /** gọi API cập nhật 1 danh sách lái xe
   * @param models Danh sách lái xe muốn cập nhật
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  addOrEditList(models: HrmEmployees[], noLoadingMark = false): Promise<RespondData> {
    return this.postData(this.addOrEditListUrl, models, noLoadingMark);
  }

  /** gọi API export Excel
   * @param filterModel filter của người dùng
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */
  exportExcel(filterModel: HrmEmployeesFilterExcel, noLoadingMark = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: any = {
        responseType: 'arraybuffer',
        observe: 'response' as const,
        headers: new HttpHeaders(),
      };
      if (noLoadingMark) {
        options.headers = options.headers.set('no-loading-mark', '1');
      }

      this.httpClient
        .post<ArrayBuffer>(this.exportExcelUrl, filterModel, options)
        .pipe(
          catchError((error) => {
            reject(this.handleError(error));
            return throwError(() => error);
          })
        )
        .subscribe((response: HttpResponse<ArrayBuffer>) => {
          if (!response.body || response.body.byteLength === 0) {
            reject(new Error('Empty response from server'));
            return;
          }
          const blob = new Blob([response.body], {
            type: response.headers.get('Content-Type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const filename = this.getFilenameFromHeaders(response.headers) || 'Danh sách lái xe.xlsx';
          this.triggerDownload(blob, filename);
          resolve();
        });
    });
  }

  /** Hàm hỗ trợ lấy tên file từ headers
   * @param headersHttpHeaders
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */

  private getFilenameFromHeaders(headers: HttpHeaders): string | null {
    const contentDisposition = headers.get('Content-Disposition');
    return contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || null;
  }

  /**  Hàm trigger download
   * @param headersHttpHeaders
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */
  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Xử lý lỗi tập trung
  private handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client-side error: ${error.error.message}`;
    } else {
      return `Server-side error: ${error.status} - ${error.message}`;
    }
  }

  /** tạo string-key danh sách theo id của 1 list
   * @param items Danh sách muốn tạo
   * @param key tên cột muốn tạo
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  public getSortedIdString(items: any[], key: string): string {
    return [...items]
      .map((g) => String(g[key]))
      .sort((a, b) => a.localeCompare(b))
      .join(',');
  }
}
