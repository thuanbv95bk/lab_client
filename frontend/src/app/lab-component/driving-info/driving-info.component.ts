import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HrmEmployeesService } from './service/hrm-employees.service';
import { HrmEmployees, HrmEmployeesCbx, HrmEmployeesFilter, SearchOption } from './model/hrm-employees.model';
import { BcaLicenseTypes } from './model/bca-license-types';
import { BcaLicenseTypesService } from './service/bca-license-types.service';
import { PageEvent, PagingModel, PagingResult } from '../../app-model/paging';
import { PaginationComponent } from './share-component/pagination/pagination.component';
import { FormDirtyService } from './service/form-dirty.service';
import { CommonService } from '../../service/common.service';
import { DialogConfirmService } from '../../app-dialog-component/dialog-confirm/dialog-confirm.service';

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

  selectedId: HrmEmployees;
  /** biến để trigger reset */
  resetEditFlag = false;
  constructor(
    private employeesService: HrmEmployeesService,
    private licenseTypesService: BcaLicenseTypesService,
    public commonService: CommonService,
    private dialogConfirm: DialogConfirmService
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
  /** Sự kiện click vào row chọn người dùng
   * @param item Class User
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  onClickRow(item: HrmEmployees) {
    if (this.selectedId != item) {
      this.selectedId = item;
    } else {
      this.selectedId = null;
    }
  }
  onFocusRow(item: HrmEmployees) {
    this.selectedId = item;
  }
  onClickItem(item: HrmEmployees) {
    this.selectedId = item;
  }
  searchPagingToEdit() {
    this.filterEmployeesGrid.pageIndex = 1;
    this.pagingModel.length = 0;
    this.pagingModel.pageIndex = 1;
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

  onFieldStatusChange(row: HrmEmployees, field: string, status: { isEdited: boolean; isValid: boolean }) {
    if (!row.fieldStatus) row.fieldStatus = {};
    row.fieldStatus[field] = status;
    this.updateIsEditFlag(row);
  }
  updateIsEditFlag(row: HrmEmployees) {
    // Danh sách các field cần kiểm tra
    const fields = [
      'displayName',
      'mobile',
      'driverLicense',
      'issueLicenseDate',
      'expireLicenseDate',
      'issueLicensePlace',
      'licenseType',
    ];

    // Có ít nhất 1 field isEdited=true và tất cả field đều isValid=true
    const anyEdited = fields.some((f) => row.fieldStatus?.[f]?.isEdited);
    const allValid = fields.every((f) => row.fieldStatus?.[f]?.isValid);

    row.isEdit = anyEdited && allValid;
  }

  getChangedValidRows(): HrmEmployees[] {
    return this.listEmployeesGrid.filter((row) => row.isEdit);
  }

  get isCanSave(): boolean {
    return this.getChangedValidRows()?.length > 0;
  }

  saveChanges() {
    console.log('Lưu các dòng');
    // console.log(this.listEmployeesGrid);
    this.getChangedValidRows();
    this.addOrEditList(this.getChangedValidRows());
  }

  async deleteRow(item: HrmEmployees) {
    const result = await this.dialogConfirm.confirm(`Bạn có chắc chắn muốn xóa lái xe ${item.displayName}?`);
    if (result) {
      console.log(' Xử lý xóa');
      if (!item.pkEmployeeId || item.pkEmployeeId <= 0) return this.commonService.showWarning('Có lỗi với dữ liệu');
      this.employeesService.deleteSoft(item.pkEmployeeId).then(
        (res) => {
          if (!res.isSuccess) {
            console.error(res);
            this.commonService.showError(res.errorMessage + ' errCode: ' + res.statusCode + ' )');
            return;
          } else if (res.isSuccess) {
            this.commonService.showSuccess('Xóa thành công');
            // Xóa item khỏi danh sách
            this.listEmployeesGrid = this.listEmployeesGrid.filter((x) => x.pkEmployeeId !== item.pkEmployeeId);
            this.pagingModel.length = this.pagingModel.length > 0 ? this.pagingModel.length - 1 : 0;
          }
        },
        (err) => this.commonService.showError('Xóa thất bại')
      );
    }
  }

  /** Lưu lại giá trị nhóm đã gán vào DB
   * @param VehicleGroupModel danh sách nhóm phẳng(không cha-con)
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  addOrEditList(listItem: HrmEmployees[]) {
    if (!listItem.length) return this.commonService.showWarning('Danh sách trống');
    listItem.forEach((x) => {
      x.issueLicenseDate = new Date(this.toISODateString(x.issueLicenseDate.toString()));
      x.expireLicenseDate = new Date(this.toISODateString(x.expireLicenseDate.toString()));
    });
    this.employeesService.addOrEditList(listItem).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          this.commonService.showError(res.errorMessage + ' errCode: ' + res.statusCode + ' )');
          return;
        }

        this.commonService.showSuccess('Cập nhật thành công');

        listItem.forEach((row) => {
          row.isEdit = false;
          Object.values(row.fieldStatus || {}).forEach((f) => (f.isEdited = false));
        });
        this.resetEditFlag = true;
        setTimeout(() => (this.resetEditFlag = false), 0);
      },
      (err) => this.commonService.showError('Cập nhật thất bại')
    );
  }

  cancelChanges() {
    this.changedRows.clear();

    // Reset giá trị về ban đầu nếu cần
  }
  toISODateString(dateStr: string): string | null {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return null;
    // Trả về dạng yyyy-MM-dd (không có giờ, không bị lệch timezone)
    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  downloadExcel() {
    this.filterEmployeesGrid.fkCompanyId = this.FkCompanyID;
    this.employeesService
      .exportExcel(this.filterEmployeesGrid)
      .then(() => console.log('Download completed'))
      .catch((error) => console.error('Download failed:', error));
  }
}
