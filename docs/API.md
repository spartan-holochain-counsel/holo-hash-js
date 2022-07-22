[back to README.md](../README.md)

# API Reference

### Module exports
```javascript
{
    HoloHash,
    AnyDhtHash,

    // HoloHash types
    AgentPubKey,
    EntryHash,
    NetIdHash,
    DhtOpHash,
    HeaderHash,
    DnaWasmHash,
    DnaHash,

    // Error classes
    HoloHashError,
    Warning,

    // HoloHashError types,
    NoLeadingUError,
    BadBase64Error,
    BadSizeError,
    BadPrefixError,
    BadChecksumError,
}
```

## `bindNative()`
Attempts to define `HoloHash` on the native `Object` properties.  Returns the module exports so that
this can be called on the same line as `require`.

Example
```javascript
const { HoloHash } = require('@whi/holo-hash').bindNative();

let hash = "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();
```

## `new HoloHash( input, strict = true )`
A `HoloHash` is always a 39-byte `Uint8Array`.  If no Holo Hash prefix is given, a "blank" prefix is
used (eg. `hC--`).

#### Strict Mode

- String inputs must contain the leading `u`; otherwise, the `NoLeadingUError` is thrown
- DHT address from input must match the calculated DHT address; otherwise, the `BadChecksumError` is
  thrown

### Constructor options

Supported inputs are:

- `Uint8Array(39)` - full Holo Hash bytes
- `Uint8Array(36)` - hash digest + DHT address
- `Uint8Array(32)` - hash digest
- 53-char `string` - full Holo Hash string representation
- 52-char `string` - base64 encoded (prefix + hash digest + DHT address) *strict mode must be disabled*
- 48-char `string` - base64 encoded (hash digest + DHT address)
- 43-char `string` - base64 encoded (hash digest)

#### Example from 39-byte `Uint8Array`
Based on the given prefix, this will return an instance of the corresponding `HoloHashType` instead
of the `HoloHash` instance.

```javascript
let hash = new HoloHash(new Uint8Array([
    132,  33,  36, 130, 116, 237, 150,  68,
     72, 116, 128,  83, 221, 230, 142, 102,
    103, 244, 152, 130,  68,  40,  36,  61,
    114, 177,  81, 125, 147, 240,  83,  37,
    130, 223, 147, 135,  16,  31, 132
]));

hash.constructor.name;
// "EntryHash"

hash.toString();
// "uhCEkgnTtlkRIdIBT3eaOZmf0mIJEKCQ9crFRfZPwUyWC35OHEB-E"
```

#### Example from 36-byte `Uint8Array`
Will be assigned the 'blank' prefix (`uhC--`).

```javascript
let hash = new HoloHash(new Uint8Array([
    207,  39,   6,  42, 162,   2,  95, 176,
     73, 215,  86, 158, 133, 121,  16, 209,
    230, 217, 119, 208,  52, 155,  79,  31,
    250, 159,  28, 212, 252, 178, 226, 227,
     37,  53,  68,  20
]));

hash.constructor.name;
// "HoloHash"

hash.toString();
// "uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"
```

#### Example from 32-byte `Uint8Array`
Will be assigned the 'blank' prefix (`uhC--`).

```javascript
let hash = new HoloHash(new Uint8Array([
    207,  39,   6,  42, 162,   2,  95, 176,
     73, 215,  86, 158, 133, 121,  16, 209,
    230, 217, 119, 208,  52, 155,  79,  31,
    250, 159,  28, 212, 252, 178, 226, 227
]));

hash.constructor.name;
// "HoloHash"

hash.toString();
// "uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"
```

#### Example from a full Holo Hash string representation

```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.constructor.name;
// "AgentPubKey"
```

#### Example from a base64 encoded 39-byte (prefix + hash digest + DHT address)
By default, `strict` mode is on and will throw the `NoLeadingUError`.  `strict` mode must be
disabled to avoid throwing the error.

> **Warning:** disabling `strict` mode will also disable the checksum error.

```javascript
let hash = new HoloHash("hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU", false );

hash.constructor.name;
// "AgentPubKey"
```

