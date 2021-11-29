// Modified from:
// ABC - a generic, native JS (A)scii(B)inary(C)onverter.
// (c) 2013 Stephan Schmitz <eyecatchup@gmail.com>
// License: MIT, http://eyecatchup.mit-license.org
// URL: https://gist.github.com/eyecatchup/6742657

class AsciiBinaryConverter {
	static toAscii(binary) {
    return this.asciiPad(binary).replace(
			/\s*[01]{8}\s*/g,
			(binary) => String.fromCharCode(parseInt(binary, 2))
    )
	}

	static asciiPad(num) {
		const length = num.length;
		if (length < 7) {
			return "01000000".slice(0, 8 - length, length) + num;
		} else if (length === 8) {
			return "0" + num.slice(1);
		} else {
			return this.asciiPad(num.slice(0, 8)) + this.asciiPad(num.slice(8))
		}
	}

	static toUTF8(binary) {
		return this.zeroPad(binary).replace(
			/\s*[01]{8}\s*/g,
			(binary) => String.fromCharCode(parseInt(binary, 2))
    )
	}

	static zeroPad(num) {
		while (num.length % 8 !== 0) {
			num = '0' + num;
		}
    return num;
	}
}

export default AsciiBinaryConverter;
