
import { set_tostringtag }              from './utils.js';

export class CustomError extends Error {
    static [Symbol.toPrimitive] ( hint ) {
        return hint === "number" ? null : `[${this.name} {}]`;
    }

    constructor( ...params ) {
        super( ...params );

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        this.name               = this.constructor.name;
    }

    [Symbol.toPrimitive] ( hint ) {
        return hint === "number" ? null : this.toString();
    }

    toString () {
        return `[${this.constructor.name}( ${this.message} )]`;
    }

    toJSON ( debug = false ) {
        return {
            "error":    this.name,
            "message":  this.message,
            "stack":    debug === true
                ? typeof this.stack === "string" ? this.stack.split("\n") : this.stack
                : undefined,
        };
    }
}
set_tostringtag( CustomError );

export class Warning extends CustomError {}
set_tostringtag( Warning, "Warning" );

export class HoloHashError extends CustomError {}
set_tostringtag( HoloHashError, "HoloHashError" );

export class NoLeadingUError extends HoloHashError {}
set_tostringtag( NoLeadingUError, "NoLeadingUError" );

export class BadBase64Error extends HoloHashError {}
set_tostringtag( BadBase64Error, "BadBase64Error" );

export class BadSizeError extends HoloHashError {}
set_tostringtag( BadSizeError, "BadSizeError" );

export class BadPrefixError extends HoloHashError {}
set_tostringtag( BadPrefixError, "BadPrefixError" );

export class BadChecksumError extends HoloHashError {}
set_tostringtag( BadChecksumError, "BadChecksumError" );
