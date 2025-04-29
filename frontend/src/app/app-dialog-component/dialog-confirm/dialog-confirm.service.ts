import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { DialogConfirmComponent } from './dialog-confirm.component';

/** Injectable Mở 1 dialog , có xác nhận
 * @Author thuan.bv
 * @Created 28/04/2025
 * @Modified date - user - description
 */

@Injectable({ providedIn: 'root' })
export class DialogConfirmService {
  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  /** confirm dung để mở ra 1 dialog, dạng popup, có hỏi xác nhận?
   * @param message Nội dung muốn hiển thị
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

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
