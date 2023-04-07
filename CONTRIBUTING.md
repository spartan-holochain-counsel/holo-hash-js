[back to README.md](README.md)

# Contributing

## Overview
This package is designed to match Holochain's `holo_hash` crate (https://crates.io/crates/holo_hash)
as closely as possible while utilizing Javascript's architectural differences.

## Development

See [docs/API.md](docs/API.md) for detailed API References

### `logging()`
Turns on debugging logs.

```javascript
import { HoloHash, logging } from '@whi/holo-hash';

logging(); // show debug logs
```

### Environment

- Developed using Node.js `v12.20.0`

### Building
No build required.  Vanilla JS only.

### Testing

To run all tests with logging
```
make test-debug
```

- `make test-unit-debug` - **Unit tests only**
- `make test-integration-debug` - **Integration tests only**

> **NOTE:** remove `-debug` to run tests without logging
