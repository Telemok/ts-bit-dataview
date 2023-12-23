"use strict";
/**
* https://en.wikipedia.org/wiki/Bit_numbering
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitNumbering = exports.EnumBitNumbering = void 0;
var EnumBitNumbering;
(function (EnumBitNumbering) {
    EnumBitNumbering[EnumBitNumbering["LSB"] = 0] = "LSB";
    EnumBitNumbering[EnumBitNumbering["MSB"] = 1] = "MSB";
})(EnumBitNumbering || (exports.EnumBitNumbering = EnumBitNumbering = {}));
class BitNumbering extends EventTarget {
    bitNumbering;
    constructor(initialEnumBitNumbering = EnumBitNumbering.LSB) {
        super();
        this.bitNumbering = initialEnumBitNumbering;
    }
    isMSB() {
        return this.bitNumbering === EnumBitNumbering.MSB;
    }
    isLSB() {
        return this.bitNumbering === EnumBitNumbering.LSB;
    }
    get() {
        return this.bitNumbering;
    }
    set(newEnumBitNumbering) {
        let changed = this.bitNumbering !== newEnumBitNumbering;
        this.bitNumbering = newEnumBitNumbering;
        if (changed) {
            let ev = new Event("change");
            // node-js don't support CustomEvent, typescript don't support event.detail
            //@ts-ignore
            ev.detail = { bitNumbering: this.bitNumbering };
            this.dispatchEvent(ev);
        }
        return changed;
    }
    setLSB() {
        return this.set(EnumBitNumbering.LSB);
    }
    setMSB() {
        return this.set(EnumBitNumbering.MSB);
    }
    setRandom() {
        return this.set(Math.random() >= 0.5 ? EnumBitNumbering.LSB : EnumBitNumbering.MSB);
    }
    toString() {
        return EnumBitNumbering[this.bitNumbering];
    }
}
exports.BitNumbering = BitNumbering;
//# sourceMappingURL=BitNumbering.js.map