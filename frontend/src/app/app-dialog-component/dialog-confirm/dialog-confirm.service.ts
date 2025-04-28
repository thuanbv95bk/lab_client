import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { DialogConfirmComponent } from './dialog-confirm.component';

@Injectable({ providedIn: 'root' })
export class DialogConfirmService {
  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  confirm(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const factory = this.componentFactoryResolver.resolveComponentFactory(DialogConfirmComponent);
      const componentRef = factory.create(this.injector);
      componentRef.instance.message = message;
      componentRef.instance.confirm.subscribe((result: boolean) => {
        this.appRef.detachView(componentRef.hostView);
        document.body.removeChild(componentRef.location.nativeElement);
        resolve(result);
      });

      this.appRef.attachView(componentRef.hostView);
      document.body.appendChild(componentRef.location.nativeElement);
    });
  }
}
