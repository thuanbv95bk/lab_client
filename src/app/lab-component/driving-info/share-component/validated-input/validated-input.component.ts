import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { NgbDateStruct, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { BcaLicenseTypes } from '../../model/bca-license-types';
import {
  convertInitialValue,
  formatDate,
  isValidDateInput,
  isValidDateString,
  pad,
  parseDate,
} from '../../../../utils/date-utils';

@Component({
  selector: 'app-validated-input',
  templateUrl: './validated-input.component.html',
  styleUrls: ['./validated-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValidatedInputComponent),
      multi: true,
    },
  ],
})
export class ValidatedInputComponent implements OnInit, OnChanges {
  /** input required */
  @Input() required: boolean = false;
  /** độ dài min của dữ liệu */
  @Input() minLength?: number;

  /** độ dài max của dữ liệu */
  @Input() maxLength?: number;
  /** data type */
  @Input() inputType: 'text' | 'date' | 'select' | 'phone' = 'text';
  /** trigger reset về trạng thái isEdit = false,sau khi lưu */
  @Input() resetEditFlag: boolean = false;

  /** nếu data type = Date , minDate và maxDate để check Validated */
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  /** nếu data type = selection => danh sách options */
  @Input() selectOptions: BcaLicenseTypes[] = [];

  /** trường hiển thị, mặc định là 'name' */
  @Input() selectLabel: string = 'name';

  /** emit data ra ngoài  */
  @Output() valueChange = new EventEmitter<string | Date | null>();

  /** emit trạng thái đã được chỉnh sửa? hợp lệ ? */
  @Output() fieldStatusChange = new EventEmitter<{ isEdited: boolean; isValid: boolean }>();
  /** emit khi  focus vào ô input */
  @Output() focusInput = new EventEmitter<void>();

  /** Lưu giá trị ban đầu để so sánh isEdited */
  private originalValue: any = null;

  /** ViewChild của datepicker */
  @ViewChild('datePopover') datePopover!: NgbPopover;

  inputControl: FormControl;

  /** Lưu trạng thái isEdited */
  isEdited = false;

  /** errorMessage thông báo lỗi ra tooltip */
  errorMessage: string = '';

  /** biến lưu value nếu type = date */
  dateModel: { day: number; month: number; year: number } | null = null;

  /** biến lưu data mới nhất=> check sự thay đỗi data */
  private lastValue = '';
  /** placeholder nếu type = date */
  placeholder = 'dd/MM/yyyy';

  private onChange: any = () => {};
  private onTouched: any = () => {};

  /** Set giá trị ban đầu của value- input
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  writeValue(value: any): void {
    /** Lưu giá trị ban đầu nếu lần đầu gọi */
    if (this.originalValue === null) {
      this.originalValue = value;
    }

