import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormDirtyService {
  private dirtySubject = new BehaviorSubject<boolean>(false);

  setDirty(isDirty: boolean) {
    this.dirtySubject.next(isDirty);
  }

  isDirty$() {
    return this.dirtySubject.asObservable();
  }

  getCurrentDirty() {
    return this.dirtySubject.value;
  }
}
