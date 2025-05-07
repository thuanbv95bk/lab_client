import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HrmEmployeesService } from './service/hrm-employees.service';
import {
  HrmEmployees,
  HrmEmployeesCbx,
  HrmEmployeesFilter,
  HrmEmployeesFilterExcel,
  messageConfirm,
} from './model/hrm-employees.model';
import { BcaLicenseTypes } from './model/bca-license-types';
import { BcaLicenseTypesService } from './service/bca-license-types.service';
import { PageEvent, PagingModel, PagingResult } from '../../app-model/paging';
import { CommonService } from '../../service/common.service';
import { DialogConfirmService } from '../../app-dialog-component/dialog-confirm/dialog-confirm.service';
import { toISODateString } from '../../utils/date-utils';
import { LoadingService } from '../../layout/loading-mask/loading.service';

@Component({
  selector: 'app-driving-info',
  templateUrl: './driving-info.component.html',
  styleUrls: ['./driving-info.component.scss'],
})

/** Component danh danh sách lái xe, edit, xóa lái xe
 * @Author thuan.bv
 * @Created 07/05/2025
 * @Modified date - user - description
 */
export class DrivingInfoComponent implements OnInit, AfterViewInit {
  /** Địa chỉ công ty mặc định */
  fkCompanyID: number = 15076;

  /** Danh sách lái xe ở combobox tìm kiếm */
  lstDriver: HrmEmployeesCbx[] = [];

  /** Danh sách các loại giấy phép lái xe ở cbx tìm kiếm */
  listLicenseTypes: BcaLicenseTypes[] = [];

  /** Danh sách Lái xe ở bảng chính */
  listEmployeesGrid: HrmEmployees[] = [];

  /** Bộ lọc của danh sách lái xe của bảng chính */
  filterEmployeesGrid: HrmEmployeesFilter = new HrmEmployeesFilter();

  /** Bộ lọc dùng để xuất Excel */
  filterExcel: HrmEmployeesFilterExcel = new HrmEmployeesFilterExcel();

  /** Lưu thông tin của paging phân trang */
  pagingModel: PagingModel;

  /** Lấy thông tin ngày -giờ hiện tại */
  dateNow = new Date();

  /** Lái xe đang được chọn ở table */
  selectedId: HrmEmployees;
  /** biến để trigger reset các dòng đã lưu thành công */
  resetEditFlag = false;

  constructor(
    private employeesService: HrmEmployeesService,
    private licenseTypesService: BcaLicenseTypesService,
    public commonService: CommonService,
    private dialogConfirm: DialogConfirmService
  ) {
    this.pagingModel = new PagingModel();
  }

  /** thiết lập trạng thái ban đầu, get các data, master data
   * @Author thuan.bv
   * @Created 07/05/2025
   * @Modified date - user - description
   */
  ngOnInit() {
    // Lấy về danh sách lái xe to CBX
    this.getListEmployeesToCbx();

    // Lấy về danh sách giấy phép lái xe
    this.getListLicenseTypes();

    // Lấy về Paging của bảng chính- danh sách lái xe
    this.getPagingToEdit();
  }

