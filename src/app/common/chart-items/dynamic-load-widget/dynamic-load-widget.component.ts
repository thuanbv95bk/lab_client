import {
  Component,
  ComponentRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-dynamic-load-widget',
  template: `<ng-container #container></ng-container>`,
})
export class DynamicLoadWidgetComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;

  @Input() set dynamicLoadWidgetComponent(data: {
    component: any;
    inputs?: any;
  }) {
    if (data?.component) {
      this.container.clear(); // Xóa component cũ nếu có
      this.componentRef = this.container.createComponent(data.component);

      // Truyền dữ liệu vào component con
      if (data.inputs) {
        Object.assign(this.componentRef.instance, data.inputs);
      }
    }
  }
}
