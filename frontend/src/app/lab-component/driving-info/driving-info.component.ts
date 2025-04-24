import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HrmEmployeesService } from './service/hrm-employees.service';
import { HrmEmployeesCbx } from './model/hrm-employees.model';

@Component({
  selector: 'app-driving-info',
  templateUrl: './driving-info.component.html',
  styleUrls: ['./driving-info.component.scss'],
})
export class DrivingInfoComponent implements OnInit {
  /** Địa chỉ công ty mặc định */
  FkCompanyID: number = 15076;

  lstDriver: HrmEmployeesCbx[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 150; // This should come from your API response
  isLoading: false;

  constructor(private fb: FormBuilder, private employeesService: HrmEmployeesService) {
    this.form = this.fb.group({
      drivers: this.fb.array([]),
    });

    this.addDriver(); // Thêm một dòng mẫu ban đầu
  }

  ngOnInit() {
    /** Lấy về danh sách lái xe to CBX */
    this.getListEmployeesToCbx();
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.loadData();
  }
  loadData(): void {
    // Call your API service here with currentPage and itemsPerPage
    // Example:
    // this.dataService.getData(this.currentPage, this.itemsPerPage).subscribe(response => {
    //   this.data = response.data;
    //   this.totalItems = response.totalCount;
    // });
  }
  form: FormGroup;
  today = new Date();
  licenseTypes = ['A1', 'A2', 'B1', 'B2', 'C'];

  get driversForm(): FormArray {
    return this.form.get('drivers') as FormArray;
  }

  addDriver() {
    this.driversForm.push(
      this.fb.group({
        fullName: ['', Validators.required],
        phone: [''],
        licenseNumber: ['', Validators.required],
        issueDate: ['', Validators.required],
        expireDate: ['', Validators.required],
        issuePlace: ['', Validators.required],
        licenseType: ['', Validators.required],
      })
    );
  }

  removeDriver(index: number) {
    this.driversForm.removeAt(index);
  }
}
