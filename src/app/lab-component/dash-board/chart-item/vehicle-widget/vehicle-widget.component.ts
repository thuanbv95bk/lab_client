import { Component, Input, OnInit } from '@angular/core';
import { CardWidgetModel } from '../../model/vehicle.model';
import { Widget } from '../../model/dashboard.model';

@Component({
  selector: 'app-vehicle-widget',
  templateUrl: './vehicle-widget.component.html',
  styleUrl: './vehicle-widget.component.scss',
})

/** widget số phường tiện
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class VehicleWidgetComponent implements OnInit {
  /** danh sách item */
  listCardWidgetModel: CardWidgetModel[] = [];
  /** tổng số phương tiện */
  totalVehicles: number = 0;
  /** tổng phương tiện không hàng */
  emptyVehicles: number = 0;
  /** tổng phương tiện có hàng */
  loadedVehicles: number = 0;
  /** chứa thuộc tính của 1 widget */
  @Input() widget!: Widget;

  ngOnInit(): void {
    this.initData();
    this.animationEff();
  }

  /** Tính toán và thiết lập dư liệu để đẩy vào chart
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

  /** tạo hiệu ứng thay đỗi dự liệu
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  animationEff() {
    const totalVehicles = this.listCardWidgetModel[0].totalVehicles;
    const numberLoad = this.listCardWidgetModel[1].numberVehicle;
    const numberEm = this.listCardWidgetModel[2].numberVehicle;
    this.listCardWidgetModel[0].numberVehicle = 0;
    this.listCardWidgetModel[1].numberVehicle = 0;
    this.listCardWidgetModel[2].numberVehicle = 0;
    // setTimeout để nhìn thấy sự thay đổi

    setTimeout(() => {
      this.listCardWidgetModel[0].numberVehicle = totalVehicles;
      this.listCardWidgetModel[1].numberVehicle = numberLoad;
      this.listCardWidgetModel[2].numberVehicle = numberEm;
    }, 30);
  }
}
