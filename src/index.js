
import xordigestlib				from '@whi/xor-digest';
const { xor_digest }				= xordigestlib;

import { blake2b }				from './blake2b.js';
import {
    BLANK_PREFIX,
    AGENT_PREFIX,
    ENTRY_PREFIX,
    NETID_PREFIX,
    DHTOP_PREFIX,
    ACTION_PREFIX,
    WASM_PREFIX,
    DNA_PREFIX,
}					from './constants.js';
import {
    Warning,
    HoloHashError,
    NoLeadingUError,
    BadBase64Error,
    BadSizeError,
    BadPrefixError,
    BadChecksumError,
}					from './errors.js';
import { set_tostringtag }		from './utils.js';

const IS_NODE				= (new Function("try {return this===global;}catch(e){return false;}"))();
const VALID_B64				= new RegExp("^[A-Za-z0-9+/]+={0,3}$");

let debug				= false;

function log ( msg, ...args ) {
    let datetime			= (new Date()).toISOString();
    console.log(`${datetime} [ src/index. ]  INFO: ${msg}`, ...args );
}



function b64_url_encode ( b64 ) {
    debug && log("Encode URL-safe base64:", b64.constructor.name, b64.length );
    return b64.replace(/[+/]/g, v => v === "+" ? "-" : "_");
}
function b64_url_decode ( b64 ) {
    debug && log("Decode URL-safe base64:", b64 );
    return b64.replace(/[-_]/g, v => v === "-" ? "+" : "/");
}


function bytes_to_b64 ( bytes ) {
    return (
	IS_NODE
	    ? Buffer.from(bytes).toString("base64")
	    : btoa( String.fromCharCode.apply(null, bytes) )
    ).replace(/=+$/, "");
}
function b64_to_bytes ( b64 ) {
    if ( VALID_B64.test( b64 ) === false )
	throw new TypeError(`Invalid base64 character(s) in '${b64}'`);

    return IS_NODE
	? Buffer.from(b64, "base64")
	: [].reduce.call( atob(b64), (acc, v, i) => {
	    acc[i] = v.charCodeAt(0);
	    return acc;
	}, new Uint8Array(39) );
}


function bytes_to_urlsafeb64 ( bytes ) {
    debug && log("Encoding URL-safe base64 hash:", typeof bytes, bytes.length );

    return b64_url_encode( bytes_to_b64( bytes ) );
}

function urlsafeb64_to_bytes ( str ) {
    debug && log("Decoding URL-safe base64 hash:", str );

    if ( str.startsWith('u') )
	str				= str.slice(1);

    return b64_to_bytes(  b64_url_decode( str ) );
}


function calculate_dht_address ( bytes ) {
    debug && log("Calculate DHT address from %s bytes", bytes.length );
    let hash				= blake2b( bytes, null, 16 );
    return xor_digest( hash, 4 );
}


export class HoloHash extends Uint8Array {
    constructor ( input, strict = true ) {
	debug && log("New construction input (strict: %s): %s", strict, String(input) );
	super(39);

	super.set( this.constructor.PREFIX || BLANK_PREFIX );

	if ( typeof input === "string" ) {
	    input			= input.trim();

	    if ( strict === true && input.length === 52 && input.startsWith('hC') )
		throw new NoLeadingUError(`Holo Hash missing 'u' prefix: ${input}`);

	    if ( input.length === 53 && input.startsWith('u') )
		input			= input.slice(1);

	    try {
		input			= new Uint8Array( urlsafeb64_to_bytes( input ) );
	    } catch ( err ) {
		debug && log("Failed to decode base64:", err );
		throw new BadBase64Error(`Failed to decode base64 input (${input})`);
	    }
	    debug && log("Decoded base64 bytes: %s", input.length );
	}

	if ( !(input instanceof Uint8Array) )
	    throw new TypeError(`Invalid HoloHash input: typeof ${typeof input}; expected string or Uint8Array`);
	else if ( input.constructor.name !== "Uint8Array" )
	    input			= new Uint8Array(input);

	if ( input instanceof HoloHash ) {
	    debug && log("Convert instance of HoloHash to Uint8Array bytes: %s", input.constructor.name );
	    input			= input.bytes();
	}

	let given_dht_addr;
	if ( input.length === 36 ) {
	    given_dht_addr		= input.slice(-4);
	    input			= input.slice(0,-4);
	}
	else if ( input.length === 39 ) {
	    let given_prefix		= input.slice(0,3);

	    if ( String(given_prefix) === String(this.constructor.PREFIX)
		 || String(BLANK_PREFIX) === String(given_prefix) ) {
		given_dht_addr		= input.slice(-4);
		input			= input.slice(3,-4);
	    }
	    else {
		debug && log("Check if constructor is agnostic type: %s === %s", this.constructor.name, HoloHash.name );
		if ( this.constructor.name === HoloHash.name ) {
		    for (let type of Object.values( HoloHashTypes )) {
			if ( String(type.PREFIX) === String(given_prefix) )
			    return new type(input.slice(3), strict );
		    };
		}

		throw new BadPrefixError(`Hash prefix did not match any HoloHash types: ${given_prefix}`);
	    }
	}

	if ( input.length !== 32 )
	    throw new BadSizeError(`Invalid input byte length (${input.length}); expected length 39, 36, or 32`);

	let dht_addr			= calculate_dht_address( input );

	if ( strict === true && given_dht_addr !== undefined ) {
	    debug && log("Comparing DHT addresses given/calc:", given_dht_addr, dht_addr );
	    if ( String(given_dht_addr) !== String(dht_addr) )
		throw new BadChecksumError(`Given DHT address (${given_dht_addr}) does not match calculated address: ${dht_addr}`);
	}

	super.set( input, 3 );
	super.set( dht_addr, 35 );

	Object.defineProperties(this, {
	    "prefix": {
		value: new Uint8Array(this.buffer, 0, 3),
		writable: false,
		enumerable: false,
		configurable: false,
	    },
	    "dht_address": {
		value: new DataView(this.buffer, 35),
		writable: false,
		enumerable: false,
		configurable: false,
	    },
	});
    }

