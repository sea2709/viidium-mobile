import {Injectable} from '@angular/core';

@Injectable()
export class StringUtilities {
    substr(value: string, length = 50, addDots = true): string {
        if (value.length > length) {
            value = value.substr(0, length) + (addDots ? '...' : '');
        }
        return value;
    }

    formatNumberWithZeroAhead(value: number, length = 2): string {
        let strVal = String(value);
        if (strVal.length < length) {
            const strLen = strVal.length;
            for (let i = 0; i < length - strLen; i++) {
                strVal = '0' + strVal;
            }
        }

        return strVal;
    }
}

