import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchOption } from '../../model/hrm-employees.model';

interface DropdownItem {
  code: string;
  name: string;
}
@Component({
  selector: 'app-input-search-option',
  templateUrl: './input-search-option.component.html',
  styleUrls: ['./input-search-option.component.scss'],
})
export class InputSearchOptionComponent {
  /** placeholder hiển thị */
  @Input() placeholder: string = 'Tìm kiếm';
  @Input() searchOption: SearchOption;
  // @Output() searchOptionEvent = new EventEmitter<SearchOption>();
  // searchOption = new SearchOption();

  selectedOption: DropdownItem;

  listOption: DropdownItem[] = [
    {
      code: 'displayName',
      name: 'Tên lái xe',
    },
    {
      code: 'driverLicense',
      name: 'GPLX',
    },
  ];

  // filteredDrivers = [...this.drivers];

  // constructor() {
  //   this.selectedOption = this.listOption.find((x) => x.code == 'displayName');
  // }

  ngOnInit(): void {
    this.selectedOption = this.listOption.find((x) => x.code == 'displayName');
    this.searchOption.key = this.selectedOption?.code;
  }

  onSearch(): void {
    // if (!this.searchTerm) {
    //   this.listOption = [...this.listOption];
    //   return;
    // }
    // this.listOption = this.listOption.filter((driver) =>
    //   driver.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    // );
  }

  selectDriver(driver: DropdownItem): void {
    this.selectedOption = driver;
    this.searchOption.key = this.selectedOption?.code;
  }
  changeKeySearch() {
    // this.searchOptionEvent.emit(this.searchOption);
  }
}
