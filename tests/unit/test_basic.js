const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const expect				= require('chai').expect;
const { HoloHash,
	AgentPubKey,
	...hashlib }			= require('../../src/index.js').bindNative();

if ( process.env.LOG_LEVEL )
    hashlib.logging();

let entryhash_39_bytes			= new Uint8Array([
    132,  33,  36, 130, 116, 237, 150,  68,
     72, 116, 128,  83, 221, 230, 142, 102,
    103, 244, 152, 130,  68,  40,  36,  61,
    114, 177,  81, 125, 147, 240,  83,  37,
    130, 223, 147, 135,  16,  31, 132
]);
let hash_32_bytes			= new Uint8Array([
    207,  39,   6,  42, 162,   2,  95, 176,
     73, 215,  86, 158, 133, 121,  16, 209,
    230, 217, 119, 208,  52, 155,  79,  31,
    250, 159,  28, 212, 252, 178, 226, 227
]);
let hash_36_bytes			= new Uint8Array([
    207,  39,   6,  42, 162,   2,  95, 176,
     73, 215,  86, 158, 133, 121,  16, 209,
    230, 217, 119, 208,  52, 155,  79,  31,
    250, 159,  28, 212, 252, 178, 226, 227,
     37,  53,  68,  20
]);
let hash_39_bytes			= new Uint8Array(
    [132, 32, 36].concat( [].slice.call(hash_32_bytes), [37, 53,  68,  20] )
);


