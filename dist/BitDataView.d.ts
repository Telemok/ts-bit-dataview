/**
 * @file    BitDataView.ts
 * @brief
 * Like DataView, but byte addressing changed to bit addressing.
 * Set, get, push, unshift, pop, shift functions for each data type.
 * Data types: boolean and custom bit size uint, int, float. For example: Uint17, Int27 or BigUint61.
 * Like a BitBuffer, BitArray, BitStack, BitQueue.
 * Small memory using: used 1 bit in memory for every 1 bit data. 23 bits data => 3 bytes in RAM.
 * Full assert arguments of functions.
 * NodeJs and browser Javascript support.
 * Endianness: Little Endian and Big Endian byte order supported.
 * Significant bit: LSB (lest) by default, MSB (most) is supported.
 * Can export and import to C/C++ BitDataView library (only if LSB + Little Endian).
 * Fastest library with same advantages.
 * Good library to decrypt RS-232, HDLC, Ethernet, USB, Can-Bus, TCP/IP RAW packets.
 * @author  Dmitrii Arshinnikov <www.telemok.com@gmail.com> github.com/Telemok npmjs.com/~telemok
 * https://github.com/Telemok/ts-bit-dataview.git
 * @version 0.0.231223
 * @date 2023-12-23
 *
 @verbatim
 Copyright (c) 2023 telemok.com

 Licensed under the Apache License, Version 2.0(the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 @endverbatim
 */
