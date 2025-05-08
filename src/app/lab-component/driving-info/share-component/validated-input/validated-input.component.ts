import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { NgbDateStruct, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { BcaLicenseTypes } from '../../model/bca-license-types';
import {
  convertInitialValue,
  datePatternValidator,
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

/** Component  ValidatedInput dùng để check Validated, theo các định dạng
 * inputType: 'text' | 'date' | 'select' | 'phone' = 'text'
 * @Author thuan.bv
 * @Created 07/05/2025
 * @Modified date - user - description
 */
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

  /** nếu data type = Date , minDate check Validated */
  @Input() minDate: Date | null = null;

  /** nếu data type = Date  maxDate để check Validated */
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

  /** giá trị input */
  inputControl: FormControl;

  /** Lưu trạng thái isEdited */
  isEdited = false;

  /** errorMessage thông báo lỗi ra tooltip */
  errorMessage: string = '';

  /** biến lưu value nếu type = date */
  dateModel: { day: number; month: number; year: number } | null = null;

  /** placeholder nếu type = date */
  placeholder = 'dd/MM/yyyy';

  /** ViewChild của datepicker */
  @ViewChild('datePopover') datePopover!: NgbPopover;

  /** ViewChild của dateIcon để trả lại focus*/
  @ViewChild('dateIcon') dateIconRef!: ElementRef;

  /** ViewChild của input dùng xử lý con trỏ, khi nhập xóa ngày */
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  /** Set giá trị ban đầu của value- input
   * @Author thuan.bv
   * @Created 28/04/2025
   * @Modified date - user - description
   */

  writeValue(value: any): void {
    // Lưu giá trị ban đầu nếu lần đầu gọi
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

  /** Theo dõi sự thay đỗi cửa dữ liệu
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputType == 'date') {
      // Chuẩn hóa minDate, maxDate về null nếu không hợp lệ
      const safeMinDate = isValidDateInput(this.minDate) ? this.minDate : null;
      const safeMaxDate = isValidDateInput(this.maxDate) ? this.maxDate : null;

      if ((changes['minDate'] || changes['maxDate']) && this.inputControl) {
        const validators = [];
        if (this.required) validators.push(Validators.required);
        validators.push(datePatternValidator);
        validators.push(this.dateRangeValidator(safeMinDate, safeMaxDate));

        this.inputControl.setValidators(validators);
        setTimeout(() => {
          this.inputControl.updateValueAndValidity();
          this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
        });
      }
    }
    // trigger Lưu lại giá trị của input ban đầu
    if (changes['ngModel']) {
      this.fieldStatusChange.emit({ isEdited: this.isEdited, isValid: !this.inputControl.invalid });
      this.originalValue = changes['ngModel'].currentValue;
    }
    // trigger this.isEdited nếu người dùng đã lưu các thay đỗi
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
      validators.push(datePatternValidator);
      validators.push(this.dateRangeValidator(this.minDate, this.maxDate));
    } else if (this.inputType === 'phone') {
      validators.push(Validators.pattern(/^0\d{9}$/));
    }

    // KHỞI TẠO VỚI GIÁ TRỊ RỖNG, GIÁ TRỊ SẼ ĐƯỢC SET BỞI writeValue
    this.inputControl = new FormControl('', validators);

    // gọi hàm cập nhật trạng thái isEdit
    this.updateIsEdited();

    // Đăng ký theo dõi
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

    // Chuẩn hóa cho kiểu date: nếu rỗng/null/không hợp lệ thì về ''
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

  /** xử lý sự kiện người dùng nhập liệu với dataType = date
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

    const isCtrlOrMeta = event.ctrlKey || event.metaKey;
    const ctrlAllowed = ['a', 'c', 'v', 'x'];

    if (allowedKeys.includes(event.key) || (isCtrlOrMeta && ctrlAllowed.includes(event.key.toLowerCase()))) {
      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        this.insertDateDigit(event.key);
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        this.deleteDateDigit(event.key as 'Backspace' | 'Delete');
      }
      // Arrow keys/tab xử lý mặc định
    } else {
      event.preventDefault();
    }
  }

  /** xử lý khi người dùng nhập thêm ngày/tháng/ năm từ bàn phím
   * @param digit giá trị date
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  private insertDateDigit(digit: string): void {
    const input = this.inputElement.nativeElement as HTMLInputElement;
    const rawValue = this.inputControl.value || this.placeholder;
    let cursor = input.selectionStart ?? 0;

    // Bỏ qua nếu ngoài vùng cho phép
    if (cursor >= rawValue.length) return;

    // Bỏ qua dấu `/`
    while (cursor < rawValue.length && rawValue[cursor] === '/') {
      cursor++;
    }

    if (cursor >= rawValue.length) return;

    // Ghi đè ký tự tại vị trí con trỏ
    const chars = rawValue.split('');
    chars[cursor] = digit;
    const newValue = chars.join('');

    this.inputControl.setValue(newValue);

    // Di chuyển con trỏ tới vị trí tiếp theo, bỏ qua dấu `/`
    let nextCursor = cursor + 1;
    while (nextCursor < newValue.length && newValue[nextCursor] === '/') {
      nextCursor++;
    }

    // Đặt lại vị trí con trỏ
    setTimeout(() => input.setSelectionRange(nextCursor, nextCursor));
  }

  /** xử lý khi người dùng xóa ngày/tháng/ năm từ bàn phím
   * @param isBackspace phím isBackspace?
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

  private deleteDateDigit(key: 'Backspace' | 'Delete'): void {
    const input = this.inputElement.nativeElement as HTMLInputElement;
    const rawValue = this.inputControl.value || this.placeholder;

    let start = input.selectionStart ?? 0;
    let end = input.selectionEnd ?? 0;

    // Nếu có vùng chọn (bôi đen)
    if (start !== end) {
      const chars = rawValue.split('');
      for (let i = start; i < end; i++) {
        if (this.placeholder[i] && this.placeholder[i] !== '/' && rawValue[i] !== '/') {
          chars[i] = this.placeholder[i];
        }
      }
      const newValue = chars.join('');
      this.inputControl.setValue(newValue);
      setTimeout(() => input.setSelectionRange(start, start));
      return;
    }

    // Nếu không bôi đen (xóa 1 ký tự)
    let cursor = start;

    if (key === 'Backspace') {
      if (cursor === 0) return;
      cursor--;
    }

    // Bỏ qua dấu "/"
    while (cursor >= 0 && rawValue[cursor] === '/') {
      cursor += key === 'Backspace' ? -1 : 1;
    }

    if (cursor < 0 || cursor >= rawValue.length) return;

    const chars = rawValue.split('');
    chars[cursor] = this.placeholder[cursor];
    const newValue = chars.join('');

    this.inputControl.setValue(newValue);
    setTimeout(() => input.setSelectionRange(cursor, cursor));
  }

  /** Xử lý sự kiện keydown DataType = phone
   * @Author thuan.bv
   * @Created 26/04/2025
   * @Modified date - user - description
   */
  onPhoneKeydown(event: KeyboardEvent): void {
    if (this.inputType !== 'phone') return;
    //  Chỉ cho phép số, phím điều hướng, backspace, delete, tab
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

  onDateSelect(date: NgbDateStruct, datePopover: NgbPopover): void {
    const formattedDate = `${pad(date.day)}/${pad(date.month)}/${date.year}`;
    this.inputControl.setValue(formattedDate);

    if (datePopover?.isOpen()) {
      datePopover.close();
    }
    // Sau khi đóng, focus lại vào icon datepicker
    setTimeout(() => {
      this.dateIconRef?.nativeElement.focus();
    }, 0);
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

    // emit value ra ngoài nếu hợp lệ
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
      setTimeout(() => {
        // Tìm button ngày đầu tiên trong datepicker và focus vào đó
        const datepickerElem = document.querySelector('.ngb-dp-day[tabindex="0"]') as HTMLElement;
        if (datepickerElem) {
          datepickerElem.focus();
        }
      }, 0);

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
