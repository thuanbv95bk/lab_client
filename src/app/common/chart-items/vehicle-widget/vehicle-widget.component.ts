import { Component, Input } from '@angular/core';
import { CardWidgetModel } from '../../model/vehicle/vehicle.model';

@Component({
  selector: 'app-vehicle-widget',
  templateUrl: './vehicle-widget.component.html',
  styleUrl: './vehicle-widget.component.scss',
})
export class VehicleWidgetComponent {
  @Input() dataModel: CardWidgetModel[] = [];
  @Input() setClass: string = 'col-12 col-sm-4'; //mặc định;

  /**
   * Animations eff
   * @description tạo hiệu ứng thay đỗi dự liệu
   */
  animationEff() {
    const totalVehicles = this.dataModel[0].numberVehicle;
    const numberLoad = this.dataModel[1].numberVehicle;
    const numberEm = this.dataModel[2].numberVehicle;
    this.dataModel[0].numberVehicle = 0;
    this.dataModel[1].numberVehicle = 0;
    this.dataModel[2].numberVehicle = 0;

    setTimeout(() => {
      this.dataModel[0].numberVehicle = totalVehicles;
      this.dataModel[1].numberVehicle = numberLoad;
      this.dataModel[2].numberVehicle = numberEm;
    }, 30);
  }
}