  /** set lại thông số phân trang
   * @Author thuan.bv
   * @Created 07/05/2025
   * @Modified date - user - description
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pagingModel.pageSize = this.filterEmployeesGrid.pageSize;
      this.pagingModel.pageIndex = 1;
    }, 100);
  }

  /** Hàm lấy danh sách lái xe, phục vụ tìm kiếm
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  getListEmployeesToCbx() {
    this.employeesService.getListCbx(this.fkCompanyID).then(
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

  /** Hàm lấy danh sách giấy phép lái xe- phục vụ tìm kiếm
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
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

  /** Hàm lấy danh sách lái xe, ở bàng chính- phân trang
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  getPagingToEdit() {
    // this.loadingService.setLoading(true);
    // gán id của công ty mặc định
    this.filterEmployeesGrid.fkCompanyId = this.fkCompanyID;
    this.employeesService.getPagingToEdit(this.filterEmployeesGrid, false).then(
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

  /** highline dòng-row mà người dùng chọn
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  onClickItem(item: HrmEmployees) {
    this.selectedId = item;
  }

  /** event- khi người dùng click vào nút tìm kiếm
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  async searchPagingToEdit() {
    if (this.isCanCancel) {
      const result = await this.dialogConfirm.confirm(messageConfirm);
      if (!result) {
        return;
      }
    }
    // set các thuộc tính của paging về mặc định
    this.filterEmployeesGrid.pageIndex = 0;
    this.filterEmployeesGrid.pageSize = this.pagingModel.pageSize;
    this.pagingModel.length = 0;
    this.pagingModel.pageIndex = 1;
    // gọi đến hàm call API
    this.getPagingToEdit();
  }

  /** event - khi người dùng click phân trang
   * @param event Mô tả param 1
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  async pageIndexChange(event: PageEvent) {
    this.filterEmployeesGrid.pageIndex = event.pageIndex;
    this.filterEmployeesGrid.pageSize = event.pageSize;
    this.getPagingToEdit();
  }

  /**event Nút reload dữ liệu
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  reloadPagingToEdit() {
    this.getPagingToEdit();
  }

  /** event từ combobox - khi người dùng chọn lái xe
   * @param items Mô tả param 1
   * @param data Danh sách lái xe được chọn
   * @param isCheckAll :true-> chọn all, false -> không chọn all
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  onSelectedChangeDriver(items: { data: HrmEmployeesCbx[]; isCheckAll: boolean }) {
    console.log(items);

    if (!items.isCheckAll) {
      // Tạo string-key là danh sách các ID cua lái xe , cách nhau bởi dấu ','
      this.filterEmployeesGrid.listStringEmployeesId = this.employeesService.getSortedIdString(items.data, 'pkEmployeeId');

      // Tạo string-Name là danh sách các Tên cua lái xe , cách nhau bởi dấu ','
      // -> phục vụ cho hiển thị danh sách bộ lọc
      this.filterExcel.listStringEmployeesName = this.employeesService.getSortedIdString(items.data, 'displayName');
    } else {
      // Nếu chọn all
      // không lấy hết các name, mà chỉ hiển thị text = 'Tất cả(length)'
      this.filterExcel.listStringEmployeesName = `Tất cả (${items.data.length})`;
      this.filterEmployeesGrid.listStringEmployeesId = '';
    }
  }

  /** event từ combobox - khi người dùng chọn loại giấy phép lái xe
   * @param items Mô tả param 1
   * @param data any[] dùng chung Danh sách loại giấy phép lái xe
   * @param isCheckAll :true-> chọn all, false -> không chọn all
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  onSelectedChangeLicenseTypes(items: { data: BcaLicenseTypes[]; isCheckAll: boolean }) {
    if (!items.isCheckAll) {
      // Tạo string-key là danh sách các ID Danh sách loại giấy phép lái xe , cách nhau bởi dấu ','
      this.filterEmployeesGrid.listStringLicenseTypesId = this.employeesService.getSortedIdString(items.data, 'pkLicenseTypeId');

      // Tạo string-Name là danh sách các name Danh sách loại giấy phép lái xe , cách nhau bởi dấu ','
      this.filterExcel.listStringLicenseTypesName = this.employeesService.getSortedIdString(items.data, 'name');
    } else {
      // Nếu chọn all

      // không lấy hết các name, mà chỉ hiển thị text = 'Tất cả(length)'
      this.filterExcel.listStringLicenseTypesName = `Tất cả (${items.data.length})`;
      this.filterEmployeesGrid.listStringLicenseTypesId = '';
    }
  }

  /** event cập nhật các trạng thái của các field, ô input
   * @param row Dòng được chọn
   * @param field tên của trường được chọn
   * @param status: { isEdited: boolean; isValid: boolean } trạng thái của trường đó
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
  onFieldStatusChange(row: HrmEmployees, field: string, status: { isEdited: boolean; isValid: boolean }) {
    if (!row.fieldStatus) row.fieldStatus = {};
    row.fieldStatus[field] = status;
    // Hàm update -checker cả dòng
    this.updateIsEditFlag(row);
  }

  /** Hàm update -Cập nhật trạng -lái xe đó có được edit hay không, hợp lệ không
   * @param row Lái xe được chọn
   * @Author thuan.bv
   * @Created 25/04/2025
   * @Modified date - user - description
   */
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

