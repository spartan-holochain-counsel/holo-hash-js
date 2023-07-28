[![](https://img.shields.io/npm/v/@spartan-hc/holo-hash/latest?style=flat-square)](http://npmjs.com/package/@spartan-hc/holo-hash)

# `new HoloHash( input )`
A Javascript library for managing Holochain's `HoloHash` types.

[![](https://img.shields.io/github/issues-raw/spartan-holochain-counsel/holo-hash-js?style=flat-square)](https://github.com/spartan-holochain-counsel/holo-hash-js/issues)
[![](https://img.shields.io/github/issues-closed-raw/spartan-holochain-counsel/holo-hash-js?style=flat-square)](https://github.com/spartan-holochain-counsel/holo-hash-js/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/spartan-holochain-counsel/holo-hash-js?style=flat-square)](https://github.com/spartan-holochain-counsel/holo-hash-js/pulls)


## Overview
This module is intended to provide Javascript classes for managing the various `HoloHash` types.  It
is designed to resemble the struct names and implementations based on Holochain's `holo_hash` crate
(https://crates.io/crates/holo_hash).  Although, method names and formats have been modified to
match Javascript's architecture.

### Features

- Construct from a 32-byte raw hash
- Construct from a 36-byte raw hash + DHT address
- Construct from a 39-byte full Holo Hash
- Parse from the Holo Hash string representation (eg. `uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU`)
- Parse from a url-safe-base64 string (no leading `u`)
  - eg. 32-byte `zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uM`
  - eg. 36-byte `zycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU`
  - eg. 39-byte `hCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU`
- Custom error classes (similar to the `holo_hash` crate)
- Proper class inheritance for using `instanceof`
  - eg. `(new AgentPubKey(...) instanecof HoloHash) === true`
  - eg. `(new AgentPubKey(...) instanecof AnyDhtHash) === true`
  - eg. `(new AgentPubKey(...) instanecof AgentPubKey) === true`
  - eg. `(new AgentPubKey(...) instanecof EntryHash) === false`

## Install

```bash
npm i @spartan-hc/holo-hash
```

## Basic Usage

```javascript
import { HoloHash } from '@spartan-hc/holo-hash';

new HoloHash("uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU");
// AgentPubKey(39) [
//   132,  32,  36, 207,  39,   6,  42, 162,  2,
//    95, 176,  73, 215,  86, 158, 133, 121, 16,
//   209, 230, 217, 119, 208,  52, 155,  79, 31,
//   250, 159,  28, 212, 252, 178, 226, 227, 37,
//    53,  68,  20
// ]
```

Alternatively, attach a method to the native `String.prototype`.

```javascript
import { bindNative } from '@spartan-hc/holo-hash';

bindNative();

"uhCAkzycGKqICX7BJ11aehXkQ0ebZd9A0m08f-p8c1Pyy4uMlNUQU".toHoloHash();
// AgentPubKey(39) [
//   132,  32,  36, 207,  39,   6,  42, 162,  2,
//    95, 176,  73, 215,  86, 158, 133, 121, 16,
//   209, 230, 217, 119, 208,  52, 155,  79, 31,
//   250, 159,  28, 212, 252, 178, 226, 227, 37,
//    53,  68,  20
// ]
```

### API Reference

See [docs/API.md](docs/API.md)

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
