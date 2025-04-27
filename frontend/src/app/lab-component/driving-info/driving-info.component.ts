import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HrmEmployeesService } from './service/hrm-employees.service';
import { HrmEmployees, HrmEmployeesCbx, HrmEmployeesFilter, SearchOption } from './model/hrm-employees.model';
import { BcaLicenseTypes } from './model/bca-license-types';
import { BcaLicenseTypesService } from './service/bca-license-types.service';
import { PageEvent, PagingModel, PagingResult } from '../../app-model/paging';
import { PaginationComponent } from './share-component/pagination/pagination.component';
import { FormDirtyService } from './service/form-dirty.service';

@Component({
  selector: 'app-driving-info',
  templateUrl: './driving-info.component.html',
  styleUrls: ['./driving-info.component.scss'],
})
export class DrivingInfoComponent implements OnInit, AfterViewInit {
  /** Địa chỉ công ty mặc định */
  FkCompanyID: number = 15076;

  lstDriver: HrmEmployeesCbx[] = [];
  listLicenseTypes: BcaLicenseTypes[] = [];
  listEmployeesGrid: HrmEmployees[] = [];
  filterEmployeesGrid: HrmEmployeesFilter = new HrmEmployeesFilter();
  pagingModel: PagingModel;
  // searchOption = new SearchOption();
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 150; // This should come from your API response
  isLoading: false;
  @ViewChild(PaginationComponent) paginator: PaginationComponent;
  changedRows: Set<number> = new Set();

  selectOpen = false;
  dateNow = new Date();
  new: Date;
  constructor(
    // private fb: FormBuilder,
    private employeesService: HrmEmployeesService,
    private licenseTypesService: BcaLicenseTypesService,
    private formDirtyService: FormDirtyService
  ) {
    this.pagingModel = new PagingModel();
  }

  ngOnInit() {
    /** Lấy về danh sách lái xe to CBX */
    this.getListEmployeesToCbx();
    this.getListLicenseTypes();
    this.getPagingToEdit();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pagingModel.pageSize = this.filterEmployeesGrid.pageSize;
    }, 100);
  }

  getListEmployeesToCbx() {
    this.employeesService.getListCbx(this.FkCompanyID).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.lstDriver = res.data || [];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getListLicenseTypes() {
    this.licenseTypesService.getListActive().then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          return;
        }
        this.listLicenseTypes = res.data || [];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPagingToEdit() {
    this.filterEmployeesGrid.fkCompanyId = this.FkCompanyID;
    this.employeesService.getPagingToEdit(this.filterEmployeesGrid).then(
      (res) => {
        if (!res.isSuccess) {
          console.error(res.errorMessage);
          return;
        }
        const pagingResult: PagingResult = res.data;
        this.listEmployeesGrid = pagingResult.data || [];
        this.pagingModel.length = pagingResult.totalCount;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  searchPagingToEdit() {
    this.filterEmployeesGrid.pageIndex = 1;
    // this.pagingModel.length = 0;
    // this.pagingModel.pageIndex = 1;
    this.getPagingToEdit();
  }

  pageIndexChange(event: PageEvent) {
    this.filterEmployeesGrid.pageIndex = event.pageIndex;
    this.filterEmployeesGrid.pageSize = event.pageSize;
    this.getPagingToEdit();
  }
  reloadPagingToEdit() {
    this.getPagingToEdit();
  }
  onSelectedChangeDriver(event) {
    this.filterEmployeesGrid.listStringEmployeesId = this.employeesService.getSortedIdString(event, 'pkEmployeeId');
  }
  onSelectedChangeLicenseTypes(event) {
    this.filterEmployeesGrid.listStringLicenseTypesId = this.employeesService.getSortedIdString(event, 'pkLicenseTypeId');
  }
  searchOptionChange(event) {
    console.log(event);
  }

  // onValueChange(value: string | Date, rowId: HrmEmployees) {
  //   // this.changedRows.add(rowId);
  //   console.log(rowId);
  // }

  onValueChangeDate($event, item: HrmEmployees, value: Date) {
    console.log('$event');
    console.log($event);
    value = this.parseDateValue($event);
    console.log(item);
  }

  onRowEdit(isEdit: boolean) {
    // Gọi khi có dòng nào đó thay đổi
    console.log('Gọi khi có dòng nào đó thay đổi');
    console.log(isEdit);

    this.formDirtyService.setDirty(isEdit || this.formDirtyService.getCurrentDirty());
  }
  get isDirty() {
    return this.formDirtyService.isDirty$();
  }
  parseDateValue(value: string): Date {
    const [day, month, year] = value.split('/');
    return value ? new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)) : null;
  }

  saveChanges() {
    const changedData = this.listEmployeesGrid.filter((row) => this.changedRows.has(row.pkEmployeeId));
    console.log('Lưu các dòng:', changedData);
    this.changedRows.clear();
  }

  cancelChanges() {
    this.changedRows.clear();
    // Reset giá trị về ban đầu nếu cần
  }
}
