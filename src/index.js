
const base64				= require('base-64');
const blake				= require('blakejs');
const { xor_digest }			= require('@whi/xor-digest');

const { BLANK_PREFIX,
	AGENT_PREFIX,
	ENTRY_PREFIX,
	NETID_PREFIX,
	DHTOP_PREFIX,
	HEADER_PREFIX,
	WASM_PREFIX,
	DNA_PREFIX }			= require('./constants.js');
const { HoloHashError,
	Warning,
	...HoloHashErrorTypes }		= require('./errors.js');
const {	NoLeadingUError,
	BadBase64Error,
	BadSizeError,
	BadPrefixError,
	BadChecksumError }		= HoloHashErrorTypes;
const { set_tostringtag }		= require('./utils.js');

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


function utf8str_to_bytes ( utf8str ) {
    return utf8str.split('').map(char => char.charCodeAt(0));
}
function bytes_to_utf8str ( bytes ) {
    let str				= "";
    bytes.map( n => {
	str			       += String.fromCharCode(n);
    });
    return str;
}


function bytes_to_b64 ( bytes ) {
    return base64.encode( bytes_to_utf8str( bytes )).replace(/=+$/, "");;
}
function b64_to_bytes ( b64 ) {
    return utf8str_to_bytes( base64.decode( b64 ));
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
    let hash				= blake.blake2b( bytes, null, 16 );
    return xor_digest( hash, 4 );
}


class HoloHash extends Uint8Array {
    constructor ( input, strict = true ) {
	debug && log("New construction input (strict: %s): %s", strict, String(input) );
	super(39);

	super.set( this.constructor.PREFIX || BLANK_PREFIX );

	if ( typeof input === "string" ) {
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


class AnyDhtHash extends HoloHash {
}
set_tostringtag( AnyDhtHash, "AnyDhtHash" );


class AgentPubKey extends AnyDhtHash {
    static PREFIX			= AGENT_PREFIX;
}
set_tostringtag( AgentPubKey, "AgentPubKey" );

class EntryHash extends AnyDhtHash {
    static PREFIX			= ENTRY_PREFIX;
}
set_tostringtag( EntryHash, "EntryHash" );

class NetIdHash extends HoloHash {
    static PREFIX			= NETID_PREFIX;
}
set_tostringtag( NetIdHash, "NetIdHash" );

class DhtOpHash extends HoloHash {
    static PREFIX			= DHTOP_PREFIX;
}
set_tostringtag( DhtOpHash, "DhtOpHash" );

class HeaderHash extends AnyDhtHash {
    static PREFIX			= HEADER_PREFIX;
}
set_tostringtag( HeaderHash, "HeaderHash" );

class WasmHash extends HoloHash {
    static PREFIX			= WASM_PREFIX;
}
set_tostringtag( WasmHash, "WasmHash" );

class DnaHash extends HoloHash {
    static PREFIX			= DNA_PREFIX;
}
set_tostringtag( DnaHash, "DnaHash" );


const HoloHashTypes			= {
    AgentPubKey,
    EntryHash,
    NetIdHash,
    DhtOpHash,
    HeaderHash,
    WasmHash,
    DnaHash,
};


let base_exports = {
    HoloHash,
    AnyDhtHash,
    ...HoloHashTypes,

    HoloHashError,
    Warning,
    ...HoloHashErrorTypes,

    "base64": {
	"url_encode": b64_url_encode,
	"url_decode": b64_url_decode,
    },
    logging () {
	debug				= true;
    },
};

module.exports = {
    bindNative() {
	if ( String.prototype.toHoloHash !== undefined )
	    throw new Error(`String.toHoloHash is already defined as type: ${typeof String.toHoloHash}`);

	Object.defineProperty(String.prototype, "toHoloHash", {
	    "value": function ( strict ) {
		return new HoloHash(String(this), strict);
	    },
	    "enumerable": false,
	    "writable": false,
	});

	return base_exports;
    },
    ...base_exports
};
