import { Validators } from '@angular/forms';

// Pattern của kiểu date -> các ký hiệu số 0-9 < 31 "
export const datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);

/** Pattern của kiểu text -> các ký hiệu < > ' "*/
export const textPattern = Validators.pattern(/^[^<>'"]*$/);

/** Pattern của kiểu phone -> các ký hiệu  0-9 tối đa 10 số*/
export const phonePattern = Validators.pattern(/^0\d{9}$/);