    row.isEdit = anyEdited;
    // cập nhật lái xe đó đã được edit và các fields đều hợp lệ
    row.isValid = anyEdited && allValid;
  }

  /** Hàm lọc danh sách các lái xe hợp lệ
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  getChangedValidRows(): HrmEmployees[] {
    return this.listEmployeesGrid.filter((row) => row.isValid);
  }

  /** Hàm lọc danh sách các lái xe đã được chỉnh sửa
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  getChangedEditRows(): HrmEmployees[] {
    return this.listEmployeesGrid.filter((row) => row.isEdit);
  }

  /** get trạng thái Ẩn/hiện của bottom Save
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   *  @Modified 07/05/2025 - thuan.bv - Sửa logic
   */
  get isCanSave(): boolean {
    const listEdit = this.listEmployeesGrid.filter((item) => item.isEdit);
    return listEdit.length > 0 && !listEdit.some((x) => !x.isValid);
  }

  /** get trạng thái Ẩn/hiện của bottom cancel
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  get isCanCancel(): boolean {
    return this.listEmployeesGrid.some((item) => item.isEdit);
  }

  /** Lưu dữ liệu
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  saveChanges() {
    this.addOrEditList(this.getChangedValidRows());
  }

  /** Hàm Gọi API ĐỂ lưu dữ liệu
   * @param listItem danh sách các dòng cần lưu
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  addOrEditList(listItem: HrmEmployees[]) {
    if (!listItem.length) return this.commonService.showWarning('Danh sách trống');
    listItem.forEach((x) => {
      x.issueLicenseDate = new Date(toISODateString(x.issueLicenseDate.toString()));
      x.expireLicenseDate = new Date(toISODateString(x.expireLicenseDate.toString()));
    });

    this.employeesService.addOrEditList(listItem).then(
      async (res) => {
        if (!res.isSuccess) {
          console.error(res);
          this.commonService.showError(res.errorMessage + ' errCode: ' + res.statusCode + ' )');
          return;
        }

        this.commonService.showSuccess('Cập nhật thành công');
        // cập nhật lại trạng thái của các dòng về chưa chỉnh sửa,sau khi lưu thành công
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

  /** Hàm gọi API xóa mềm e lái xe
   * @param item dòng cần xóa
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  async deleteRow(item: HrmEmployees, deleteBtn: HTMLElement) {
    const result = await this.dialogConfirm.confirm(`Bạn có chắc chắn muốn xóa lái xe ${item.displayName}?`);
    if (!result && deleteBtn) {
      setTimeout(() => deleteBtn?.focus(), 0);
    }
    if (result) {
      if (!item.pkEmployeeId || item.pkEmployeeId <= 0) return this.commonService.showWarning('Có lỗi với dữ liệu');
      this.employeesService.deleteSoft(item.pkEmployeeId).then(
        (res) => {
          if (!res.isSuccess) {
            console.error(res);
            this.commonService.showError(res.errorMessage + ' errCode: ' + res.statusCode + ' )');
            return;
          } else if (res.isSuccess) {
            this.commonService.showSuccess('Xóa thành công');
            //  Xóa item khỏi danh sách
            this.listEmployeesGrid = this.listEmployeesGrid.filter((x) => x.pkEmployeeId !== item.pkEmployeeId);
            // cập nhật lại  this.pagingModel.length
            this.pagingModel.length = this.pagingModel.length > 0 ? this.pagingModel.length - 1 : 0;
            this.getListEmployeesToCbx();
          }
        },
        (err) => this.commonService.showError('Xóa thất bại')
      );
    }
  }

  /** Hủy bỏ thay đỗi dữ liệu
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */
  async cancel() {
    const result = await this.dialogConfirm.confirm(`Bạn có chắc chắn muốn hủy bỏ các thay đỗi?`);
    if (result) {
      await this.reloadPagingToEdit();
      // this.commonService.showSuccess('Xóa thành công');
    }
  }

  /** Hàm API download file excel
   * @Author thuan.bv
   * @Created 29/04/2025
   * @Modified date - user - description
   */
  downloadExcel() {
    // Cập nhật lại bộ lọc
    this.filterExcel.fkCompanyId = this.filterEmployeesGrid.fkCompanyId;
    this.filterExcel.displayName = this.filterEmployeesGrid.displayName;
    this.filterExcel.driverLicense = this.filterEmployeesGrid.driverLicense;
    this.filterExcel.option = this.filterEmployeesGrid.option;
    this.filterExcel.listStringEmployeesId = this.filterEmployeesGrid.listStringEmployeesId;
    this.filterExcel.listStringLicenseTypesId = this.filterEmployeesGrid.listStringLicenseTypesId;
    // gọi api
    this.employeesService
      .exportExcel(this.filterExcel)
      .then(() => {
        console.log('Lưu thành công');
      })
      .catch((error) => {
        console.error('Download failed:', error);
        this.commonService.showError('Có lỗi xảy ra');
      });
  }
}
