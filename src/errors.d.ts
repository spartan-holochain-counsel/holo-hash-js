export class CustomError extends Error {
    static [Symbol.toPrimitive](hint: any): string;
    constructor(...params: any[]);
    toJSON(debug?: boolean): {
        error: string;
        message: string;
        stack: string[];
    };
    [Symbol.toPrimitive](hint: any): string;
}
export class Warning extends CustomError {
}
export class HoloHashError extends CustomError {
}
export class NoLeadingUError extends HoloHashError {
}
export class BadBase64Error extends HoloHashError {
}
export class BadSizeError extends HoloHashError {
}
export class BadPrefixError extends HoloHashError {
}
export class BadChecksumError extends HoloHashError {
}
