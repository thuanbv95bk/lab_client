import { Component, ComponentRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Widget } from '../../model/dashboard.model';

@Component({
  selector: 'app-dynamic-load-widget',
  template: `<ng-container #container></ng-container>`,
})

/** Dynamic dùng chung để đưa các widget vào
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class DynamicLoadWidgetComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;

  /** tạo 1 input dynamicLoadWidgetComponent, có thể truyền vào động  widget
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  @Input() set dynamicLoadWidgetComponent(data: { component: any; inputs?: Widget }) {
    if (data?.component) {
      // Xóa component cũ nếu có
      this.container.clear();
      this.componentRef = this.container.createComponent(data.component);

      // Truyền dữ liệu vào component con
      if (data.inputs) {
        Object.assign(this.componentRef.instance, data.inputs);
      }
    }
  }
}
