import { HttpParams } from '@angular/common/http';
import { BaseService, RespondData } from './base.service';

export interface IBaseDataService {
  getById(id: string): Promise<RespondData>;
  getAll(): Promise<RespondData>;
  getList(model: any): Promise<RespondData>;
  addOrEdit(model: any): Promise<RespondData>;
  delete(id: string): Promise<RespondData>;
}

export abstract class BaseDataService extends BaseService implements IBaseDataService {
  abstract _getByIdUrl: string;
  abstract _getAllUrl: string;
  abstract _getListUrl: string;
  abstract _addOrEditUrl: string;
  abstract _deleteUrl: string;

  getById(id: string | number, noLoadingMark = false): Promise<RespondData> {
    const params = new HttpParams().append('id', id);
    return this.postParams(this._getByIdUrl, params, noLoadingMark);
  }

  getAll(): Promise<RespondData> {
    return this.post(this._getAllUrl);
  }

  getList(filterModel: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this._getListUrl, filterModel, noLoadingMark);
  }
  addOrEdit(model: any, noLoadingMark = false): Promise<RespondData> {
    return this.postData(this._addOrEditUrl, model, noLoadingMark);
  }

  delete(id: string | number): Promise<RespondData> {
    const params = new HttpParams().append('id', id);
    return this.postParams(this._deleteUrl, params);
  }
}
