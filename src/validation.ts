import { AbstractControl, ValidationErrors } from '@angular/forms';

type NumberValidationErrorKeys = 'negative' | 'isNaN' | 'negativeOrZero';

type NumberValidationErrors = Partial<{ [k in NumberValidationErrorKeys]: boolean }> | null;

export function positiveNumber(c: AbstractControl): NumberValidationErrors {
    const value = c.value;
    if (!value) {
        return null;
    }

    const numberValue = Number(value);
    if (isNaN(numberValue)) {
        return { isNaN: true };
    }

    if (numberValue <= 0) {
        return { negativeOrZero: true };
    }
}

export function nonnegativeNumber(c: AbstractControl): NumberValidationErrors {
    const value = c.value;
    if (!value) {
        return null;
    }

    const numberValue = Number(value);
    if (isNaN(numberValue)) {
        return { isNaN: true };
    }

    if (numberValue < 0) {
        return { negative: true };
    }
}
