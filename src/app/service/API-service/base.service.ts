import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

/** interface RespondData chưa thông tin API trả về
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export interface RespondData {
  isSuccess: boolean;
  errorMessage: string;
  data: any;
  statusCode: number;
}

/** interface định nghĩa các phương thức cơ bản của Res API
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export interface IBaseService {
  post(url: string): Promise<any>;
  postData(url: string, data: any): Promise<any>;
  postParams(url: string, params: HttpParams): Promise<any>;
  get(url: string): Promise<any>;
}

/** BaseService các phương thức của API
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export class BaseService implements IBaseService {
  constructor(protected httpClient: HttpClient) {}

  get(url: string, noLoadingMark = false): Promise<RespondData> {
    if (noLoadingMark) {
      return firstValueFrom(
        this.httpClient.get<RespondData>(url, {
          headers: new HttpHeaders({ 'no-loading-mark': '1' }),
        })
      );
    }
    return firstValueFrom(this.httpClient.get<RespondData>(url));
  }

  _getParams(url: string, params: HttpParams, noLoadingMark = false): Observable<RespondData> {
    if (noLoadingMark) {
      return this.httpClient.get<RespondData>(url, {
        headers: new HttpHeaders({ 'no-loading-mark': '1' }),
        params: params,
      });
    }
    return this.httpClient.get<RespondData>(url, { params: params });
  }

  getParams(url: string, params: HttpParams, noLoadingMark = false): Promise<RespondData> {
    if (noLoadingMark) {
      return firstValueFrom(
        this.httpClient.get<RespondData>(url, {
          headers: new HttpHeaders({ 'no-loading-mark': '1' }),
          params: params,
        })
      );
    }

    return firstValueFrom(this.httpClient.get<RespondData>(url, { params: params }));
  }

  post(url: string, noLoadingMark = false): Promise<RespondData> {
    if (noLoadingMark) {
      return firstValueFrom(
        this.httpClient.post<RespondData>(url, null, {
          headers: new HttpHeaders({ 'no-loading-mark': '1' }),
        })
      );
    }

    return firstValueFrom(this.httpClient.post<RespondData>(url, null));
  }
  async postData(url: string, data: any, noLoadingMark = false): Promise<RespondData> {
    if (noLoadingMark) {
      return this.__postData(url, data, noLoadingMark);
    }
    return this.__postData(url, data);
  }

  _postData(url: string, data: any): Observable<RespondData> {
    return this.___postData(url, data);
  }

  private __postData(url: string, data: any, noLoadingMark = false): Promise<RespondData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      ...(noLoadingMark ? { 'no-loading-mark': '1' } : {}),
    });

    return firstValueFrom(this.httpClient.post<RespondData>(url, data, { headers }));
  }

  private ___postData(url: string, data: any): Observable<RespondData> {
    return this.httpClient.post<RespondData>(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
    });
  }

  postParams(url: string, params: HttpParams, noLoadingMark = false): Promise<RespondData> {
    const headers = noLoadingMark ? new HttpHeaders({ 'no-loading-mark': '1' }) : undefined;

    return firstValueFrom(
      this.httpClient.post<RespondData>(url, null, {
        params,
        headers,
      })
    );
  }

  getHttp(url: string, noLoadingMark = false) {
    if (noLoadingMark) {
      return this.httpClient.get(url, {
        headers: new HttpHeaders({ 'no-loading-mark': '1' }),
      });
    }
    return this.httpClient.get(url);
  }
}
