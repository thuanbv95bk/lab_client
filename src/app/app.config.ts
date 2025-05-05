import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface ApiEndpoint {
  apiEndpoint: string;
}

@Injectable()
export class AppConfig {
  static apiEndpoint: string;
  private httpClient: HttpClient;
  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  async load() {
    console.log('*** Setting app ***');

    const endpointFile = `assets/config/endpoint.${environment.name}.json?v=${Math.random()}`;

    try {
      const res = await this.httpClient.get(endpointFile).toPromise();
      AppConfig.apiEndpoint = (<ApiEndpoint>res).apiEndpoint;
      console.log(`apiEndpoint: ${AppConfig.apiEndpoint}`);
    } catch (error) {
      console.error(error);
    }

    console.log('*** end Setting app ***');
  }
}

export function InitApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
