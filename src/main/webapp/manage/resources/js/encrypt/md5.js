/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */

function Md5Class() {
	'use strict';

	var _self = this;
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	_self.safe_add = function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16)
				+ (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	};

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	_self.bit_rol = function(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	};

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	_self.md5_cmn = function(q, a, b, x, s, t) {
		return _self.safe_add(_self.bit_rol(_self.safe_add(
				_self.safe_add(a, q), _self.safe_add(x, t)), s), b);
	};
	_self.md5_ff = function(a, b, c, d, x, s, t) {
		return _self.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	};
	_self.md5_gg = function(a, b, c, d, x, s, t) {
		return _self.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	};
	_self.md5_hh = function(a, b, c, d, x, s, t) {
		return _self.md5_cmn(b ^ c ^ d, a, b, x, s, t);
	};
	_self.md5_ii = function(a, b, c, d, x, s, t) {
		return _self.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	};

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */
	_self.binl_md5 = function(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << (len % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var i, olda, oldb, oldc, oldd, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = _self.md5_ff(a, b, c, d, x[i], 7, -680876936);
			d = _self.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = _self.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = _self.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = _self.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = _self.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = _self.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = _self.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = _self.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = _self.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = _self.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = _self.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = _self.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = _self.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = _self.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = _self.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = _self.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = _self.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = _self.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = _self.md5_gg(b, c, d, a, x[i], 20, -373897302);
			a = _self.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = _self.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = _self.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = _self.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = _self.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = _self.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = _self.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = _self.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = _self.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = _self.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = _self.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = _self.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = _self.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
			d = _self.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = _self.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = _self.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = _self.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = _self.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = _self.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = _self.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = _self.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = _self.md5_hh(d, a, b, c, x[i], 11, -358537222);
			c = _self.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = _self.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = _self.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = _self.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = _self.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = _self.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = _self.md5_ii(a, b, c, d, x[i], 6, -198630844);
			d = _self.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = _self.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = _self.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = _self.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = _self.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = _self.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = _self.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = _self.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = _self.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = _self.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = _self.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = _self.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = _self.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = _self.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = _self.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = _self.safe_add(a, olda);
			b = _self.safe_add(b, oldb);
			c = _self.safe_add(c, oldc);
			d = _self.safe_add(d, oldd);
		}
		return [a, b, c, d];
	};

	/*
	 * Convert an array of little-endian words to a string
	 */
	_self.binl2rstr = function(input) {
		var i, output = '';
		for (i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		}
		return output;
	};

	/*
	 * Convert a raw string to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	_self.rstr2binl = function(input) {
		var i, output = [];
		output[(input.length >> 2) - 1] = undefined;
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0;
		}
		for (i = 0; i < input.length * 8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		}
		return output;
	};

	/*
	 * Calculate the MD5 of a raw string
	 */
	_self.rstr_md5 = function(s) {
		return _self
				.binl2rstr(_self.binl_md5(_self.rstr2binl(s), s.length * 8));
	};

	/*
	 * Calculate the HMAC-MD5, of a key and some data (raw strings)
	 */
	_self.rstr_hmac_md5 = function(key, data) {
		var i, bkey = _self.rstr2binl(key), ipad = [], opad = [], hash;
		ipad[15] = opad[15] = undefined;
		if (bkey.length > 16) {
			bkey = _self.binl_md5(bkey, key.length * 8);
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		hash = _self.binl_md5(ipad.concat(_self.rstr2binl(data)),
				512 + data.length * 8);
		return _self.binl2rstr(_self.binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	 * Convert a raw string to a hex string
	 */
	_self.rstr2hex = function(input) {
		var hex_tab = '0123456789abcdef', output = '', x, i;
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F)
					+ hex_tab.charAt(x & 0x0F);
		}
		return output;
	}

	/*
	 * Encode a string as utf-8
	 */
	_self.str2rstr_utf8 = function(input) {
		return unescape(encodeURIComponent(input));
	}

	/*
	 * Take string arguments and return either raw or hex encoded strings
	 */
	_self.raw_md5 = function(s) {
		return _self.rstr_md5(_self.str2rstr_utf8(s));
	};
	_self.hex_md5 = function(s) {
		return _self.rstr2hex(_self.raw_md5(s));
	};
	_self.raw_hmac_md5 = function(k, d) {
		return _self.rstr_hmac_md5(_self.str2rstr_utf8(k), _self
				.str2rstr_utf8(d));
	};
	_self.hex_hmac_md5 = function(k, d) {
		return _self.rstr2hex(_self.raw_hmac_md5(k, d));
	}

	_self.md5 = function(string, key, raw) {
		if (!key) {
			if (!raw) {
				return _self.hex_md5(string);
			}
			return _self.raw_md5(string);
		}
		if (!raw) {
			return _self.hex_hmac_md5(key, string);
		}
		return _self.raw_hmac_md5(key, string);
	}

	/*if (typeof define === 'function' && define.amd) {
	 define(function () {
	 return md5String;
	 });
	 } else {
	 $.md5String = md5String;
	 }*/
}