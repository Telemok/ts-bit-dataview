/**
* https://en.wikipedia.org/wiki/Bit_numbering
 */
export declare enum EnumBitNumbering {
    LSB = 0,
    MSB = 1
}
export declare class BitNumbering extends EventTarget {
    protected bitNumbering: EnumBitNumbering;
    constructor(initialEnumBitNumbering?: EnumBitNumbering);
    isMSB(): boolean;
    isLSB(): boolean;
    get(): EnumBitNumbering;
    set(newEnumBitNumbering: EnumBitNumbering): boolean;
    setLSB(): boolean;
    setMSB(): boolean;
    setRandom(): boolean;
    toString(): string;
}
