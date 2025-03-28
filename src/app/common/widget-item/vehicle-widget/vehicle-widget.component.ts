import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-widget',
  templateUrl: './vehicle-widget.component.html',
  styleUrl: './vehicle-widget.component.scss',
})
export class VehicleWidgetComponent implements OnInit, OnChanges {
  @Input() backgroundColor: string = '';
  @Input() title: string = '';
  @Input() totalVehicles: number = 0;
  @Input() numberVehicle: number = 0;
  @Input() isDisplayFooter: boolean = false;
  @Input() isToggleView: boolean = false;

  percentage: string = '';

  ngOnInit(): void {
    this.percentage = this.getPercentage();
  }
  ngOnChanges(): void {
    this.animationEff();
  }
  getPercentage() {
    if (this.totalVehicles == 0 || !this.totalVehicles) return '';
    if (this.isDisplayFooter == false) return '';

    return ((this.numberVehicle / this.totalVehicles) * 100).toFixed(2);
  }

  /**
   * Animations eff
   * @description tạo hiệu ứng thay đỗi dự liệu
   */
  animationEff() {
    const tempValue = this.numberVehicle;
    const percentage = this.getPercentage();
    const zero = 0;
    this.percentage = '';
    this.numberVehicle = zero;

    setTimeout(() => {
      this.percentage = percentage;
      this.numberVehicle = tempValue;
    }, 20);
  }
}
