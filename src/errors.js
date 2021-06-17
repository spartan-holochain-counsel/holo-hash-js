
const { set_tostringtag }		= require('./utils.js');

class CustomError extends Error {
    static [Symbol.toPrimitive] ( hint ) {
	return hint === "number" ? null : `[${this.name} {}]`;
    }

    constructor( ...params ) {
	super( ...params );

	if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.constructor);
	}

	this.name		= this.constructor.name;
    }

    [Symbol.toPrimitive] ( hint ) {
	return hint === "number" ? null : this.toString();
    }

    toString () {
	return `[${this.constructor.name}( ${this.message} )]`;
    }

    toJSON ( debug = false ) {
	return {
	    "error":	this.name,
	    "message":	this.message,
	    "stack":	debug === true
		? typeof this.stack === "string" ? this.stack.split("\n") : this.stack
		: undefined,
	};
    }
}
set_tostringtag( CustomError );

class Warning extends CustomError {}
set_tostringtag( Warning );

class HoloHashError extends CustomError {}
set_tostringtag( HoloHashError );

class NoLeadingUError extends HoloHashError {}
set_tostringtag( NoLeadingUError );

class BadBase64Error extends HoloHashError {}
set_tostringtag( BadBase64Error );

class BadSizeError extends HoloHashError {}
set_tostringtag( BadSizeError );

class BadPrefixError extends HoloHashError {}
set_tostringtag( BadPrefixError );

class BadChecksumError extends HoloHashError {}
set_tostringtag( BadChecksumError );

module.exports = {
    HoloHashError,
    Warning,

    NoLeadingUError,
    BadBase64Error,
    BadSizeError,
    BadPrefixError,
    BadChecksumError,
};
