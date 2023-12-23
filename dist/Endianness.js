"use strict";
/** https://en.wikipedia.org/wiki/Endianness
 * x86-64 instruction set architectures use the little-endian format
 * RISC-V and ARM support both
 * JavaScript DataView use big-endian by default (why?)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endianness = exports.EnumEndianness = void 0;
var EnumEndianness;
(function (EnumEndianness) {
    EnumEndianness[EnumEndianness["LITTLE_ENDIAN"] = 0] = "LITTLE_ENDIAN";
    EnumEndianness[EnumEndianness["BIG_ENDIAN"] = 1] = "BIG_ENDIAN";
})(EnumEndianness || (exports.EnumEndianness = EnumEndianness = {}));
class Endianness {
    endianness;
    constructor(initialEnumEndianness = EnumEndianness.LITTLE_ENDIAN) {
        this.endianness = initialEnumEndianness;
        /*Attention!!! In JavaScript DataView by default is Big Endian!!!*/
    }
    isBigEndian() {
        return this.endianness === EnumEndianness.BIG_ENDIAN;
    }
    isLittleEndian() {
        return this.endianness === EnumEndianness.LITTLE_ENDIAN;
    }
    _setBigEndian() {
        this.endianness = EnumEndianness.BIG_ENDIAN;
    }
    setBigEndian() {
        return this.set(EnumEndianness.BIG_ENDIAN);
    }
    _setLittleEndian() {
        this.endianness = EnumEndianness.LITTLE_ENDIAN;
    }
    setLittleEndian() {
        return this.set(EnumEndianness.LITTLE_ENDIAN);
    }
    get() {
        return this.endianness;
    }
    _set(newEnumEndianness) {
        this.endianness = newEnumEndianness;
    }
    set(newEnumEndianness) {
        let changed = this.endianness !== newEnumEndianness;
        this.endianness = newEnumEndianness;
        return changed;
    }
    toString() {
        return EnumEndianness[this.endianness];
    }
    setRandom() {
        if (Math.random() > 0.5)
            this.setLittleEndian();
        else
            this.setBigEndian();
    }
}
exports.Endianness = Endianness;
//# sourceMappingURL=Endianness.js.map