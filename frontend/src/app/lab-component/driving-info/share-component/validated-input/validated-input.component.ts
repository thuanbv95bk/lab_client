import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  HostListener,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ViewChild,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { NgbDateStruct, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { BcaLicenseTypes } from '../../model/bca-license-types';

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
  // @Input() initialValue: Date | string | null = null;
  private originalValue: any = null; // Lưu giá trị ban đầu để so sánh isEdited
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() inputType: 'text' | 'date' | 'select' | 'phone' = 'text';
  @Input() resetEditFlag: boolean = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Input() selectOptions: BcaLicenseTypes[] = [];
  @Input() selectLabel: string = 'name'; // trường hiển thị, mặc định là 'name'
  @Output() valueChange = new EventEmitter<string | Date | null>();
  // @Output() validChange = new EventEmitter<boolean>();
  @Output() isEditedChange = new EventEmitter<boolean>();

  @Output() fieldStatusChange = new EventEmitter<{ isEdited: boolean; isValid: boolean }>();
  @Output() focusInput = new EventEmitter<void>();
  // Thêm các dòng này
  @ViewChild('datePopover') datePopover!: NgbPopover;
  inputControl: FormControl;
  isEdited = false;
  errorMessage: string = '';
  showDatePicker = false;
  dateModel: { day: number; month: number; year: number } | null = null;
  private lastValue = '';
  placeholder = 'dd/MM/yyyy';

  private onChange: any = () => {};
  private onTouched: any = () => {};
  writeValue(value: any): void {
    // Lưu giá trị ban đầu nếu lần đầu gọi
    if (this.originalValue === null) {
      this.originalValue = value;
    }
    const displayValue = this.convertInitialValue(value);
    this.inputControl.setValue(displayValue, { emitEvent: false });
    this.inputControl.updateValueAndValidity(); // Thêm dòng này
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.inputControl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  constructor(private el: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputType == 'date') {
      // Chuẩn hóa minDate, maxDate về null nếu không hợp lệ
      const safeMinDate = this.isValidDateInput(this.minDate) ? this.minDate : null;
      const safeMaxDate = this.isValidDateInput(this.maxDate) ? this.maxDate : null;

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
    if (changes['ngModel']) {
      this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
      this.originalValue = changes['ngModel'].currentValue;
    }
    if (changes['resetEditFlag'] && changes['resetEditFlag'].currentValue) {
      this.isEdited = false;
      this.fieldStatusChange.emit({ isEdited: false, isValid: !this.inputControl.invalid });
    }
  }

  // Thêm hàm kiểm tra hợp lệ cho minDate/maxDate
  private isValidDateInput(date: any): boolean {
    if (!date) return false;
    if (date instanceof Date && !isNaN(date.getTime())) return true;
    if (typeof date === 'string' && this.isValidDateString(date)) return true;
    return false;
  }
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

    // KHỞI TẠO VỚI GIÁ TRỊ RỖNG, GIÁ TRỊ SẼ ĐƯỢC SET BỞI writeValue
    this.inputControl = new FormControl('', validators);

    if (this.inputType === 'date') {
      this.inputControl.valueChanges.subscribe((value) => {
        this.handleDateInput(value, false);
      });
    }

    this.updateIsEdited();

    this.inputControl.valueChanges.subscribe(() => {
      // this.inputControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      this.updateIsEdited();
    });
  }

  private dateRangeValidator = (minDate: string | Date | null, maxDate: string | Date | null) => {
    return (control: FormControl) => {
      const value = control.value;
      if (!value || !this.isValidDateString(value)) return null;
      const date = this.parseDate(value);
      const min = this.parseDate(minDate);
      const max = this.parseDate(maxDate);

      if (min && date && date < min) {
        return { minDate: { requiredMin: this.formatDate(min), actual: value } };
      }
      if (max && date && date > max) {
        return { maxDate: { requiredMax: this.formatDate(max), actual: value } };
      }
      return null;
    };
  };
  private parseDate(str: string | Date): Date | null {
    if (!str) return null;
    if (str instanceof Date) return str;
    if (typeof str === 'string') {
      const parts = str.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
      // ISO format fallback
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  // Hàm cập nhật trạng thái isEdited
  private updateIsEdited(): void {
    let value = this.inputControl.value;
    let initial = this.originalValue;

    // Chuẩn hóa cho kiểu date: nếu rỗng/null/không hợp lệ thì về ''
    if (this.inputType === 'date') {
      value = this.convertInitialValue(value);
      initial = this.convertInitialValue(initial);
    } else {
      value = value == null || value === undefined ? '' : String(value).trim();
      initial = initial == null || initial === undefined ? '' : String(initial).trim();
    }

    this.isEdited = value !== initial;

    this.validate();
    this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
  }

  // Xử lý nhập liệu và xóa cho trường date
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

    // Sửa tại đây: dùng newValue để kiểm tra và cập nhật dateModel
    if (this.isValidDateString(newValue)) {
      const [day, month, year] = newValue.split('/').map(Number);
      this.dateModel = { day, month, year }; // luôn là object mới
    } else {
      this.dateModel = null;
    }
  }
  onDateInput(event: any): void {
    if (this.inputType !== 'date') return;
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    // Tự động format và thêm placeholder
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

    // Cập nhật giá trị input mà không emit event
    this.inputControl.setValue(formatted, { emitEvent: false });

    // Đặt lại vị trí con trỏ
    setTimeout(() => {
      input.setSelectionRange(cursorPos, cursorPos);
    });

    // Cập nhật dateModel nếu hợp lệ
    if (this.isValidDateString(formatted)) {
      const [day, month, year] = formatted.split('/').map(Number);
      this.dateModel = { day, month, year };
    } else {
      this.dateModel = null;
    }
    this.inputControl.updateValueAndValidity({ onlySelf: true });
  }
  // Định dạng với placeholder
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

  private parseDateValue(value: string): void {
    if (value && this.isValidDateString(value)) {
      const [day, month, year] = value.split('/');
      this.dateModel = {
        day: parseInt(day, 10),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      };
    } else {
      this.dateModel = null;
    }
  }
  // Xử lý sự kiện keydown
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

    // Xử lý đặc biệt cho phím xóa
    if (event.key === 'Backspace' || event.key === 'Delete') {
      // setTimeout(() => this.handleDateInput(this.inputControl.value, true));
      this.handleDateInput(this.inputControl.value, true);
    }
  }

  onPhoneKeydown(event: KeyboardEvent): void {
    if (this.inputType !== 'phone') return;
    // Chỉ cho phép số, phím điều hướng, backspace, delete, tab
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

  onTextKeydown(event: KeyboardEvent): void {
    if (this.inputType !== 'text') return;
    if (event.key === '<' || event.key === '>') {
      event.preventDefault();
    }
  }
  // Chuyển đổi giá trị ban đầu sang chuỗi
  private convertInitialValue(value: any): string {
    if (this.inputType === 'date') {
      if (value instanceof Date) {
        return this.isValidDate(value) ? this.formatDate(value) : '';
      }
      const strVal = String(value ?? '');
      // Nếu là dạng dd/MM/yyyy thì giữ nguyên
      if (this.isValidDateString(strVal)) return strVal;
      // Nếu là dạng ISO (yyyy-MM-ddTHH:mm:ss)
      const isoMatch = strVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        const [_, year, month, day] = isoMatch;
        return `${day}/${month}/${year}`;
      }
      return '';
    }
    return String(value ?? '');
  }

  // Định dạng ngày thành 'dd/MM/yyyy'
  private formatDate(date: Date): string {
    return [this.pad(date.getDate()), this.pad(date.getMonth() + 1), date.getFullYear()].join('/');
  }

  // Thêm số 0 đằng trước nếu cần
  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  // Kiểm tra Date hợp lệ
  private isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  // Kiểm tra chuỗi date hợp lệ
  private isValidDateString(dateStr: string): boolean {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  }

  // Xử lý khi chọn ngày từ date picker
  onDateSelect(date: NgbDateStruct): void {
    const formattedDate = `${this.pad(date.day)}/${this.pad(date.month)}/${date.year}`;
    this.inputControl.setValue(formattedDate);
    if (this.datePopover?.isOpen()) {
      setTimeout(() => this.datePopover.close(), 50);
    }
  }

  // Validate dữ liệu
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
        if (!this.isValidDateString(this.inputControl.value)) {
          this.errorMessage = 'Ngày không hợp lệ';
        }
      }
      // Không emit khi chưa hợp lệ!

      return;
    }

    this.valueChange.emit(this.inputControl.value);
  }

  // Đóng date picker khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showDatePicker = false;
    }
  }

  // Class CSS cho viền và nền
  get borderClass(): string {
    if (this.inputControl && this.inputControl.invalid) return 'border-danger';
    if (!this.inputControl.invalid) return 'border-success';
    return '';
  }

  get inputClass(): string {
    return this.isEdited == true ? 'bg-warning' : '';
  }

  // Xử lý toggle date picker
  toggleDatePicker(popover: NgbPopover) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open();

      const value = this.inputControl.value;
      if (this.isValidDateString(value)) {
        const [day, month, year] = value.split('/').map(Number);
        this.dateModel = { day, month, year };
      } else {
        this.dateModel = null;
      }
    }
  }
}
