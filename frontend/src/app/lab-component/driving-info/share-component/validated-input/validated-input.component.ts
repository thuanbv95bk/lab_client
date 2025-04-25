import { Component, Input, Output, EventEmitter, OnInit, ElementRef, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-validated-input',
  templateUrl: './validated-input.component.html',
  styleUrls: ['./validated-input.component.scss'],
})
export class ValidatedInputComponent implements OnInit {
  @Input() initialValue: Date | string | null = null;
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() inputType: 'text' | 'date' = 'text';
  @Output() valueChange = new EventEmitter<string | null>();

  inputControl: FormControl;
  isEdited = false;
  errorMessage: string = '';
  showDatePicker = false;
  dateModel: NgbDateStruct | null = null;
  private lastValue = '';
  placeholder = 'dd/MM/yyyy';

  constructor(private el: ElementRef) {}

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
    }

    const initialValue = this.convertInitialValue();
    this.inputControl = new FormControl(initialValue, validators);

    if (this.inputType === 'date') {
      this.parseDateValue(initialValue);
      this.inputControl.valueChanges.subscribe((value) => {
        this.handleDateInput(value, false);
      });
    }
  }
  // Xử lý nhập liệu và xóa cho trường date
  private handleDateInput(value: string, isDelete: boolean): void {
    if (!value) {
      this.inputControl.setValue(this.placeholder, { emitEvent: false });
      return;
    }
    console.log(value);

    // Xử lý xóa từng phần
    if (value === this.placeholder) return;

    let newValue = value.replace(/[^0-9dmyDMY]/g, '');

    // newValue = this.processDeletion(newValue);

    newValue = this.formatWithPlaceholders(newValue, isDelete);
    console.log(newValue);

    if (newValue !== this.lastValue) {
      this.inputControl.setValue(newValue, { emitEvent: false });
      this.lastValue = newValue;
      this.valueChange.emit(newValue === this.placeholder ? null : newValue);
    }
  }

  // Xử lý logic xóa từng ký tự
  private processDeletion(value: string): string {
    const parts = value.split('/');
    const cursorPosition = this.getCursorPosition();

    // Xử lý xóa từng phần theo vị trí con trỏ
    if (cursorPosition <= 2) parts[0] = this.processPartDeletion(parts[0], 2, 'd');
    else if (cursorPosition <= 5) parts[1] = this.processPartDeletion(parts[1], 2, 'M');
    else parts[2] = this.processPartDeletion(parts[2], 4, 'y');

    return parts.join('/');
  }

  private processPartDeletion(part: string, maxLength: number, placeholderChar: string): string {
    if (!part) return placeholderChar.repeat(maxLength);
    const newPart = part.slice(0, -1) + placeholderChar.repeat(maxLength - part.length + 1);
    return newPart.substring(0, maxLength);
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

  // Các phương thức hỗ trợ khác
  private getCursorPosition(): number {
    return (this.el.nativeElement.querySelector('input') as HTMLInputElement)?.selectionStart || 0;
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
    console.log('xxxxxxxxxxxxxxx');

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
  // Chuyển đổi giá trị ban đầu sang chuỗi
  private convertInitialValue(): string {
    if (this.inputType === 'date') {
      if (this.initialValue instanceof Date) {
        return this.isValidDate(this.initialValue) ? this.formatDate(this.initialValue) : '';
      }

      return this.isValidDateString(String(this.initialValue)) ? String(this.initialValue) : '';
    }

    return String(this.initialValue);
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

  // Xử lý nhập liệu thủ công cho date
  // private formatDateInput(value: string): void {
  //   let newValue = value.replace(/[^0-9]/g, '');
  //   if (newValue.length > 8) newValue = newValue.substring(0, 8);

  //   let formatted = '';
  //   for (let i = 0; i < newValue.length; i++) {
  //     if (i === 2 || i === 4) formatted += '/';
  //     formatted += newValue[i];
  //   }

  //   // Thêm placeholder cho phần chưa nhập
  //   const parts = formatted.split('/');
  //   if (parts[0]?.length < 2) parts[0] += 'DD'.substring(parts[0].length);
  //   if (parts[1]?.length < 2) parts[1] += 'MM'.substring(parts[1].length);
  //   if (parts[2]?.length < 4) parts[2] += 'YYYY'.substring(parts[2].length);

  //   formatted = parts.join('/');
  //   if (formatted !== this.lastValue) {
  //     this.inputControl.setValue(formatted, { emitEvent: false });
  //     this.lastValue = formatted;
  //   }
  // }

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
      this.errorMessage = 'Trường này không được để trống';
      return;
    }

    if (this.inputControl.invalid) {
      const errors = this.inputControl.errors;
      if (errors?.['minlength']) {
        this.errorMessage = `Tối thiểu ${this.minLength} ký tự`;
      } else if (errors?.['maxlength']) {
        this.errorMessage = `Tối đa ${this.maxLength} ký tự`;
      } else if (errors?.['pattern']) {
        this.errorMessage =
          this.inputType === 'text' ? 'Không được nhập ký tự < hoặc >' : 'Định dạng ngày phải là dd/MM/yyyy';
      } else if (this.inputType === 'date' && this.inputControl.value) {
        if (!this.isValidDateString(this.inputControl.value)) {
          this.errorMessage = 'Ngày không hợp lệ';
        }
      }
    }
  }

  // Xử lý sự kiện click icon calendar
  toggleDatePicker(): void {
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
    if (this.inputControl.invalid && this.inputControl.touched) return 'border-danger';
    if (this.isEdited) return 'border-success';
    return '';
  }

  get inputClass(): string {
    return this.isEdited ? 'bg-warning' : '';
  }
}
