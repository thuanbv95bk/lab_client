import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-widget',
  templateUrl: './vehicle-widget.component.html',
  styleUrl: './vehicle-widget.component.scss',
})
export class VehicleWidgetComponent implements OnInit {
  @Input() backgroundColor: string = '';
  @Input() title: string = '';
  @Input() totalVehicles: number = 0;
  @Input() vehicles: number = 0;
  @Input() numberVehicle: number = 0;
  @Input() isDisplayFooter: boolean = false;

  percentage: string = '';

  ngOnInit(): void {
    this.percentage = this.getPercentage();
  }
  getPercentage() {
    if (this.totalVehicles == 0 || !this.totalVehicles) return '';
    if (this.isDisplayFooter == false) return '';

    return ((this.numberVehicle / this.totalVehicles) * 100).toFixed(2);
  }
}
