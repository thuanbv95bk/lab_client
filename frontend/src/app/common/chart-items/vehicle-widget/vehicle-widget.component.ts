import { Component, Input, OnInit } from '@angular/core';
import { CardWidgetModel } from '../../model/enum/vehicle.model';
import { Widget } from '../../model/dashboard/dashboard.model';

@Component({
  selector: 'app-vehicle-widget',
  templateUrl: './vehicle-widget.component.html',
  styleUrl: './vehicle-widget.component.scss',
})
export class VehicleWidgetComponent implements OnInit {
  listCardWidgetModel: CardWidgetModel[] = [];
  totalVehicles: number = 0;
  emptyVehicles: number = 0;
  loadedVehicles: number = 0;

  @Input() widget!: Widget;

  ngOnInit(): void {
    this.initData();
    this.animationEff();
  }

  /**
   * Tính toán và thiết lập dư liệu để đẩy vào chart
   */
  initData() {
    this.totalVehicles = this.widget?.dataModel.length;

    this.emptyVehicles = this.widget?.dataModel.filter((x) => x.isLoaded == false).length;

    this.loadedVehicles = this.widget?.dataModel.filter((x) => x.isLoaded == true).length;

    this.listCardWidgetModel = [];

    const cardWidgetModel1 = new CardWidgetModel();
    cardWidgetModel1.backgroundColor = '#006ADC';
    cardWidgetModel1.title = 'Phương tiện của công ty';
    cardWidgetModel1.totalVehicles = this.totalVehicles;
    cardWidgetModel1.numberVehicle = this.totalVehicles;
    cardWidgetModel1.isDisplayFooter = false;
    cardWidgetModel1.isReloadView = true;

    this.listCardWidgetModel.push(cardWidgetModel1);
    const cardWidgetMode2 = new CardWidgetModel();
    cardWidgetMode2.backgroundColor = '#509447';
    cardWidgetMode2.title = 'Phương tiện có hàng';
    cardWidgetMode2.totalVehicles = this.totalVehicles;
    cardWidgetMode2.numberVehicle = this.loadedVehicles;
    cardWidgetMode2.isDisplayFooter = true;
    this.listCardWidgetModel.push(cardWidgetMode2);

    const cardWidgetModel3 = new CardWidgetModel();
    cardWidgetModel3.backgroundColor = '#E2803C';
    cardWidgetModel3.title = 'Phương tiện không hàng';
    cardWidgetModel3.totalVehicles = this.totalVehicles;
    cardWidgetModel3.numberVehicle = this.emptyVehicles;
    cardWidgetModel3.isDisplayFooter = true;
    this.listCardWidgetModel.push(cardWidgetModel3);
  }
  /**
   * Animations eff
   * @description tạo hiệu ứng thay đỗi dự liệu
   */
  animationEff() {
    const totalVehicles = this.listCardWidgetModel[0].totalVehicles;
    const numberLoad = this.listCardWidgetModel[1].numberVehicle;
    const numberEm = this.listCardWidgetModel[2].numberVehicle;
    this.listCardWidgetModel[0].numberVehicle = 0;
    this.listCardWidgetModel[1].numberVehicle = 0;
    this.listCardWidgetModel[2].numberVehicle = 0;

    setTimeout(() => {
      this.listCardWidgetModel[0].numberVehicle = totalVehicles;
      this.listCardWidgetModel[1].numberVehicle = numberLoad;
      this.listCardWidgetModel[2].numberVehicle = numberEm;
    }, 30);
  }
}