function construction_tests () {
    it("should URL encode/decode base64 hash", async () => {
	let input			= "uhCAkzycGKqIC-7BJ11aehXkQ0ebZd9_0m08f-p8c1Pyy4uMlNUQ_";
	let hash			= hashlib.base64.url_decode( input );

	expect( hash			).to.equal("uhCAkzycGKqIC+7BJ11aehXkQ0ebZd9/0m08f+p8c1Pyy4uMlNUQ/");

	let url_safe_hash		= hashlib.base64.url_encode( hash );

	expect( url_safe_hash		).to.equal( input );
    });

    it("should create HoloHash instance from string", async () => {
	let hash			= new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

	expect( hash			).to.have.length( 39 );
	expect( hash			).to.be.an.instanceof( HoloHash );
	expect( hash			).to.be.an.instanceof( AgentPubKey );
	expect( hash			).to.be.a( "AgentPubKey" );
	expect( hash.getHash()	).to.deep.equal( hash_32_bytes );
    });

    it("should construct AgentPubKey from HoloHash", async () => {
	{
	    let hash			= new HoloHash("uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
	    hash			= new AgentPubKey( hash );

	    expect( hash		).to.be.an.instanceof( AgentPubKey );
	    expect( hash		).to.be.a( "AgentPubKey" );
	    expect( hash.toBytes()	).to.have.length( 39 );
	    expect( hash.toBytes()	).to.deep.equal( hash_39_bytes );
	}

	{
	    let hash			= new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
	    hash			= new AgentPubKey( hash );

	    expect( hash.toBytes()	).to.have.length( 39 );
	    expect( hash.toBytes()	).to.deep.equal( hash_39_bytes );
	}
    });

    it("should create HoloHash instance from 32 bytes", async () => {
	let hash			= new HoloHash( hash_32_bytes );

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
    });

    it("should create HoloHash instance from 36 bytes", async () => {
	let hash			= new HoloHash( hash_36_bytes );

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
	expect( String(hash)		).to.equal("uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
    });

    it("should create HoloHash instance from 39 bytes", async () => {
	let hash			= new HoloHash( hash_39_bytes );

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
    });

    it("should create HoloHash instance via native binding", async () => {
	let hash			= "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
    });

    it("should create HoloHash instance via url-safe-base64 39-bytes", async () => {
	let hash			= "hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash( false );

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
    });

    it("should create HoloHash instance via url-safe-base64 36-bytes", async () => {
	let hash			= "zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
    });

    it("should create HoloHash instance via url-safe-base64 32-bytes", async () => {
	let hash			= "zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uM".toHoloHash();

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
    });

    it("should have proper inheritance", async () => {
	let hash			= "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();

	expect( hash			).to.be.an.instanceof( HoloHash );
	expect( hash			).to.be.an.instanceof( hashlib.AnyDhtHash );
	expect( hash			).to.be.an.instanceof( AgentPubKey );
	expect( hash			).to.not.be.an.instanceof( hashlib.EntryHash );
    });

    it("should create HoloHash instance from 39-byte Buffer", async () => {
	let hash			= new HoloHash( Buffer.from(hash_39_bytes) );

	expect( hash			).to.have.length( 39 );
	expect( hash.getHash()		).to.deep.equal( hash_32_bytes );
	expect( hash			).to.be.an.instanceof( AgentPubKey );
    });
}

function api_tests () {
    it("should get prefix bytes", async () => {
	let hash			= new AgentPubKey("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

	expect( hash.getPrefix()	).to.deep.equal( hash_39_bytes.slice(0,3) );
	expect( hash.getPrefixB64()	).to.equal("uhCAk");
	expect( hash.getPrefixB64(false)).to.equal("hCAk");
    });

    it("should get hash bytes", async () => {
	let hash_str			= "uhCEkgnTtlkRIdIBT3eaOZmf0mIJEKCQ9crFRfZPwUyWC35OHEB-E";
	let hash			= hash_str.toHoloHash();

	expect( hash.getHash()		).to.deep.equal( entryhash_39_bytes.slice(3,-4) );
	expect( () => hash.getHashB64()	).to.throw( hashlib.Warning );
	expect( hash.getHashB64( true )	).to.not.equal( hash_str.slice(5,-5) );
	expect( hash.getHashB64( true )	).to.equal("gnTtlkRIdIBT3eaOZmf0mIJEKCQ9crFRfZPwUyWC35M");
    });

    it("should get DHT address bytes", async () => {
	let hash			= "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();

	expect( hash.getDHTAddress()		).to.deep.equal( hash_36_bytes.slice(-4) );
	expect( () => hash.getDHTAddressB64()	).to.throw( hashlib.Warning );
	expect( hash.getDHTAddressB64( true )	).to.equal("JTVEFA");
    });

    it("should get DHT address as u32 location", async () => {
	let hash			= "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();

	expect( hash.getDHTLocation()	).to.equal( 624247828 );
    });

    it("should get string representation of HoloHash", async () => {
	let input			= "uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU";
	let hash			= new HoloHash(input);

	expect( String(hash)		).to.equal( input );
    });

    it("should retype HoloHash to AgentPubKey", async () => {
	let hash			= new HoloHash("uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
	let agent			= hash.toType("EntryHash");

	expect( agent			).to.be.an.instanceof( hashlib.EntryHash );
	expect( agent			).to.be.an( "EntryHash" );
    });

    it("should retype AgentPubKey to EntryHash", async () => {
	let hash			= new AgentPubKey("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
	let entry			= hash.toType("EntryHash");

	expect( entry			).to.be.an.instanceof( hashlib.EntryHash );
	expect( entry			).to.be.an( "EntryHash" );
    });

    it("should get HoloHash type class", async () => {
	let hash			= new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

	expect( hash.hashType()		).to.equal( AgentPubKey );
    });
}

function errors_tests () {
    let agent_id			= "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU";

    it("should throw error for .set()", async () => {
	expect(() => {
	    (new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU")).set();
	}).to.throw(Error);
    });

    it("should throw error for .slice()", async () => {
	expect(() => {
	    (new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU")).slice();
	}).to.throw(Error);
    });

    it("should throw error because string input is missing 'u' prefix", async () => {
	expect(() => {
	    new HoloHash("hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
	}).to.throw(hashlib.NoLeadingUError);

	expect(() => {
	    new HoloHash("hCAkvBG5BisJxgMvsDayVIuJHQwvCfsr2WoxMGpZ+kEgHu+SJRU1\n");
	}).to.throw(hashlib.NoLeadingUError);
    });

    it("should throw error because invalid base64", async () => {
	expect(() => {
	    new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUe?");
	}).to.throw(hashlib.BadBase64Error);
    });

    it("should throw error because invalid prefix", async () => {
	expect(() => {
	    new HoloHash("uhC__zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeU");
	}).to.throw(hashlib.BadPrefixError);
    });

    it("should throw error because of invalid byte size", async () => {
	expect(() => {
	    new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeUaa");
	}).to.throw(hashlib.BadSizeError);

	expect(() => {
	    new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeUnaaa");
	}).to.throw(hashlib.BadSizeError);
    });

    it("should throw error because DHT address doesn't match", async () => {
	expect(() => {
	    new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeU");
	}).to.throw(hashlib.BadChecksumError);
    });

    it("should not throw error because strict mode is off", async () => {
	expect(() => {
	    new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeU", false);
	}).to.not.throw(hashlib.BadChecksumError);
    });

    it("should throw because of invalid input", async () => {
	let invalid_input		= 3829839;

	expect(() => {
	    new HoloHash(invalid_input);
	}).to.throw(Error, "Invalid HoloHash input");
    });

    it("should throw because of invalid array values", async () => {
	let invalid_input		= [].slice.call( hash_32_bytes );

	expect(() => {
	    new HoloHash(invalid_input);
	}).to.throw(Error, "Invalid HoloHash input");
    });
}

describe("Holo Hash", () => {

    describe("Construction", construction_tests );
    describe("API", api_tests );
    describe("Errors", errors_tests );

});
