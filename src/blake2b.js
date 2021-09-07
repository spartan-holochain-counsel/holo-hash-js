// Title: Blake2B in pure Javascript
// Author: dcposch
// Date: 2021
// Availability: https://www.npmjs.com/package/blakejs
// Code excerpt from: https://github.com/dcposch/blakejs

const BLAKE2B_IV32 = new Uint32Array([
    0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
    0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
    0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
    0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
]);
const SIGMA8 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
    11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
    7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
    9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
    2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
    12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
    13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
    6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
    10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
];
const SIGMA82 = new Uint8Array(SIGMA8.map(function (x) { return x * 2 }));


function ADD64AA (v, a, b) {
    let o0 = v[a] + v[b];
    let o1 = v[a + 1] + v[b + 1];
    if (o0 >= 0x100000000) {
	o1++;
    }
    v[a] = o0;
    v[a + 1] = o1;
}

function ADD64AC (v, a, b0, b1) {
    let o0 = v[a] + b0;
    if (b0 < 0) {
	o0 += 0x100000000;
    }
    let o1 = v[a + 1] + b1;
    if (o0 >= 0x100000000) {
	o1++;
    }
    v[a] = o0;
    v[a + 1] = o1;
}

function B2B_GET32 (arr, i) {
    return (
	arr[i] ^ (
	    arr[i + 1] << 8
	) ^ (
	    arr[i + 2] << 16
	) ^ (
	    arr[i + 3] << 24
	)
    );
}

let v = new Uint32Array(32);
let m = new Uint32Array(32);
function B2B_G (a, b, c, d, ix, iy) {
    let x0 = m[ix];
    let x1 = m[ix + 1];
    let y0 = m[iy];
    let y1 = m[iy + 1];

    ADD64AA(v, a, b);
    ADD64AC(v, a, x0, x1);

    let xor0 = v[d] ^ v[a];
    let xor1 = v[d + 1] ^ v[a + 1];
    v[d] = xor1;
    v[d + 1] = xor0;

    ADD64AA(v, c, d);

    xor0 = v[b] ^ v[c];
    xor1 = v[b + 1] ^ v[c + 1];
    v[b] = (xor0 >>> 24) ^ (xor1 << 8);
    v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

    ADD64AA(v, a, b);
    ADD64AC(v, a, y0, y1);

    xor0 = v[d] ^ v[a];
    xor1 = v[d + 1] ^ v[a + 1];
    v[d] = (xor0 >>> 16) ^ (xor1 << 16);
    v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

    ADD64AA(v, c, d);

    xor0 = v[b] ^ v[c];
    xor1 = v[b + 1] ^ v[c + 1];
    v[b] = (xor1 >>> 31) ^ (xor0 << 1);
    v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
}


function blake2bCompress (ctx, last) {
    let i = 0;

    for (i = 0; i < 16; i++) {
	v[i] = ctx.h[i];
	v[i + 16] = BLAKE2B_IV32[i];
    }

    v[24] = v[24] ^ ctx.t;
    v[25] = v[25] ^ (ctx.t / 0x100000000);

    if (last) {
	v[28] = ~v[28];
	v[29] = ~v[29];
    }

    for (i = 0; i < 32; i++) {
	m[i] = B2B_GET32(ctx.b, 4 * i);
    }

    for (i = 0; i < 12; i++) {
	B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
	B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
	B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
	B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
	B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
	B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
	B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
	B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
    }

    for (i = 0; i < 16; i++) {
	ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
    }
}

function blake2bInit (outlen, key) {
    if (outlen === 0 || outlen > 64)
	throw new Error('Illegal output length, expected 0 < length <= 64');
    if (key && key.length > 64)
	throw new Error('Illegal key, expected Uint8Array with 0 < length <= 64');

    let ctx = {
	b: new Uint8Array(128),
	h: new Uint32Array(16),
	t: 0,
	c: 0,
	outlen: outlen
    };

    for (let i = 0; i < 16; i++) {
	ctx.h[i] = BLAKE2B_IV32[i];
    }
    let keylen = key ? key.length : 0;
    ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;

    if (key) {
	blake2bUpdate(ctx, key);
	ctx.c = 128;
    }

    return ctx;
}

function blake2bUpdate (ctx, input) {
    for (let i = 0; i < input.length; i++) {
	if (ctx.c === 128) {
	    ctx.t += ctx.c;
	    blake2bCompress(ctx, false);
	    ctx.c = 0;
	}
	ctx.b[ctx.c++] = input[i];
    }
}

function blake2bFinal (ctx) {
    ctx.t += ctx.c;

    while (ctx.c < 128) {
	ctx.b[ctx.c++] = 0;
    }
    blake2bCompress(ctx, true);

    let out = new Uint8Array(ctx.outlen);
    for (let i = 0; i < ctx.outlen; i++) {
	out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
    }
    return out;
}

function blake2b (input, key, outlen) {
    outlen = outlen || 64;

    if ( Array.isArray(input) )
	input = new Uint8Array(input);
    else if ( ! (input instanceof Uint8Array) )
	throw new TypeError(`blake2b input must be a Uint8Array; not type ${typeof input}`);

    let ctx = blake2bInit(outlen, key);
    blake2bUpdate(ctx, input);
    return blake2bFinal(ctx);
}

module.exports = blake2b;