#### Example from a base64 encoded 36-byte (hash digest + DHT address)
Same behavior as the 36-byte `Uint8Array` input

```javascript
let hash = new HoloHash("zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.constructor.name;
// "HoloHash"

hash.toString();
// "uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"
```

#### Example from a base64 encoded 32-byte (hash digest)
Same behavior as the 32-byte `Uint8Array` input

```javascript
let hash = new HoloHash("zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uM");

hash.constructor.name;
// "HoloHash"

hash.toString();
// "uhC--zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"
```


### `<HoloHash>.set() -> throw`
Will throw `Error` because Holo Hash's should not be modified.

Example
```javascript
Error: You should not be manually modifying HoloHash bytes
    at AgentPubKey.set
```

### `<HoloHash>.slice() -> throw`
Will throw `Error` because an instance of `HoloHash` must always be 39 bytes.  Use
`<HoloHash>.bytes()` to get `Uint8Array` slices if needed.

Example
```javascript
Error: HoloHash is not intended to by sliced; use <HoloHash>.bytes() to get Uint8Array slices
    at AgentPubKey.slice
```

### `<HoloHash>.bytes( start, end ) -> Uint8Array(0..39)`
Works just like `TypedArray.slice` except it always returns a `Uint8Array` instead of the current
object's constructor class.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.slice(-4);
// Uint8Array(4) [ 37, 53, 68, 20 ]
```

### `<HoloHash>.getPrefix() -> Uint8Array(3)`
Returns the first 3 bytes which represent the Holo Hast type.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.getPrefix();
// Uint8Array(3) [ 132, 32, 36 ]
```

### `<HoloHash>.getPrefixB64( with_leading_u = true ) -> String`
Returns the URL-safe base64 representation of the Holo Hash prefix (includes the leading `u` by
default).

- `with_leading_u` - when `false`, returns string without the leading `u`

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.getPrefixB64();
// "uhCAk"

hash.getPrefixB64( false );
// "hCAk"
```

### `<HoloHash>.getHash() -> Uint8Array(32)`
Returns the 32-byte hash digest without the prefix or DHT address bytes.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.getHash();
// Uint8Array(32) [
//   207,  39,   6,  42, 162,   2,  95, 176,
//    73, 215,  86, 158, 133, 121,  16, 209,
//   230, 217, 119, 208,  52, 155,  79,  31,
//   250, 159,  28, 212, 252, 178, 226, 227
//  ]
```

