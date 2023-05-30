export function bindNative(): void;
export function logging(): void;
/**
 * @class
 * @extends Uint8Array
 * @classdesc Represents a HoloHash.
 */
export class HoloHash extends Uint8Array {
    /**
     * @constructor
     * @param {string|Uint8Array} input - The input value.
     * @param {boolean} [strict=true] - If true, apply strict validation to the input
     */
    constructor(input: string | Uint8Array, strict?: boolean);
    /**
     * The set method is not allowed for this class.
     * @method
     * @throws {Error} - Throws an error indicating not to modify HoloHash bytes manually.
     */
    set(): void;
    /**
     * The slice method is not allowed for this class.
     * @method
     * @throws {Error} - Throws an error indicating that HoloHash is not intended to be sliced.
     */
    slice(): void;
    /**
     * Get a Uint8Array slice from the current instance.
     * @method
     * @param {number} [start] - The start index.
     * @param {number} [end] - The end index.
     * @returns {Uint8Array} - A new Uint8Array instance.
     */
    bytes(start?: number, end?: number): Uint8Array;
    /**
     * @method
     * @returns {Uint8Array} - The prefix bytes.
     */
    getPrefix(): Uint8Array;
    /**
     * Get the base64 representation of the prefix.
     * @param {boolean} [with_leading_u=true] - Whether to include the leading 'u'.
     * @returns {string} - The base64 representation of the prefix.
     */
    getPrefixB64(with_leading_u?: boolean): string;
    /**
     * Get the hash portion of the HoloHash.
     * @returns {Uint8Array} - The 32 hash bytes.
     */
    getHash(): Uint8Array;
    /**
     * Gets the base64 representation of the hash.
     * @param {boolean} force - Whether to force the base64 conversion.
     * @returns {string} The base64 representation of the hash.
     * @throws Will throw a warning if force is not true.
     */
    getHashB64(force?: boolean): string;
    /**
     * Gets the DHT address.
     * @returns {Uint8Array} The DHT address.
     */
    getDHTAddress(): Uint8Array;
    /**
     * Gets the base64 representation of the DHT address.
     * @param {boolean} force - Whether to force the base64 conversion.
     * @returns {string} The base64 representation of the DHT address.
     * @throws Will throw a warning if force is not true.
     */
    getDHTAddressB64(force?: boolean): string;
    /**
     * Gets the DHT location.
     * @returns {number} The DHT location.
     */
    getDHTLocation(): number;
    /**
     * Converts HoloHash to Uint8Array.
     * @returns {Uint8Array} The 39 bytes.
     */
    toBytes(): Uint8Array;
    /**
     * Define the representation for JSON conversion.
     * @returns {string} The string representation.
     */
    toJSON(): string;
    /**
     * Converts HoloHash to a certain type.
     * @param {string} type - A HoloHash subclass name.
     * @returns {HoloHash} An instance of the HoloHash subclass.
     * @throws Will throw an error if type does not match one of the known subclasses.
     */
    toType(type: string): HoloHash;
    /**
     * Retypes HoloHash.
     * @param {string} type - A HoloHash subclass name.
     * @returns {HoloHash} An instance of the HoloHash subclass.
     * @throws Will throw an error if type does not match one of the known subclasses.
     */
    retype(type: string): HoloHash;
    /**
     * Gets the type of HoloHash.
     * @returns {function} The constructor of this instance.
     */
    hashType(): Function;
}
export class AnyLinkableHash extends HoloHash {
}
export class AnyDhtHash extends AnyLinkableHash {
}
export class ExternalHash extends AnyLinkableHash {
    static PREFIX: readonly number[];
}
export class AgentPubKey extends AnyDhtHash {
    static PREFIX: readonly number[];
}
export class EntryHash extends AnyDhtHash {
    static PREFIX: readonly number[];
}
export class NetIdHash extends HoloHash {
    static PREFIX: readonly number[];
}
export class DhtOpHash extends HoloHash {
    static PREFIX: readonly number[];
}
export class ActionHash extends AnyDhtHash {
    static PREFIX: readonly number[];
}
export class WasmHash extends HoloHash {
    static PREFIX: readonly number[];
}
export class DnaHash extends HoloHash {
    static PREFIX: readonly number[];
}
export namespace HoloHashTypes {
    export { AgentPubKey };
    export { EntryHash };
    export { NetIdHash };
    export { DhtOpHash };
    export { ActionHash };
    export { WasmHash };
    export { DnaHash };
    export { ExternalHash };
}
export namespace base64 {
    export { bytes_to_b64 as encode };
    export { b64_to_bytes as decode };
    export { b64_url_encode as url_encode };
    export { b64_url_decode as url_decode };
}
declare namespace _default {
    export { HoloHash };
    export { HoloHashTypes };
    export { AnyDhtHash };
    export { AnyLinkableHash };
    export { AgentPubKey };
    export { EntryHash };
    export { NetIdHash };
    export { DhtOpHash };
    export { ActionHash };
    export { WasmHash };
    export { DnaHash };
    export { ExternalHash };
    export { Warning };
    export { HoloHashError };
    export { NoLeadingUError };
    export { BadBase64Error };
    export { BadSizeError };
    export { BadPrefixError };
    export { BadChecksumError };
    export { logging };
    export { base64 };
    export { bindNative };
}
export default _default;
declare function bytes_to_b64(bytes: any): string;
declare function b64_to_bytes(b64: any): any;
declare function b64_url_encode(b64: any): any;
declare function b64_url_decode(b64: any): any;
import { Warning } from './errors.js';
import { HoloHashError } from './errors.js';
import { NoLeadingUError } from './errors.js';
import { BadBase64Error } from './errors.js';
import { BadSizeError } from './errors.js';
import { BadPrefixError } from './errors.js';
import { BadChecksumError } from './errors.js';
export { Warning, HoloHashError, NoLeadingUError, BadBase64Error, BadSizeError, BadPrefixError, BadChecksumError };
