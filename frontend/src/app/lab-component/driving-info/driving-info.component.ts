import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HrmEmployeesService } from './service/hrm-employees.service';
import { HrmEmployees, HrmEmployeesCbx, HrmEmployeesFilter, SearchOption } from './model/hrm-employees.model';
import { BcaLicenseTypes } from './model/bca-license-types';
import { BcaLicenseTypesService } from './service/bca-license-types.service';
import { PageEvent, PagingModel, PagingResult } from '../../app-model/paging';
import { PaginationComponent } from './share-component/pagination/pagination.component';

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

  constructor(
    // private fb: FormBuilder,
    private employeesService: HrmEmployeesService,
    private licenseTypesService: BcaLicenseTypesService
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
    this.filterEmployeesGrid.listStringLicenseTypesId = this.employeesService.getSortedIdString(
      event,
      'pkLicenseTypeId'
    );
  }
  searchOptionChange(event) {
    console.log(event);
  }
}
