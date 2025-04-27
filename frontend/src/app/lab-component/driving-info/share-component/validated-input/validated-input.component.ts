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
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-validated-input',
  templateUrl: './validated-input.component.html',
  styleUrls: ['./validated-input.component.scss'],
})
export class ValidatedInputComponent implements OnInit, OnChanges {
  @Input() initialValue: Date | string | null = null;
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() inputType: 'text' | 'date' | 'select' | 'phone' = 'text';

  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Input() selectOptions: any[] = [];
  @Input() selectLabel: string = 'name'; // trường hiển thị, mặc định là 'name'
  @Output() valueChange = new EventEmitter<string | Date | null>();
  // @Output() validChange = new EventEmitter<boolean>();
  @Output() isEditedChange = new EventEmitter<boolean>();

  inputControl: FormControl;
  isEdited = false;
  errorMessage: string = '';
  showDatePicker = false;
  dateModel: { day: number; month: number; year: number } | null = null;
  private lastValue = '';
  placeholder = 'dd/MM/yyyy';

  constructor(private el: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && !changes['initialValue'].firstChange) {
      this.inputControl.setValue(this.convertInitialValue(), { emitEvent: false });
    }

    if ((changes['minDate'] || changes['maxDate']) && this.inputControl) {
      console.log('minDate');

      this.inputControl.setValidators([
        Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
        this.dateRangeValidator(this.minDate, this.maxDate),
      ]);
      this.inputControl.updateValueAndValidity();
    }
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
      // Định dạng số điện thoại Việt Nam: 10 số, bắt đầu bằng 0
      validators.push(Validators.pattern(/^0\d{9}$/));
    } else if (this.inputType === 'select') {
      // Nếu cần validate required cho select
      if (this.required) validators.push(Validators.required);
    }

    const initialValue = this.convertInitialValue();
    this.inputControl = new FormControl(initialValue, validators);

    if (this.inputType === 'date') {
      this.parseDateValue(initialValue);
      this.inputControl.valueChanges.subscribe((value) => {
        this.handleDateInput(value, false);
      });
    }

    this.updateIsEdited();
    this.inputControl.valueChanges.subscribe(() => {
      this.updateIsEdited();
      // this.validate();
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
    const value = this.inputControl.value;
    if (this.initialValue instanceof Date && value instanceof Date) {
      this.isEdited = value.getTime() !== this.initialValue.getTime();
    } else {
      this.isEdited = (value ?? '') !== (this.initialValue ?? '');
    }
    this.isEditedChange.emit(this.isEdited); // Emit ra ngoài
    this.validate();
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
    console.log('this.dateModelxxx');
    console.log(this.dateModel);
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
  }
  // Định dạng với placeholder
  private formatWithPlaceholders(value: string, isDelete: boolean): string {
    console.log('ggg' + value);

    let formatted = value.replace(/[^0-9]/g, '');
    console.log('formatted ' + formatted);

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
    // this.isEdited = true;
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
  private convertInitialValue(): string {
    if (this.inputType === 'date') {
      if (this.initialValue instanceof Date) {
        return this.isValidDate(this.initialValue) ? this.formatDate(this.initialValue) : '';
      }
      const strVal = String(this.initialValue ?? '');
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
    return String(this.initialValue ?? '');
  }

  // Định dạng ngày thành 'dd/MM/yyyy'
  private formatDate(date: Date): string {
    console.log('vao 1');

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
    this.showDatePicker = false;
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
    }

    // Emit trạng thái hợp lệ ra ngoài
    // this.validChange.emit(this.inputControl.valid);
    // Emit giá trị thực tế ra ngoài
    if (this.inputControl.valid) {
      this.valueChange.emit(this.inputControl.value);
      this.isEditedChange.emit(this.inputControl.value);
    }
  }

  // Xử lý sự kiện click icon calendar
  toggleDatePicker(): void {
    if (!this.showDatePicker) {
      // Khi mở date picker, đồng bộ dateModel với inputControl.value
      const value = this.inputControl.value;
      if (this.isValidDateString(value)) {
        const [day, month, year] = value.split('/').map(Number);
        this.dateModel = { day, month, year };
      } else {
        this.dateModel = null;
      }
    }
    this.showDatePicker = !this.showDatePicker;
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
    if (this.inputControl.invalid && this.inputControl) return 'border-danger';
    if (this.isEdited) return 'border-success';
    return '';
  }

  get inputClass(): string {
    return this.isEdited == true ? 'bg-warning' : '';
  }
}
