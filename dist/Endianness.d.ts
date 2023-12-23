/** https://en.wikipedia.org/wiki/Endianness
 * x86-64 instruction set architectures use the little-endian format
 * RISC-V and ARM support both
 * JavaScript DataView use big-endian by default (why?)
 */
export declare enum EnumEndianness {
    LITTLE_ENDIAN = 0,
    BIG_ENDIAN = 1
}
export declare class Endianness {
    protected endianness: EnumEndianness;
    constructor(initialEnumEndianness?: EnumEndianness);
    isBigEndian(): boolean;
    isLittleEndian(): boolean;
    _setBigEndian(): void;
    setBigEndian(): boolean;
    _setLittleEndian(): void;
    setLittleEndian(): boolean;
    get(): EnumEndianness;
    _set(newEnumEndianness: EnumEndianness): void;
    set(newEnumEndianness: EnumEndianness): boolean;
    toString(): string;
    setRandom(): void;
}
