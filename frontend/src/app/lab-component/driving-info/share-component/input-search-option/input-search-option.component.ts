import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-search-option',
  templateUrl: './input-search-option.component.html',
  styleUrls: ['./input-search-option.component.scss'],
})
export class InputSearchOptionComponent {
  //   /** placeholder hiển thị */
  //   @Input() placeholder: string;

  //   /** searchField tìm kiếm trong nhóm cột */
  //   searchField: string;

  //   @Output() searchFieldChange = new EventEmitter<string>();

  //   /** emit sự kiên ra ngoài khi ng dùng gõ input
  //    * @Author thuan.bv
  //    * @Created 23/04/2025
  //    * @Modified date - user - description
  //    */

  //   changeInput() {
  //     this.searchFieldChange.emit(this.searchField);
  //   }
  // }

  searchTerm: string = '';
  selectedDriver: any = null;

  // Sample data - replace with your actual data source
  drivers = [
    { code: 'Tên lái xe' },
    { code: 'GPLX' },
    // Add more drivers as needed
  ];

  filteredDrivers = [...this.drivers];

  constructor() {}

  ngOnInit(): void {}

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredDrivers = [...this.drivers];
      return;
    }

    this.filteredDrivers = this.drivers.filter((driver) =>
      driver.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectDriver(driver: any): void {
    this.selectedDriver = driver;
    this.searchTerm = driver.code;
    // You can emit an event or call a service here if needed
  }
}
