
export type PrefixType = readonly [number, number, number];

export const BLANK_PREFIX : PrefixType          = Object.freeze([132, 47, 190]); // hC--
export const ENUM_PREFIX : PrefixType           = Object.freeze([132, 47, 255]); // hC//

export const AGENT_PREFIX : PrefixType          = Object.freeze([132, 32, 36]); // hCAk
export const ENTRY_PREFIX : PrefixType          = Object.freeze([132, 33, 36]); // hCEk
export const NETID_PREFIX : PrefixType          = Object.freeze([132, 34, 36]); // hCIk
export const DHTOP_PREFIX : PrefixType          = Object.freeze([132, 36, 36]); // hCQk
export const ACTION_PREFIX : PrefixType         = Object.freeze([132, 41, 36]); // hCkk
export const WASM_PREFIX : PrefixType           = Object.freeze([132, 42, 36]); // hCok
export const DNA_PREFIX : PrefixType            = Object.freeze([132, 45, 36]); // hC0k
export const EXTERNAL_PREFIX : PrefixType       = Object.freeze([132, 47, 36]); // hC8k