    set () {
	throw new Error(`You should not be manually modifying HoloHash bytes`);
    }

    slice () {
	throw new Error(`HoloHash is not intended to by sliced; use <HoloHash>.bytes() to get Uint8Array slices`);
    }

    bytes ( start, end ) {
	let length;

	if ( end !== undefined ) {
	    length			= end < 0
		? this.buffer.byteLength - start + end
		: end - start;
	}
	if ( start !== undefined && start < 0 ) {
	    start			= this.buffer.byteLength + start;
	}

	return new Uint8Array(this.buffer, start, length );
    }

    getPrefix () {
	return this.bytes(0,3);
    }

    getPrefixB64 ( with_leading_u = true ) {
	return ( with_leading_u === true ? "u" : "" ) + bytes_to_urlsafeb64( this.getPrefix() );
    }

    getHash () {
	return this.bytes(3, -4);
    }

    getHashB64 ( force = false ) {
	if ( force !== true )
	    throw new Warning(`A base64 representation of the DHT Address MIGHT not match the base64 from the full hash string.`);

	return bytes_to_urlsafeb64( this.getHash() );
    }

    getDHTAddress () {
	return this.bytes(-4);
    }

    getDHTAddressB64 ( force = false ) {
	if ( force !== true )
	    throw new Warning(`A base64 representation of the DHT Address WILL NOT match the base64 from the full hash string.`);

	return bytes_to_urlsafeb64( this.getDHTAddress() );
    }

    getDHTLocation () {
	return this.dht_address.getUint32();
    }

    toBytes () {
	return this.bytes();
    }

    toString () {
	return "u" + bytes_to_urlsafeb64( this.bytes() );
    }

    toJSON () {
	return this.toString();
    }

    toType ( type ) {
	if ( HoloHashTypes[type] === undefined )
	    throw new Error(`Invalid HoloHash type (${type}); must be one of: ${Object.keys(HoloHashTypes)}`);

	debug && log("Retype (%s) to (%s)", this.constructor.name, type );
	return new HoloHashTypes[type](this.bytes(3));
    }

    retype (...args) {
	return this.toType(...args);
    }

    hashType () {
	return this.constructor;
    }
}
set_tostringtag( HoloHash, "HoloHash" );


export class AnyDhtHash extends HoloHash {
}
set_tostringtag( AnyDhtHash, "AnyDhtHash" );


export class AgentPubKey extends AnyDhtHash {
    static PREFIX			= AGENT_PREFIX;
}
set_tostringtag( AgentPubKey, "AgentPubKey" );

export class EntryHash extends AnyDhtHash {
    static PREFIX			= ENTRY_PREFIX;
}
set_tostringtag( EntryHash, "EntryHash" );

export class NetIdHash extends HoloHash {
    static PREFIX			= NETID_PREFIX;
}
set_tostringtag( NetIdHash, "NetIdHash" );

export class DhtOpHash extends HoloHash {
    static PREFIX			= DHTOP_PREFIX;
}
set_tostringtag( DhtOpHash, "DhtOpHash" );

export class ActionHash extends AnyDhtHash {
    static PREFIX			= ACTION_PREFIX;
}
set_tostringtag( ActionHash, "ActionHash" );

export class DnaWasmHash extends HoloHash {
    static PREFIX			= WASM_PREFIX;
}
set_tostringtag( DnaWasmHash, "DnaWasmHash" );

export class DnaHash extends HoloHash {
    static PREFIX			= DNA_PREFIX;
}
set_tostringtag( DnaHash, "DnaHash" );


export const HoloHashTypes		= {
    AgentPubKey,
    EntryHash,
    NetIdHash,
    DhtOpHash,
    ActionHash,
    DnaWasmHash,
    DnaHash,
};

export const base64			= {
    "encode": bytes_to_b64,
    "decode": b64_to_bytes,
    "url_encode": b64_url_encode,
    "url_decode": b64_url_decode,
};

export function bindNative() {
    if ( String.prototype.toHoloHash !== undefined )
	throw new Error(`String.toHoloHash is already defined as type: ${typeof String.toHoloHash}`);

    Object.defineProperty(String.prototype, "toHoloHash", {
	"value": function ( strict ) {
	    return new HoloHash(String(this), strict);
	},
	"enumerable": false,
	"writable": false,
    });
}

export function logging () {
    debug				= true;
}

export {
    Warning,
    HoloHashError,
    NoLeadingUError,
    BadBase64Error,
    BadSizeError,
    BadPrefixError,
    BadChecksumError,
};

export default {
    HoloHash,
    HoloHashTypes,
    AnyDhtHash,

    AgentPubKey,
    EntryHash,
    NetIdHash,
    DhtOpHash,
    ActionHash,
    DnaWasmHash,
    DnaHash,

    Warning,
    HoloHashError,
    NoLeadingUError,
    BadBase64Error,
    BadSizeError,
    BadPrefixError,
    BadChecksumError,

    logging,
    base64,
    bindNative,
};
