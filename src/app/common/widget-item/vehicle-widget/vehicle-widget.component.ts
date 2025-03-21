import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-widget',
  templateUrl: './vehicle-widget.component.html',
  styleUrl: './vehicle-widget.component.scss',
})
export class VehicleWidgetComponent {
  @Input() backgroundColor: string = '#509447'; // Màu nền mặc định (xanh lá)
  @Input() title: string = 'Phương tiện có hàng';
  @Input() totalVehicles: number = 0;
  @Input() percentage: number = 0;
  @Input() isDisplayFooter: boolean = false;
}