import { Endianness } from "./Endianness";
import { BitNumbering } from "./BitNumbering";
export declare class BitDataView {
    /** Little or Big endian byte order, Little Endian is default in JS DataView. */
    readonly endianness: Endianness;
    /** Lest or Most significant bit order, MSB is default in JS DataView. */
    readonly bitNumbering: BitNumbering;
    /** automaticMemoryExpansion - false set memory static, unexpandable, fast. true allow extend memory for left and right of array*/
    protected __automaticMemoryExpansion: boolean;
    protected __data: Uint8Array;
    protected __countBitsPushLimit: number;
    protected __countBitsPushed: number;
    protected __countBitsShifted: number;
    protected _andBitInMemoryAddress_noAsserts: (addressOfBitInMemory: number) => void;
    protected _orBitInMemoryAddress_noAsserts: (addressOfBitInMemory: number) => void;
    protected _getAt_BitMemoryAddress_noAsserts: (addressOfBitInMemory: number) => number;
    /**
     * Creates an instance of BitDataView.
     *
     * @constructor
     * @param {ArrayBufferLike | Uint8Array | number} [bufferInfo] - The input to initialize the Uint8Array.
     *   If not provided, a Uint8Array with a length of 64 bytes is created.
     *   If ArrayBuffer or ArrayBuffer-like object is provided, a Uint8Array is created based on it.
     *   If Uint8Array is provided, it is assigned to the data field.
     *   If a positive integer is provided, this is count bits!!!, a new Uint8Array length will be ceil(bufferInfo / 8).
     * @throws {Error} Throws an error for invalid input types.
     * @description
     * LE and LSB by default
     */
    constructor(bufferInfo?: ArrayBufferLike | Uint8Array | number);
    get buffer(): ArrayBufferLike;
    /**
     * return bits size of stored data
     * @description single constructor
     */
    getCountStoredBits(): number;
    protected _andBitInMemoryAddressLsb_noAsserts: (addressOfBitInMemory: number) => void;
    protected _orBitInMemoryAddressLsb_noAsserts: (addressOfBitInMemory: number) => void;
    protected _andBitInMemoryAddressMsb_noAsserts: (addressOfBitInMemory: number) => void;
    protected _orBitInMemoryAddressMsb_noAsserts: (addressOfBitInMemory: number) => void;
    protected _getAt_BitMemoryAddressLsb_noAsserts: (addressOfBitInMemory: number) => number;
    protected _getAt_BitMemoryAddressMsb_noAsserts: (addressOfBitInMemory: number) => number;
    /**
     * @description fast clear header of bitDataView
     */
    clear(): void;
    /**
     * @description make copy of bitDataView
     * @param {boolean} copyStrictPrivateStructure - False is default, faster. True is slower, but copy full instance structure.
     */
    clone(copyStrictPrivateStructure?: boolean): BitDataView;
    getAvailableBitsToExpandRight(): number;
    getAvailableBitsToPush(): number;
    getAvailableBitsToUnshift(): number;
    /**
     * @param {number} expandBits - add 'expandBytes' to buffer size to right
     * @throws {TypeError}
     * @throws {RangeError}
     * @description if no size for push to BitDataView, size can be expanded
     */
    expandRight(expandBits?: number): void | never;
    /**
     * @param {number} expandBits - count bits to
     * @throws {TypeError}
     * @throws {RangeError}
     * @description Сложение двух чисел*/
    expandLeft(expandBits?: number): void | never;
    /**
     * @return
     * @param checkPushBits
     * @param bitCountIfExpandRequired
     * @throws {TypeError}
     * @throws {RangeError}
     * @description after run .expandRightIfNeed(x) you can safe do .push(x, ...)
     */
    expandRightIfNeed(checkPushBits: number, bitCountIfExpandRequired?: number): void | never;
    /**
     * @description Сложение двух чисел
     * @return
     * @param checkUnshiftBits
     * @param bitCountIfExpandRequired
     * @throws {TypeError}
     * @throws {RangeError}
     * @description after run .expandLeftIfNeed(x) you can safe do .unshift(x, ...)
     */
    expandLeftIfNeed(checkUnshiftBits: number, bitCountIfExpandRequired?: number): void | never;
    _importUint8Array_noAsserts(uint8Array: Uint8Array, doClone?: boolean): void;
    importUint8Array(uint8Array: Uint8Array): void | never;
    exportUnit8Array(littleEndian?: boolean): Uint8Array;
    toString01(): string;
    /**
     * @return {string} - information about bitDataView
     * */
    toString(): string;
    _push_Nothing_noAsserts(countBits: number): void;
    push_Nothing(countBits: number): void;
    _unshift_Nothing_noAsserts(countBits: number): void;
    /**
     * @description set bit in private memory position index
     * @param {number} bitValue - is boolean. Used as "if(bitValue)"
     * @param {number} addressOfBitInMemory - is 32 bit unsigned integer. Not asserted for raise up work speed. Bit address of memory position, not bit index in array.
     */
    _setBitInMemoryAddress_noAsserts(bitValue: number, addressOfBitInMemory: number): void;
    /**
     * SET: write boolean by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index at begin. Not asserted.
     * @param {number} valueBit - Range: false or true. Not asserted.
     * @access protected
     */
    _setAt_Bit_noAsserts(bitIndexAt: number, valueBit: number): void;
    /** get bit by virtual index at begin of bitDataView.
     * @param {number} bitIndexAt - is 32 bit unsigned integer. Bit address of memory position, not bit index in array.
     * @return {number} - return 0 or 1 bit value.
     * @description
     */
    _getAt_Bit_noAsserts(bitIndexAt: number): number;
    /**  push (add to right of bitDataView) 1 bit.
     * @param {boolean} bitValue - 0/1 true/false value to add to right side of bitDataView
     * @description - work faster
     */
    _push_Bit_noAssertsNoExpand(bitValue: number): void;
    /**  push (add to right of bitDataView) some similar bits. Like fill() function.
     * @param {boolean} bitValue - 0/1 true/false value to add to right side of bitDataView
     * @param {number} count - count of similar bits to add. Default = 1.
     * @description - work slower
     */
    push_Bits(bitValue: number, count?: number): void;
    /** set (set to custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to get. Not asserted.
     * @param {number} byteData
     * @return {number}
     */
    _setAt_Uint8orLess_noAsserts(bitIndexAt: number | undefined, countBitsToSet: number | undefined, byteData: number): void;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get. Not asserted.
     * @return {number} - byteData
     */
    _getAt_Uint8orLess_noAsserts(bitIndexAt?: number, countBitsToGet?: number): number;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get. Not asserted.
     * @return {number} - byteData
     */
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to get. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @return {number} - value
     */
    _setAt_Uint53orLess_noAsserts(bitIndexAt: number | undefined, countBitsToSet: number | undefined, valueUint: number): void;
    /** set () unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of valueUint to get. Not asserted.
     * @param {number} valueUint - valueUint
     */
    _setAt_Int53orLess_noAsserts(bitIndexAt: number | undefined, countBitsToSet: number | undefined, valueUint: number): void;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of valueUint to get. Not asserted.
     * @return {number}  - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     */
    _getAt_Uint53orLess_noAsserts(bitIndexAt?: number, countBitsToGet?: number): number;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of valueUint to get. Not asserted.
     * @return {number} - valueUint
     */
    _getAt_Int53orLess_noAsserts(bitIndexAt?: number, countBitsToGet?: number): number;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to get. Not asserted.
     * @param {BigInt} value -
     */
    _setAt_BigUint64orLess_noAsserts(bitIndexAt: number | undefined, countBitsToSet: number | undefined, value: bigint): void;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to get. Not asserted.
     * @param {BigInt} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     */
    _setAt_BigInt64orLess_noAsserts(bitIndexAt: number | undefined, countBitsToSet: number | undefined, valueBigInt: bigint): void;
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get. Not asserted.
     */
    _getAt_BigUint64orLess_noAsserts(bitIndexAt?: number, countBitsToGet?: number): bigint;
    /** get (take from custom place of bitDataView) signed integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get. Not asserted.
     */
    _getAt_BigInt64orLess_noAsserts(bitIndexAt?: number, countBitsToGet?: number): bigint;
    setAt_Uint8Array_noExpandNoAsserts(bitIndexAt: number | undefined, uint8Array: Uint8Array, littleEndian?: boolean): void;
    _setUntil_Uint8Array_noExpandNoAsserts(bitIndexUntil: number | undefined, uint8Array: Uint8Array, littleEndian?: boolean): void;
    /**  push (add to right of bitDataView) Uint8Array instance.
     * @param {Uint8Array} uint8Array - uint8Array data to push
     */
    push_Uint8Array(uint8Array: Uint8Array): void;
    _getAt_Uint8Array_noAsserts(address: number, countBitsToGet?: number, littleEndian?: boolean): Uint8Array;
    /**  shift (take from left of bitDataView) Unit8Array.
     * @param {number} countBitsToShift - Count bits to shift. If count % 8 != 0, free spaces will be filled by 0. Asserted.
     * @param {boolean} littleEndian - undefined by default. Byte order. Asserted.
     * @return {Uint8Array} -
     */
    shift_Uint8Array(countBitsToShift?: number, littleEndian?: boolean): Uint8Array;
    /**  pop (take from right of bitDataView) Unit8Array.
     * @param {number} countBitsToPop - Count bytes to pop. Asserted.
     * param {boolean} littleEndian -
     * @return {Uint8Array} -
     */
    pop_Uint8Array(countBitsToPop?: number): Uint8Array;
    _setAt_DataView_noAsserts(bitAddressAt: number, countBitsToSet: number, valueDataView: DataView, littleEndian?: boolean): void;
    _getAt_DataView_noAsserts(bitAddressAt: number, countBitsToGet: number, littleEndian?: boolean): DataView;
    _setAt_Uint8Array_noAsserts(bitIndexAt: number, countBitsToSet: number, uint8Array: Uint8Array, littleEndian?: boolean): void;
    _getAt_toUint8Array_noAsserts(uint8Array: Uint8Array, address: number, countBitsToGet?: number, littleEndian?: boolean): void;
    _setAt_TempBuffer(bitIndexAt: number): void;
    _getAt_TempBuffer(bitIndexAt: number, countBitsToGet: number, littleEndian?: boolean): void;
    _setAt_Float32_noAsserts(bitIndexAt: number, valueFloat32: number): void;
    _getAt_Float32_noAsserts(bitIndexAt: number): number;
    _setAt_Float64_noAsserts(bitIndexAt: number, valueFloat64: number): void;
    _getAt_Float64_noAsserts(bitIndexAt: number): number;
    /********** PROTECTED SECTION. Data type: Byte. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to set. Not asserted.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1). Not asserted.
     * @access protected
     */
    _setUntil_Uint8orLess_noAsserts(bitIndexUntil: number, countBitsToSet: number, valueByte: number): void;
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get. Not asserted.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     * @access protected
     */
    _getUntil_Uint8orLess_noAsserts(bitIndexUntil: number, countBitsToGet: number): number;
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 8 of value to push. Not asserted.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1). Not asserted.
     * @access protected
     */
    _push_Uint8orLess_noAssertsNoExpand(countBitsToPush: number, valueByte: number): void;
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 8 of value to unshift. Not asserted.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1). Not asserted.
     * @access protected
     */
    _unshift_Uint8orLess_noAssertsNoExpand(countBitsToUnshift: number, valueByte: number): void;
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 8 of value to shift. Not asserted.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     * @access protected
     */
    _shift_Uint8orLess_noAsserts(countBitsToShift: number): number;
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 8 of value to pop. Not asserted.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     * @access protected
     */
    _pop_Uint8orLess_noAsserts(countBitsToPop: number): number;
    /********** PROTECTED SECTION. Data type: Uint. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to set. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @access protected
     */
    _setUntil_Uint53orLess_noAsserts(bitIndexUntil: number, countBitsToSet: number, valueUint: number): void;
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of value to get. Not asserted.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     * @access protected
     */
    _getUntil_Uint53orLess_noAsserts(bitIndexUntil: number, countBitsToGet: number): number;
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 53 of value to push. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @access protected
     */
    _push_Uint53orLess_noAssertsNoExpand(countBitsToPush: number, valueUint: number): void;
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 53 of value to unshift. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @access protected
     */
    _unshift_Uint53orLess_noAssertsNoExpand(countBitsToUnshift: number, valueUint: number): void;
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 53 of value to shift. Not asserted.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     * @access protected
     */
    _shift_Uint53orLess_noAsserts(countBitsToShift: number): number;
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 53 of value to pop. Not asserted.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     * @access protected
     */
    _pop_Uint53orLess_noAsserts(countBitsToPop: number): number;
    /********** PROTECTED SECTION. Data type: Int. **********/
    /**
     * SET: write signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 1 to 53 of value to set. Not asserted.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1). Not asserted.
     * @access protected
     */
    _setUntil_Int53orLess_noAsserts(bitIndexUntil: number, countBitsToSet: number, valueInt: number): void;
    /**
     * GET: read signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 1 to 53 of value to get. Not asserted.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     * @access protected
     */
    _getUntil_Int53orLess_noAsserts(bitIndexUntil: number, countBitsToGet: number): number;
    /**
     * PUSH: write (signed integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 53 of value to push. Not asserted.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1). Not asserted.
     * @access protected
     */
    _push_Int53orLess_noAssertsNoExpand(countBitsToPush: number, valueInt: number): void;
    /**
     * UNSHIFT: write (signed integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 53 of value to unshift. Not asserted.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1). Not asserted.
     * @access protected
     */
    _unshift_Int53orLess_noAssertsNoExpand(countBitsToUnshift: number, valueInt: number): void;
    /**
     * SHIFT: read (signed integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 53 of value to shift. Not asserted.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     * @access protected
     */
    _shift_Int53orLess_noAsserts(countBitsToShift: number): number;
    /**
     * POP: read (signed integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 53 of value to pop. Not asserted.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     * @access protected
     */
    _pop_Int53orLess_noAsserts(countBitsToPop: number): number;
    /********** PROTECTED SECTION. Data type: BigUint. **********/
    /**
     * SET: write bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to set. Not asserted.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1). Not asserted.
     * @access protected
     */
    _setUntil_BigUint64orLess_noAsserts(bitIndexUntil: number, countBitsToSet: number, valueBigUint: bigint): void;
    /**
     * GET: read bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get. Not asserted.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     * @access protected
     */
    _getUntil_BigUint64orLess_noAsserts(bitIndexUntil: number, countBitsToGet: number): bigint;
    /**
     * PUSH: write (bigint) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 64 of value to push. Not asserted.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1). Not asserted.
     * @access protected
     */
    _push_BigUint64orLess_noAssertsNoExpand(countBitsToPush: number, valueBigUint: bigint): void;
    /**
     * UNSHIFT: write (bigint) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 64 of value to unshift. Not asserted.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1). Not asserted.
     * @access protected
     */
    _unshift_BigUint64orLess_noAssertsNoExpand(countBitsToUnshift: number, valueBigUint: bigint): void;
    /**
     * SHIFT: read (bigint) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 64 of value to shift. Not asserted.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     * @access protected
     */
    _shift_BigUint64orLess_noAsserts(countBitsToShift: number): bigint;
    /**
     * POP: read (bigint) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 64 of value to pop. Not asserted.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     * @access protected
     */
    _pop_BigUint64orLess_noAsserts(countBitsToPop: number): bigint;
    /********** PROTECTED SECTION. Data type: BigInt. **********/
    /**
     * SET: write BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 1 to 64 of value to set. Not asserted.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     * @access protected
     */
    _setUntil_BigInt64orLess_noAsserts(bitIndexUntil: number, countBitsToSet: number, valueBigInt: bigint): void;
    /**
     * GET: read BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 1 to 64 of value to get. Not asserted.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     * @access protected
     */
    _getUntil_BigInt64orLess_noAsserts(bitIndexUntil: number, countBitsToGet: number): bigint;
    /**
     * PUSH: write (BigInt) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 64 of value to push. Not asserted.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     * @access protected
     */
    _push_BigInt64orLess_noAssertsNoExpand(countBitsToPush: number, valueBigInt: bigint): void;
    /**
     * UNSHIFT: write (BigInt) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 64 of value to unshift. Not asserted.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     * @access protected
     */
    _unshift_BigInt64orLess_noAssertsNoExpand(countBitsToUnshift: number, valueBigInt: bigint): void;
    /**
     * SHIFT: read (BigInt) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 64 of value to shift. Not asserted.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     * @access protected
     */
    _shift_BigInt64orLess_noAsserts(countBitsToShift: number): bigint;
    /**
     * POP: read (BigInt) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 64 of value to pop. Not asserted.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     * @access protected
     */
    _pop_BigInt64orLess_noAsserts(countBitsToPop: number): bigint;
    /********** PROTECTED SECTION. Data type: Float32. **********/
    /**
     * SET: write floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32. Not asserted.
     * @access protected
     */
    _setUntil_Float32_noAsserts(bitIndexUntil: number, valueFloat32: number): void;
    /**
     * GET: read floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @return {number} - Range: same DataView.getFloat32.
     * @access protected
     */
    _getUntil_Float32_noAsserts(bitIndexUntil: number): number;
    /**
     * PUSH: write (floating number 32 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32. Not asserted.
     * @access protected
     */
    _push_Float32_noAssertsNoExpand(valueFloat32: number): void;
    /**
     * UNSHIFT: write (floating number 32 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32. Not asserted.
     * @access protected
     */
    _unshift_Float32_noAssertsNoExpand(valueFloat32: number): void;
    /**
     * SHIFT: read (floating number 32 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     * @access protected
     */
    _shift_Float32_noAsserts(): number;
    /**
     * POP: read (floating number 32 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     * @access protected
     */
    _pop_Float32_noAsserts(): number;
    /********** PROTECTED SECTION. Data type: Float64. **********/
    /**
     * SET: write floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} valueFloat64 - Range: any number. Not asserted.
     * @access protected
     */
    _setUntil_Float64_noAsserts(bitIndexUntil: number, valueFloat64: number): void;
    /**
     * GET: read floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @return {number} - Range: any number.
     * @access protected
     */
    _getUntil_Float64_noAsserts(bitIndexUntil: number): number;
    /**
     * PUSH: write (floating number 64 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number. Not asserted.
     * @access protected
     */
    _push_Float64_noAssertsNoExpand(valueFloat64: number): void;
    /**
     * UNSHIFT: write (floating number 64 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number. Not asserted.
     * @access protected
     */
    _unshift_Float64_noAssertsNoExpand(valueFloat64: number): void;
    /**
     * SHIFT: read (floating number 64 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: any number.
     * @access protected
     */
    _shift_Float64_noAsserts(): number;
    /**
     * POP: read (floating number 64 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: any number.
     * @access protected
     */
    _pop_Float64_noAsserts(): number;
    /********** PROTECTED SECTION. Data type: DataView. **********/
    /**
     * SET: write instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 0xFFFFFFFE of value to set. Not asserted.
     * @param {DataView} valueDataView - Range: any number. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @access protected
     */
    _setUntil_DataView_noAsserts(bitIndexUntil: number, countBitsToSet: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * GET: read instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 0xFFFFFFFE of value to get. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     * @access protected
     */
    _getUntil_DataView_noAsserts(bitIndexUntil: number, countBitsToGet: number, littleEndian?: boolean): DataView;
    /**
     * PUSH: write (instanceOf DataView) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 0xFFFFFFFE of value to push. Not asserted.
     * @param {DataView} valueDataView - Range: any number. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @access protected
     */
    _push_DataView_noAssertsNoExpand(countBitsToPush: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * UNSHIFT: write (instanceOf DataView) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 0xFFFFFFFE of value to unshift. Not asserted.
     * @param {DataView} valueDataView - Range: any number. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @access protected
     */
    _unshift_DataView_noAssertsNoExpand(countBitsToUnshift: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * SHIFT: read (instanceOf DataView) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 0xFFFFFFFE of value to shift. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     * @access protected
     */
    _shift_DataView_noAsserts(countBitsToShift: number, littleEndian?: boolean): DataView;
    /**
     * POP: read (instanceOf DataView) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 0xFFFFFFFE of value to pop. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     * @access protected
     */
    _pop_DataView_noAsserts(countBitsToPop: number, littleEndian?: boolean): DataView;
    /********** PUBLIC SECTION. Data type: Byte. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to set.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    setAtByte(bitIndexAt: number, countBitsToSet: number, valueByte: number): void;
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to set.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    setUntilByte(bitIndexUntil: number, countBitsToSet: number, valueByte: number): void;
    /**
     * GET: read unsigned integer by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    getAtByte(bitIndexAt: number, countBitsToGet: number): number;
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    getUntilByte(bitIndexUntil: number, countBitsToGet: number): number;
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 8 of value to push.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    pushByte(countBitsToPush: number, valueByte: number): void;
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 8 of value to unshift.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    unshiftByte(countBitsToUnshift: number, valueByte: number): void;
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 8 of value to shift.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    shiftByte(countBitsToShift: number): number;
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 8 of value to pop.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    popByte(countBitsToPop: number): number;
    /********** PUBLIC SECTION. Data type: Uint. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to set.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    setAtUint(bitIndexAt: number, countBitsToSet: number, valueUint: number): void;
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to set.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    setUntilUint(bitIndexUntil: number, countBitsToSet: number, valueUint: number): void;
    /**
     * GET: read unsigned integer by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of value to get.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    getAtUint(bitIndexAt: number, countBitsToGet: number): number;
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of value to get.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    getUntilUint(bitIndexUntil: number, countBitsToGet: number): number;
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 53 of value to push.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    pushUint(countBitsToPush: number, valueUint: number): void;
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 53 of value to unshift.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    unshiftUint(countBitsToUnshift: number, valueUint: number): void;
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 53 of value to shift.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    shiftUint(countBitsToShift: number): number;
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 53 of value to pop.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    popUint(countBitsToPop: number): number;
    /********** PUBLIC SECTION. Data type: Int. **********/
    /**
     * SET: write signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 53 of value to set.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    setAtInt(bitIndexAt: number, countBitsToSet: number, valueInt: number): void;
    /**
     * SET: write signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 53 of value to set.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    setUntilInt(bitIndexUntil: number, countBitsToSet: number, valueInt: number): void;
    /**
     * GET: read signed integer by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 53 of value to get.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    getAtInt(bitIndexAt: number, countBitsToGet: number): number;
    /**
     * GET: read signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 53 of value to get.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    getUntilInt(bitIndexUntil: number, countBitsToGet: number): number;
    /**
     * PUSH: write (signed integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 53 of value to push.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    pushInt(countBitsToPush: number, valueInt: number): void;
    /**
     * UNSHIFT: write (signed integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 53 of value to unshift.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    unshiftInt(countBitsToUnshift: number, valueInt: number): void;
    /**
     * SHIFT: read (signed integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 53 of value to shift.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    shiftInt(countBitsToShift: number): number;
    /**
     * POP: read (signed integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 53 of value to pop.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    popInt(countBitsToPop: number): number;
    /********** PUBLIC SECTION. Data type: BigUint. **********/
    /**
     * SET: write bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to set.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    setAtBigUint(bitIndexAt: number, countBitsToSet: number, valueBigUint: bigint): void;
    /**
     * SET: write bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to set.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    setUntilBigUint(bitIndexUntil: number, countBitsToSet: number, valueBigUint: bigint): void;
    /**
     * GET: read bigint by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    getAtBigUint(bitIndexAt: number, countBitsToGet: number): bigint;
    /**
     * GET: read bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    getUntilBigUint(bitIndexUntil: number, countBitsToGet: number): bigint;
    /**
     * PUSH: write (bigint) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 64 of value to push.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    pushBigUint(countBitsToPush: number, valueBigUint: bigint): void;
    /**
     * UNSHIFT: write (bigint) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 64 of value to unshift.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    unshiftBigUint(countBitsToUnshift: number, valueBigUint: bigint): void;
    /**
     * SHIFT: read (bigint) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 64 of value to shift.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    shiftBigUint(countBitsToShift: number): bigint;
    /**
     * POP: read (bigint) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 64 of value to pop.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    popBigUint(countBitsToPop: number): bigint;
    /********** PUBLIC SECTION. Data type: BigInt. **********/
    /**
     * SET: write BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 64 of value to set.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    setAtBigInt(bitIndexAt: number, countBitsToSet: number, valueBigInt: bigint): void;
    /**
     * SET: write BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 64 of value to set.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    setUntilBigInt(bitIndexUntil: number, countBitsToSet: number, valueBigInt: bigint): void;
    /**
     * GET: read BigInt by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 64 of value to get.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    getAtBigInt(bitIndexAt: number, countBitsToGet: number): bigint;
    /**
     * GET: read BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 64 of value to get.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    getUntilBigInt(bitIndexUntil: number, countBitsToGet: number): bigint;
    /**
     * PUSH: write (BigInt) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 64 of value to push.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    pushBigInt(countBitsToPush: number, valueBigInt: bigint): void;
    /**
     * UNSHIFT: write (BigInt) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 64 of value to unshift.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    unshiftBigInt(countBitsToUnshift: number, valueBigInt: bigint): void;
    /**
     * SHIFT: read (BigInt) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 64 of value to shift.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    shiftBigInt(countBitsToShift: number): bigint;
    /**
     * POP: read (BigInt) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 64 of value to pop.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    popBigInt(countBitsToPop: number): bigint;
    /********** PUBLIC SECTION. Data type: Float32. **********/
    /**
     * SET: write floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    setAtFloat32(bitIndexAt: number, valueFloat32: number): void;
    /**
     * SET: write floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    setUntilFloat32(bitIndexUntil: number, valueFloat32: number): void;
    /**
     * GET: read floating number 32 bits by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @return {number} - Range: same DataView.getFloat32.
     */
    getAtFloat32(bitIndexAt: number): number;
    /**
     * GET: read floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @return {number} - Range: same DataView.getFloat32.
     */
    getUntilFloat32(bitIndexUntil: number): number;
    /**
     * PUSH: write (floating number 32 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    pushFloat32(valueFloat32: number): void;
    /**
     * UNSHIFT: write (floating number 32 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    unshiftFloat32(valueFloat32: number): void;
    /**
     * SHIFT: read (floating number 32 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     */
    shiftFloat32(): number;
    /**
     * POP: read (floating number 32 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     */
    popFloat32(): number;
    /********** PUBLIC SECTION. Data type: Float64. **********/
    /**
     * SET: write floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} valueFloat64 - Range: any number.
     */
    setAtFloat64(bitIndexAt: number, valueFloat64: number): void;
    /**
     * SET: write floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} valueFloat64 - Range: any number.
     */
    setUntilFloat64(bitIndexUntil: number, valueFloat64: number): void;
    /**
     * GET: read floating number 64 bits by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @return {number} - Range: any number.
     */
    getAtFloat64(bitIndexAt: number): number;
    /**
     * GET: read floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @return {number} - Range: any number.
     */
    getUntilFloat64(bitIndexUntil: number): number;
    /**
     * PUSH: write (floating number 64 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number.
     */
    pushFloat64(valueFloat64: number): void;
    /**
     * UNSHIFT: write (floating number 64 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number.
     */
    unshiftFloat64(valueFloat64: number): void;
    /**
     * SHIFT: read (floating number 64 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: any number.
     */
    shiftFloat64(): number;
    /**
     * POP: read (floating number 64 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: any number.
     */
    popFloat64(): number;
    /********** PUBLIC SECTION. Data type: DataView. **********/
    /**
     * SET: write instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 0xFFFFFFFE of value to set.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    setAtDataView(bitIndexAt: number, countBitsToSet: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * SET: write instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 0xFFFFFFFE of value to set.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    setUntilDataView(bitIndexUntil: number, countBitsToSet: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * GET: read instanceOf DataView by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 0xFFFFFFFE of value to get.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    getAtDataView(bitIndexAt: number, countBitsToGet: number, littleEndian?: boolean): DataView;
    /**
     * GET: read instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 0xFFFFFFFE of value to get.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    getUntilDataView(bitIndexUntil: number, countBitsToGet: number, littleEndian?: boolean): DataView;
    /**
     * PUSH: write (instanceOf DataView) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 0xFFFFFFFE of value to push.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    pushDataView(countBitsToPush: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * UNSHIFT: write (instanceOf DataView) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 0xFFFFFFFE of value to unshift.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    unshiftDataView(countBitsToUnshift: number, valueDataView: DataView, littleEndian?: boolean): void;
    /**
     * SHIFT: read (instanceOf DataView) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 0xFFFFFFFE of value to shift.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    shiftDataView(countBitsToShift: number, littleEndian?: boolean): DataView;
    /**
     * POP: read (instanceOf DataView) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 0xFFFFFFFE of value to pop.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    popDataView(countBitsToPop: number, littleEndian?: boolean): DataView;
}