    const displayValue = convertInitialValue(this.inputType, value);
    this.inputControl.setValue(displayValue, { emitEvent: false });
    this.inputControl.updateValueAndValidity();
  }

  /** Đăng ký để trigger sự thay đỗi của dữ liệu
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.inputControl.valueChanges.subscribe(fn);
  }

  /** Đăng ký hàm callback khi input bị "touch"
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  /** thiết lập trạng thái disabled cho inputControl (theo chuẩn ControlValueAccessor)
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  constructor() {}

  /** Theo dõi sự thay đỗi cửa dữ liệu
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputType == 'date') {
      /** Chuẩn hóa minDate, maxDate về null nếu không hợp lệ */
      const safeMinDate = isValidDateInput(this.minDate) ? this.minDate : null;
      const safeMaxDate = isValidDateInput(this.maxDate) ? this.maxDate : null;

      if ((changes['minDate'] || changes['maxDate']) && this.inputControl) {
        const validators = [];
        if (this.required) validators.push(Validators.required);
        validators.push(Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/));
        validators.push(this.dateRangeValidator(safeMinDate, safeMaxDate));

        this.inputControl.setValidators(validators);
        setTimeout(() => {
          this.inputControl.updateValueAndValidity();
          this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
        });
      }
    }
    /** trigger Lưu lại giá trị của input ban đầu */
    if (changes['ngModel']) {
      this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
      this.originalValue = changes['ngModel'].currentValue;
    }
    /** trigger this.isEdited nếu người dùng đã lưu các thay đỗi */
    if (changes['resetEditFlag'] && changes['resetEditFlag'].currentValue) {
      this.isEdited = false;
      this.fieldStatusChange.emit({ isEdited: false, isValid: !this.inputControl.invalid });
    }
  }

  /** Khởi tạo giá trị ban đầu, và thêm các Validators cho các loại dữ liệu khác nhau
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  ngOnInit(): void {
    const validators = [];
    if (this.required) validators.push(Validators.required);

    if (this.inputType === 'text') {
      validators.push(
        Validators.pattern(/^[^<>]*$/),
        ...(this.minLength ? [Validators.minLength(this.minLength)] : []),
        ...(this.maxLength ? [Validators.maxLength(this.maxLength)] : [])
      );
    } else if (this.inputType === 'date') {
      validators.push(Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/));
      validators.push(this.dateRangeValidator(this.minDate, this.maxDate));
    } else if (this.inputType === 'phone') {
      validators.push(Validators.pattern(/^0\d{9}$/));
    }

    /** KHỞI TẠO VỚI GIÁ TRỊ RỖNG, GIÁ TRỊ SẼ ĐƯỢC SET BỞI writeValue */
    this.inputControl = new FormControl('', validators);

    /** nếu la date => đăng ký sự thay đỗi, khi người dùng gõ */
    if (this.inputType === 'date') {
      this.inputControl.valueChanges.subscribe((value) => {
        this.handleDateInput(value, false);
      });
    }

    /** gọi hàm cập nhật trạng thái isEdit */
    this.updateIsEdited();

    /** Đăng ký theo dõi*/
    this.inputControl.valueChanges.subscribe(() => {
      this.updateIsEdited();
    });
  }

  /** Hàm kiểm tra Validator kiểu dữ liệu date trong khoang input cho phép
   * @param minDate
   * @param maxDate
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  private dateRangeValidator = (minDate: string | Date | null, maxDate: string | Date | null) => {
    return (control: FormControl) => {
      const value = control.value;
      if (!value || !isValidDateString(value)) return null;
      const date = parseDate(value);
      const min = parseDate(minDate);
      const max = parseDate(maxDate);

      if (min && date && date < min) {
        return { minDate: { requiredMin: formatDate(min), actual: value } };
      }
      if (max && date && date > max) {
        return { maxDate: { requiredMax: formatDate(max), actual: value } };
      }
      return null;
    };
  };

  /** Hàm cập nhật trạng thái isEdited, emit trạng thái ra ngoài
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  private updateIsEdited(): void {
    let value = this.inputControl.value;
    let initial = this.originalValue;

    /** Chuẩn hóa cho kiểu date: nếu rỗng/null/không hợp lệ thì về '' */
    if (this.inputType === 'date') {
      value = convertInitialValue(this.inputType, value);
      initial = convertInitialValue(this.inputType, initial);
    } else {
      value = value == null || value === undefined ? '' : String(value).trim();
      initial = initial == null || initial === undefined ? '' : String(initial).trim();
    }

    this.isEdited = value !== initial;

    this.validate();
    this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
  }

  /** Xử lý nhập liệu và xóa cho data type= date
   * @param value
   * @param isDelete nhập thêm hay xóa
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  private handleDateInput(value: string, isDelete: boolean): void {
    if (!value) {
      this.inputControl.setValue('', { emitEvent: false });
      this.dateModel = null;
      return;
    }

    if (value === this.placeholder) return;

    let newValue = value.replace(/[^0-9dmyDMY]/g, '');
    newValue = this.formatWithPlaceholders(newValue, isDelete);

    if (newValue !== this.lastValue) {
      this.inputControl.setValue(newValue, { emitEvent: false });
      this.lastValue = newValue;
      this.valueChange.emit(newValue === this.placeholder ? null : newValue);
    }

    if (isValidDateString(newValue)) {
      const [day, month, year] = newValue.split('/').map(Number);
      this.dateModel = { day, month, year };
    } else {
      this.dateModel = null;
    }
  }

  /** xử lý sự kiện người dùng nhập liệu với dataType = date
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  onDateInput(event: any): void {
    if (this.inputType !== 'date') return;
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    /** Tự động format và thêm placeholder */
    let formatted = '';
    let cursorPos = input.selectionStart || 0;

    if (value.length <= 2) {
      formatted = value.padEnd(2, 'd') + '/MM/yyyy';
      cursorPos = value.length === 2 ? 3 : value.length;
    } else if (value.length <= 4) {
      formatted = value.substr(0, 2) + '/' + value.substr(2, 2).padEnd(2, 'M') + '/yyyy';
      cursorPos = value.length === 4 ? 6 : value.length + 1;
    } else {
      formatted = value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4, 4).padEnd(4, 'y');
      cursorPos = value.length + 2;
      if (cursorPos > 10) cursorPos = 10;
    }

    /** Cập nhật giá trị input mà không emit event */
    this.inputControl.setValue(formatted, { emitEvent: false });

    /**Đặt lại vị trí con trỏ */
    setTimeout(() => {
      input.setSelectionRange(cursorPos, cursorPos);
    });

    /** Cập nhật dateModel nếu hợp lệ */
    if (isValidDateString(formatted)) {
      const [day, month, year] = formatted.split('/').map(Number);
      this.dateModel = { day, month, year };
    } else {
      this.dateModel = null;
    }
    this.inputControl.updateValueAndValidity({ onlySelf: true });
  }

  /** Định dạng với placeholder
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  private formatWithPlaceholders(value: string, isDelete: boolean): string {
    let formatted = value.replace(/[^0-9]/g, '');

    if (formatted.length > 8) formatted = formatted.substring(0, 8);

    let result = '';
    for (let i = 0; i < formatted.length; i++) {
      if (i === 2 || i === 4) result += '/';
      result += formatted[i];
    }

    // Thêm placeholder
    if (!isDelete) {
      const parts = result.split('/');
      parts[0] = parts[0]?.padEnd(2, 'd') || 'dd';
      parts[1] = parts[1]?.padEnd(2, 'M') || 'MM';
      parts[2] = parts[2]?.padEnd(4, 'y') || 'yyyy';

      return parts.join('/');
    }

    return result;
  }

  /** Xử lý sự kiện keydown DataType = date
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  onDateKeydown(event: KeyboardEvent): void {
    if (this.inputType !== 'date') return;

    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
      return;
    }

    /** Xử lý đặc biệt cho phím xóa */
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.handleDateInput(this.inputControl.value, true);
    }
  }

  /** Xử lý sự kiện keydown DataType = phone
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */
  onPhoneKeydown(event: KeyboardEvent): void {
    if (this.inputType !== 'phone') return;
    /**  Chỉ cho phép số, phím điều hướng, backspace, delete, tab */
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  /** Xử lý sự kiện keydown DataType = text
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */
  onTextKeydown(event: KeyboardEvent): void {
    if (this.inputType !== 'text') return;
    if (event.key === '<' || event.key === '>') {
      event.preventDefault();
    }
  }

  /** xử lý khi chọn ngày từ date picker
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  onDateSelect(date: NgbDateStruct): void {
    const formattedDate = `${pad(date.day)}/${pad(date.month)}/${date.year}`;
    this.inputControl.setValue(formattedDate);
    if (this.datePopover?.isOpen()) {
      setTimeout(() => this.datePopover.close(), 50);
    }
  }

  /**Validate dữ liệu
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  validate(): void {
    this.errorMessage = '';

    if (this.inputControl.hasError('required')) {
      this.errorMessage = 'Giá trị không được để trống';
      return;
    }
    if (this.inputControl.invalid) {
      const errors = this.inputControl.errors;
      if (errors?.['minlength']) {
        this.errorMessage = `Tối thiểu ${this.minLength} ký tự`;
      } else if (errors?.['maxlength']) {
        this.errorMessage = `Tối đa ${this.maxLength} ký tự`;
      } else if (errors?.['pattern']) {
        if (this.inputType === 'text') {
          this.errorMessage = 'Không được nhập ký tự < hoặc >';
        } else if (this.inputType === 'date') {
          this.errorMessage = 'Định dạng ngày phải là dd/MM/yyyy';
        } else if (this.inputType === 'phone') {
          this.errorMessage = 'Số điện thoại không hợp lệ (bắt đầu bằng 0, đủ 10 số)';
        }
      } else if (errors?.['minDate']) {
        this.errorMessage = `Ngày phải lớn hơn hoặc bằng ${errors['minDate'].requiredMin}`;
      } else if (errors?.['maxDate']) {
        this.errorMessage = `Ngày phải nhỏ hơn hoặc bằng ${errors['maxDate'].requiredMax}`;
      } else if (this.inputType === 'date' && this.inputControl.value) {
        if (!isValidDateString(this.inputControl.value)) {
          this.errorMessage = 'Ngày không hợp lệ';
        }
      }
      return;
    }

    /**emit value ra ngoài nếu hợp lệ */
    this.valueChange.emit(this.inputControl.value);
  }

  /**Class CSS cho viền và nền
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  get borderClass(): string {
    if (this.inputControl && this.inputControl.invalid) return 'border-danger';
    if (!this.inputControl.invalid) return 'border-success';
    return '';
  }

  /** class bên trong nền vàng nếu đã edit
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  get inputClass(): string {
    return this.isEdited == true ? 'bg-warning' : '';
  }

  /** Xử lý toggle date picker
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  toggleDatePicker(popover: NgbPopover) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open();

      const value = this.inputControl.value;
      if (isValidDateString(value)) {
        const [day, month, year] = value.split('/').map(Number);
        this.dateModel = { day, month, year };
      } else {
        this.dateModel = null;
      }
    }
  }
}