### `<HoloHash>.getHashB64( force = false ) -> String`
By default, this will throw a `Warning` because the string encoding of these 32 bytes on their own
might not match the full hash's string representation.  See [Base64 Encoding
Subtleties](#base64-encoding-subtleties)

When `force === true`, it returns the URL-safe base64 representation of the 32-byte hash digest.

Example
```javascript
let hash = new HoloHash("uhCEkgnTtlkRIdIBT3eaOZmf0mIJEKCQ9crFRfZPwUyWC35OHEB-E");

hash.getHashB64();
// [Warning( A base64 representation of the DHT Address MIGHT not match the base64 from the full hash string. )]
//    at EntryHash.getHashB64

hash.getHashB64( true );
// "gnTtlkRIdIBT3eaOZmf0mIJEKCQ9crFRfZPwUyWC35M" (notice difference? '...35O' !== '...35M')
```

### `<HoloHash>.getDHTAddress() -> Uint8Array(4)`
Returns the last 4 bytes which represent the DHT address.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.getDHTAddress();
// Uint8Array(4) [ 37, 53, 68, 20 ]
```

### `<HoloHash>.getDHTAddressB64( force = false ) -> throw`
By default, this will throw a `Warning` because the string encoding of these 4 bytes on their own
will not match the full hash's string representation.  See [Base64 Encoding
Subtleties](#base64-encoding-subtleties)

When `force === true`, it returns the last URL-safe base64 representation of the last 4-byte DHT
address.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.getDHTAddressB64();
// [Warning( A base64 representation of the DHT Address MIGHT not match the base64 from the full hash string. )]
//    at EntryHash.getHashB64

hash.getDHTAddressB64( true );
// "JTVEFA"
```

### `<HoloHash>.getDHTLocation() -> Number`
Returns the `Uint32` value of the 4-byte DHT address.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.getDHTLocation();
// 624247828
```

### `<HoloHash>.toString() -> String`
Returns the URL-safe base64 value of the full 39-byte `HoloHash`.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.toString();
// "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"

String(hash);
// "uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"
```

### `<HoloHash>.toBytes() -> Uint8Array(39)`
Alias for `<HoloHash>.bytes()`

### `<HoloHash>.toType( type ) -> new <HoloHashType>`
Returns the the same 36-byte hash + DHT as an instance of the given type with the new corresponding
prefix.

Throws an `Error` if `type` does not match any of the Holo Hash Type class names.

Example
```javascript
let agent = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
// AgentPubKey(39) [ 132,  32,  36, ... ]

let entry = hash.toType("EntryHash");
// EntryHash(39) [ 132,  33,  36, ... ]

String(entry)
// "uhCEkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU"

hash.toType("Invalid");
// Error: Invalid HoloHash type (BadClassName); must be one of: AgentPubKey,EntryHash,NetIdHash,DhtOpHash,HeaderHash,DnaWasmHash,DnaHash
//    at AgentPubKey.toType
```

### `<HoloHash>.retype(...) -> new <HoloHashType>`
Alias for `<HoloHash>.toType(...)`

### `<HoloHash>.hashType() -> <HoloHashType>`
Returns the constructor class of the current HoloHash instance.

Example
```javascript
let hash = new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");

hash.hashType();
// [class AgentPubKey extends AnyDhtHash] { PREFIX: [ 132, 32, 36 ] }
```

## Failure modes

### `NoLeadingUError`
This error will occur when constructing from a [full Holo Hash string
representation](#example-from-a-full-holo-hash-string-representation) that is missing the leading
`u` character.

Example
```javascript
new HoloHash("hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
// [NoLeadingUError( Holo Hash missing 'u' prefix: hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU )]
//     at new HoloHash
```

### `BadBase64Error`
This error will occur when constructing from a string and it contains invalid base64 characters.

Example
```javascript
new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUe?");
// [BadBase64Error( Failed to decode base64 input (hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUe?) )]
//     at new HoloHash
```

### `BadPrefixError`
This error will occur when the given 3-byte prefix does not match any of the Holo Hash Type's
prefixes.

Example
```javascript
new HoloHash("uhC__zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeU");
// [BadPrefixError( Hash prefix did not match any HoloHash types: 132,47,255 )]
//     at new HoloHash
```

### `BadSizeError`
This error will occur when the input length does not match one of the supported sizes.

Example
```javascript
new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeUaa");
// [BadSizeError( Invalid input byte length (40); expected length 39, 36, or 32 )]
//     at new HoloHash
```

### `BadChecksumError`
This error will occur when the input included a DHT address portion, but it does not match the
calculated DHT address from the given hash digest.

Example
```javascript
new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUeU");
// [BadChecksumError( Given DHT address (37,53,71,148) does not match calculated address: 37,53,68,20 )]
//     at new HoloHash
```


## Base64 Encoding Subtleties
Since each base64 character only represents 6 bits, only byte arrays divisible by 3 will form a
rounded base64 string.  Furthermore, because base64 is encoded from left to right, counting 3-byte
sets must start from the left side of any byte array.

Our Holo Hash prefix is the farthest left bytes, but it is divisible by 3; so when it is not present
the following bytes will have the same base64 encoding.

However, the next section is our 32-byte hash digest which is not divisible by 3.  This means that
the farthest right base64 character will have 4 bits required by our 32-byte hash and 2 bits that
are thrown away. Unless there are more bytes such as our DHT address.  In that case, the 2 bits are
used by the following bytes.  Now there are 2 portions of encoded data that are sharing the same
base64 character

In conclusion, this means:

- We cannot parse the DHT address from spliting the base64 string.
- There's no way to base64 encode the DHT address so that it matches the full encoding.
- An encoded hash digest could have several base64 characters that will result in the same bytes.

[Read more about Base64](https://en.wikipedia.org/wiki/Base64)
