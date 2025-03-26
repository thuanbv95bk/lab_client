import { LocationEnum } from './location.enum';

export interface Vehicle {
  id: number;
  code: string;
  isLoaded: boolean;
  location: string | LocationEnum;
  company: string;

  // constructor(obj?: Partial<Vehicle>) {
  //   this.id = obj?.id || 0;
  //   this.code = obj?.code || '';
  //   this.isLoaded = obj?.isLoaded || false;
  //   this.location = obj?.location || '';
  //   this.company = obj?.company || '';
  // }
}
