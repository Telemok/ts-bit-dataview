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
/*
* RS-232, HDLC, Ethernet, and USB = LSB + Little Endian
* telemok.com = LSB + Little Endian
* LSB + Little Endian is easiest for developers
* BitDataView recommended to use LSB + Little Endian, it more safe and fast

* BitDataView like to use big-endian byte order with (bits%8)!=0 because bit count must be divisible by 8. little-endian not support it.???
* For storing little endian numbers use new DataView(); Store to dataView numbers. Use .pushDataView, .shiftDataView functions.

*
* */
let tmpArr8 = new Uint8Array(8);
/*Attention!!! In JavaScript DataView by default is Big Endian!!!*/
let tempDataView = new DataView(tmpArr8.buffer);
function assertUintMax(value, maxValue) {
    if (!Number.isInteger(value)) /* Checks integer and typeof === 'number'*/
        throw new TypeError(`(${value}) must be integer`);
    if (!(value >= 0 && value <= maxValue))
        throw new RangeError(`(${value}) must be Uint <= ${maxValue}`);
    return value;
}
function assertIntMinMax(value, minValue, maxValue) {
    if (!Number.isInteger(value)) /* Checks integer and typeof === 'number'*/
        throw new TypeError(`(${value}) must be integer`);
    if (!(minValue <= value && value <= maxValue))
        throw new RangeError(`(${value}) must be ${minValue} <= Int <= ${maxValue}`);
    return value;
}
export class BitDataView {
    /** Little or Big endian byte order, Little Endian is default in JS DataView. */
    endianness = new Endianness();
    /** Lest or Most significant bit order, MSB is default in JS DataView. */
    bitNumbering = new BitNumbering();
    /** automaticMemoryExpansion - false set memory static, unexpandable, fast. true allow extend memory for left and right of array*/
    __automaticMemoryExpansion = false;
    /*Data Uint8Array. Expandable to right or left.*/
    __data;
    /*Data size in bits. Expandable.
    *  maximal 0xFFFFFFFE because C/C++ version of TelemokBitDataView used uint32_t links to head and tail
    * */
    __countBitsPushLimit = 0;
    /* Count bits pushed to right.
.push() increase it to 1.
.pop() decrease it to 1.
_countBitsPushed can not be > _countBitsPushLimit
*/
    __countBitsPushed = 0;
    /*
Count bits shifted from left.
.shift() increase it to 1.
.unshift() decrease it to 1.
_countBitsShifted can not be > _countBitsPushed
_countBitsShifted can not be < 0
*/
    __countBitsShifted = 0;
    //@ts-ignore
    _andBitInMemoryAddress_noAsserts;
    //@ts-ignore
    _orBitInMemoryAddress_noAsserts;
    //@ts-ignore
    _getAt_BitMemoryAddress_noAsserts;
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
    constructor(bufferInfo) {
        this.__automaticMemoryExpansion = false;
        if (bufferInfo === undefined) {
            this.__data = new Uint8Array(64);
            this.__countBitsPushLimit = this.__data.length * 8;
            this.__automaticMemoryExpansion = true;
        }
        else if (typeof bufferInfo === 'number') {
            if (!(Number.isInteger(bufferInfo) && bufferInfo > 0))
                throw new TypeError(`Required uint count of bits`);
            this.__countBitsPushLimit = bufferInfo;
            let bytes = Math.ceil(bufferInfo / 8);
            this.__data = new Uint8Array(bytes);
        }
        else if (bufferInfo instanceof Uint8Array) {
            this.__data = bufferInfo;
            this.__countBitsPushLimit = this.__data.length * 8;
        }
        else if (bufferInfo instanceof ArrayBuffer || ArrayBuffer.isView(bufferInfo)) {
            this.__data = new Uint8Array(bufferInfo);
            this.__countBitsPushLimit = this.__data.length * 8;
        }
        else {
            throw new TypeError('Invalid bufferInfo type');
        }
        this.clear();
        let initLsb = () => {
            this._andBitInMemoryAddress_noAsserts = this._andBitInMemoryAddressLsb_noAsserts;
            this._orBitInMemoryAddress_noAsserts = this._orBitInMemoryAddressLsb_noAsserts;
            this._getAt_BitMemoryAddress_noAsserts = this._getAt_BitMemoryAddressLsb_noAsserts;
        };
        let initMsb = () => {
            this._andBitInMemoryAddress_noAsserts = this._andBitInMemoryAddressMsb_noAsserts;
            this._orBitInMemoryAddress_noAsserts = this._orBitInMemoryAddressMsb_noAsserts;
            this._getAt_BitMemoryAddress_noAsserts = this._getAt_BitMemoryAddressMsb_noAsserts;
        };
        this.bitNumbering.addEventListener("change", () => {
            if (this.bitNumbering.isLSB()) {
                initLsb();
            }
            else if (this.bitNumbering.isMSB()) {
                initMsb();
            }
        });
        initLsb();
    }
    get buffer() { return this.__data.buffer; }
    /**
     * return bits size of stored data
     * @description single constructor
     */
    getCountStoredBits() {
        return this.__countBitsPushed - this.__countBitsShifted;
    }
    _andBitInMemoryAddressLsb_noAsserts = (addressOfBitInMemory) => {
        let addressByte = addressOfBitInMemory >>> 3;
        let addressBit = addressOfBitInMemory & 7;
        let maskBit = 1 << addressBit;
        this.__data[addressByte] &= ~maskBit;
    };
    _orBitInMemoryAddressLsb_noAsserts = (addressOfBitInMemory) => {
        let addressByte = addressOfBitInMemory >>> 3;
        let addressBit = (addressOfBitInMemory & 7);
        let maskBit = 1 << addressBit;
        this.__data[addressByte] |= maskBit;
    };
    _andBitInMemoryAddressMsb_noAsserts = (addressOfBitInMemory) => {
        let addressByte = addressOfBitInMemory >>> 3;
        let addressBit = 7 - (addressOfBitInMemory & 7);
        let maskBit = 1 << addressBit;
        this.__data[addressByte] &= ~maskBit;
    };
    _orBitInMemoryAddressMsb_noAsserts = (addressOfBitInMemory) => {
        let addressByte = addressOfBitInMemory >>> 3;
        let addressBit = 7 - (addressOfBitInMemory & 7);
        let maskBit = 1 << addressBit;
        this.__data[addressByte] |= maskBit;
    };
    _getAt_BitMemoryAddressLsb_noAsserts = (addressOfBitInMemory) => {
        let addressByte = addressOfBitInMemory >>> 3;
        let addressBit = addressOfBitInMemory & 7; // if LSB
        let myByte = this.__data[addressByte];
        return (myByte >>> addressBit) & 1;
    };
    _getAt_BitMemoryAddressMsb_noAsserts = (addressOfBitInMemory) => {
        let addressByte = addressOfBitInMemory >>> 3;
        let addressBit = 7 - addressOfBitInMemory & 7; // if MSB
        let myByte = this.__data[addressByte];
        return (myByte >>> addressBit) & 1;
    };
    /**
     * @description fast clear header of bitDataView
     */
    clear() {
        this.__countBitsPushed = 0;
        this.__countBitsShifted = 0;
    }
    /**
     * @description make copy of bitDataView
     * @param {boolean} copyStrictPrivateStructure - False is default, faster. True is slower, but copy full instance structure.
     */
    clone(copyStrictPrivateStructure = false) {
        let copy = new BitDataView();
        copy.__countBitsPushLimit = this.__countBitsPushLimit;
        if (copyStrictPrivateStructure) { /*clone as it*/
            copy.__countBitsPushed = this.__countBitsPushed;
            copy.__countBitsShifted = this.__countBitsShifted;
            copy.__data = new Uint8Array(this.__data);
        }
        else { /*clone faster and with minimal memory using and optimising _countBitsPushed and _countBitsShifted (only bytes will shifted, not bits)*/
            let moveLeftBytes = Math.floor(this.__countBitsShifted / 8);
            let length = Math.ceil(this.__countBitsPushed / 8) - moveLeftBytes;
            copy.__countBitsShifted = this.__countBitsShifted % 8;
            copy.__countBitsPushed = /*length * 8 + */ this.__countBitsPushed - moveLeftBytes * 8;
            copy.__data = this.__data.subarray(moveLeftBytes, moveLeftBytes + length);
        }
        copy.__automaticMemoryExpansion = this.__automaticMemoryExpansion;
        return copy;
    }
    getAvailableBitsToExpandRight() {
        return 0xFFFFFFFE - this.__countBitsPushLimit;
    }
    getAvailableBitsToPush() {
        if (this.__automaticMemoryExpansion)
            return 0xFFFFFFFE - this.__countBitsPushed;
        return this.__countBitsPushLimit - this.__countBitsPushed;
    }
    getAvailableBitsToUnshift() {
        if (this.__automaticMemoryExpansion)
            return (Math.floor(0xFFFFFFFE / 8) - this.__data.length) * 8 + this.__countBitsShifted;
        return this.__countBitsShifted;
    }
    /**
     * @param {number} expandBits - add 'expandBytes' to buffer size to right
     * @throws {TypeError}
     * @throws {RangeError}
     * @description if no size for push to BitDataView, size can be expanded
     */
    expandRight(expandBits = 256 * 8) {
        if (!this.__automaticMemoryExpansion)
            throw new Error(`BitDataView.expandRight() can't expand memory for ${expandBits} bits, because it deny. .setAutomaticMemoryExpansionOn() or find overflow problem.`);
        assertUintMax(expandBits, 0xFFFFFFFE - this.__countBitsPushLimit); //0xFFFFFFE = (2^32)-2
        this.__countBitsPushLimit += expandBits;
        let newUint8Array = new Uint8Array(Math.ceil(this.__countBitsPushLimit / 8)); //Увеличиваем сразу на много, чтобы часто это не делать.
        newUint8Array.set(this.__data, 0);
        this.__data = newUint8Array;
    }
    /**
     * @param {number} expandBits - count bits to
     * @throws {TypeError}
     * @throws {RangeError}
     * @description Сложение двух чисел*/
    expandLeft(expandBits = 256 * 8) {
        if (!this.__automaticMemoryExpansion)
            throw new Error(`BitDataView.expandLeft() can't expand memory for ${expandBits} bits, because it deny. .setAutomaticMemoryExpansionOn() or find overflow problem.`);
        assertUintMax(expandBits, 0xFFFFFFFF - this.__countBitsPushLimit); //0xFFFFFFF = (2^32)-1
        if (expandBits % 8)
            throw new Error(`expandLeft only allow *8 bit count: 8, 16, 24, ...`);
        let offsetBytes = expandBits >>> 3;
        this.__countBitsPushLimit += expandBits;
        this.__countBitsPushed += expandBits;
        this.__countBitsShifted += expandBits;
        let newUint8Array = new Uint8Array(Math.ceil(this.__countBitsPushLimit / 8));
        newUint8Array.set(this.__data, offsetBytes);
        this.__data = newUint8Array;
    }
    /**
     * @return
     * @param checkPushBits
     * @param bitCountIfExpandRequired
     * @throws {TypeError}
     * @throws {RangeError}
     * @description after run .expandRightIfNeed(x) you can safe do .push(x, ...)
     */
    expandRightIfNeed(checkPushBits, bitCountIfExpandRequired = 256 * 8) {
        //console.log('expandRightIfNeed', checkPushBits,expandBytes,this.__countBitsPushed , this.__countBitsPushLimit)
        if (this.__countBitsPushed + checkPushBits > this.__countBitsPushLimit) {
            if (bitCountIfExpandRequired < checkPushBits)
                bitCountIfExpandRequired = checkPushBits;
            this.expandRight(bitCountIfExpandRequired);
        }
    }
    /**
     * @description Сложение двух чисел
     * @return
     * @param checkUnshiftBits
     * @param bitCountIfExpandRequired
     * @throws {TypeError}
     * @throws {RangeError}
     * @description after run .expandLeftIfNeed(x) you can safe do .unshift(x, ...)
     */
    expandLeftIfNeed(checkUnshiftBits, bitCountIfExpandRequired = 256 * 8) {
        if (this.__countBitsShifted - checkUnshiftBits < 0) {
            if (bitCountIfExpandRequired < checkUnshiftBits)
                bitCountIfExpandRequired = checkUnshiftBits;
            this.expandLeft(bitCountIfExpandRequired);
        }
    }
    _importUint8Array_noAsserts(uint8Array, doClone = true) {
        this.__countBitsPushLimit = this.__countBitsPushed = uint8Array.length * 8;
        this.__countBitsShifted = 0;
        this.__data = doClone ? uint8Array.slice() : uint8Array;
    }
    importUint8Array(uint8Array) {
        this._importUint8Array_noAsserts(uint8Array);
    }
    exportUnit8Array(littleEndian = false) {
        let countBitsToShift = this.getCountStoredBits();
        let countBytes = Math.ceil(countBitsToShift / 8);
        let uint8Array = new Uint8Array(countBytes);
        for (let i = 0; countBitsToShift > 0; i++) {
            let count = Math.min(countBitsToShift, 8);
            let resultByteIndex = littleEndian ? countBytes - 1 - i : i;
            uint8Array[resultByteIndex] = this._getAt_Uint8orLess_noAsserts(i * 8, count);
            countBitsToShift -= 8;
        }
        // for(let i = 0; countBitsToShift > 0; i++)
        // {
        // 	let count = countBitsToShift >= 8 ? 8 : countBitsToShift;
        // 	let resultByteIndex = littleEndian ? countBytes - 1 - i : i;
        // 	uint8Array[resultByteIndex] = this._shift_Uint8orLess_noAsserts(count);
        // 	countBitsToShift -= 8;
        // }
        // let uint8Array = this.shift_UIntegers(8, countElements);
        // if(littleEndian)
        // 	uint8Array.reverse();
        return uint8Array;
    }
    toString01() {
        let s = "";
        for (let i = 0, n = this.getCountStoredBits(); i < n; i++)
            s += this._getAt_Bit_noAsserts(i);
        return /*this.getCountStoredBits()+": "+*/ s;
    }
    /**
     * @return {string} - information about bitDataView
     * */
    toString() {
        // hex: "${this.exportHex()}
        return `BitDataView = {countBitsShifted: ${this.__countBitsShifted}, countBitsPushed: ${this.__countBitsPushed}, getCountStoredBits: ${this.getCountStoredBits()}, countBitsPushLimit: ${this.__countBitsPushLimit}."}`;
    }
    _push_Nothing_noAsserts(countBits) {
        this.__countBitsPushed += countBits;
    }
    push_Nothing(countBits) {
        assertUintMax(countBits, this.getAvailableBitsToPush());
        this._push_Nothing_noAsserts(countBits);
    }
    _unshift_Nothing_noAsserts(countBits) {
        this.__countBitsShifted += countBits;
    }
    /* DATA SET BLOCK*/
    /* DATA SET BLOCK*/
    // _andBitInMemoryAddress_noAsserts(addressOfBitInMemory:number) {
    // 	let addressByte = addressOfBitInMemory >>> 3;
    // 	let addressBit = addressOfBitInMemory & 7;
    // 	if(this.significantBit_isMsb())
    // 		addressBit = 7 - addressBit;
    // 	let maskBit = 1 << addressBit;
    // 	this.__data[addressByte] &= ~maskBit;
    // }
    // _orBitInMemoryAddress_noAsserts(addressOfBitInMemory:number) {
    // 	let addressByte = addressOfBitInMemory >>> 3;
    // 	let addressBit = addressOfBitInMemory & 7;
    // 	if(this.significantBit_isMsb())
    // 		addressBit = 7 - addressBit;
    // 	let maskBit = 1 << addressBit;
    // 	this.__data[addressByte] |= maskBit;
    // }
    /**
     * @description set bit in private memory position index
     * @param {number} bitValue - is boolean. Used as "if(bitValue)"
     * @param {number} addressOfBitInMemory - is 32 bit unsigned integer. Not asserted for raise up work speed. Bit address of memory position, not bit index in array.
     */
    _setBitInMemoryAddress_noAsserts(bitValue, addressOfBitInMemory) {
        if (bitValue)
            this._orBitInMemoryAddress_noAsserts(addressOfBitInMemory);
        else
            this._andBitInMemoryAddress_noAsserts(addressOfBitInMemory);
        /* http://graphics.stanford.edu/~seander/bithacks.html#ConditionalSetOrClearBitsWithoutBranching bit hacks for superscalar CPUs dont' work in JavaScript because: limited to 32 bits, almost 53 bits*/
    }
    /**
     * SET: write boolean by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index at begin. Not asserted.
     * @param {number} valueBit - Range: false or true. Not asserted.
     * @access protected
     */
    _setAt_Bit_noAsserts(bitIndexAt, valueBit) {
        this._setBitInMemoryAddress_noAsserts(valueBit, this.__countBitsShifted + bitIndexAt);
    }
    /** get bit by virtual index at begin of bitDataView.
     * @param {number} bitIndexAt - is 32 bit unsigned integer. Bit address of memory position, not bit index in array.
     * @return {number} - return 0 or 1 bit value.
     * @description
     */
    _getAt_Bit_noAsserts(bitIndexAt) {
        return this._getAt_BitMemoryAddress_noAsserts(this.__countBitsShifted + bitIndexAt);
    }
    /**  push (add to right of bitDataView) 1 bit.
     * @param {boolean} bitValue - 0/1 true/false value to add to right side of bitDataView
     * @description - work faster
     */
    _push_Bit_noAssertsNoExpand(bitValue) {
        this._setBitInMemoryAddress_noAsserts(bitValue, this.__countBitsPushed++);
        //this.__countBitsPushed++;
    }
    /**  push (add to right of bitDataView) some similar bits. Like fill() function.
     * @param {boolean} bitValue - 0/1 true/false value to add to right side of bitDataView
     * @param {number} count - count of similar bits to add. Default = 1.
     * @description - work slower
     */
    push_Bits(bitValue, count = 1) {
        assertUintMax(bitValue, 1); //0 or 1
        assertUintMax(count, this.getAvailableBitsToPush()); //count 0 allowed, no problems
        this.expandRightIfNeed(count);
        for (; count; count--)
            this._push_Bit_noAssertsNoExpand(bitValue);
    }
    /** set (set to custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to get. Not asserted.
     * @param {number} byteData
     * @return {number}
     */
    _setAt_Uint8orLess_noAsserts(bitIndexAt = 0, countBitsToSet = 8, byteData) {
        //console.log(`${bitIndexAt}, ${countBitsToSet}, ${byteData}`)
        let memoryAddress = this.__countBitsShifted + bitIndexAt;
        for ( /*let bitMask = 1*/; countBitsToSet; countBitsToSet--) {
            //this._setBitInMemoryAddress_noAsserts(byteData & bitMask, memoryAddress++);
            //bitMask <<= 1;
            //console.log(`_setAt_Uint8orLess_noAsserts(bitIndexAt=${bitIndexAt},${countBitsToSet},${byteData},memoryAddress=${memoryAddress})`);
            this._setBitInMemoryAddress_noAsserts(byteData & 1, memoryAddress++);
            // let addressByte = memoryAddress >>> 3;
            // let addressBit = 7 - (memoryAddress & 7);
            // let maskBit = 1 << addressBit;
            // if(byteData & 1)
            // 	this.__data[addressByte] |= maskBit;
            // else
            // 	this.__data[addressByte] &= ~maskBit;
            // memoryAddress++;
            //console.log(`all = ${this.toString(2)}`)
            byteData >>>= 1;
        }
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get. Not asserted.
     * @return {number} - byteData
     */
    _getAt_Uint8orLess_noAsserts(bitIndexAt = 0, countBitsToGet = 8) {
        let memoryAddress = this.__countBitsShifted + bitIndexAt;
        let byteData = 0;
        for (let bitMask = 1; countBitsToGet; countBitsToGet--) {
            if (this._getAt_BitMemoryAddress_noAsserts(memoryAddress++))
                byteData |= bitMask;
            bitMask <<= 1;
        }
        return byteData;
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get. Not asserted.
     * @return {number} - byteData
     */
    // getAt_Byte(bitIndexAt = 0, countBitsToGet = 8)
    // {
    // 	countBitsToGet = assertIntMinMax(countBitsToGet, 0, 8, `BitDataView.getAt_Byte(wrong countBitsToGet)`);
    // 	bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet, `BitDataView.getAt_Byte(wrong bitIndexAt)`);
    // 	return this._getAt_Uint8orLess_noAsserts(bitIndexAt, countBitsToGet);
    // }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to get. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @return {number} - value
     */
    _setAt_Uint53orLess_noAsserts(bitIndexAt = 0, countBitsToSet = 53, valueUint /*,  littleEndian = false*/) {
        //console.log("_setAt_Uint53orLess_noAsserts",this.__countBitsShifted,this.__countBitsPushed,"bitIndexAt="+bitIndexAt,"cntBits="+countBitsToSet,"val="+valueUint.toString(16));
        if (this.endianness.isLittleEndian()) //littleEndian = true in C++ TelemokBitDataView
         {
            //console.log(`setAt(${bitIndexAt}).LE.Uint${countBitsToSet}(${valueUint})`);
            for (; countBitsToSet > 0;) //TO DO del countBitsToSet, use bitIndexAt in for
             {
                let subBitsCount = Math.min(countBitsToSet, 8);
                this._setAt_Uint8orLess_noAsserts(bitIndexAt, subBitsCount, valueUint);
                valueUint = Math.floor(valueUint / 0x100); /* "valueUint = (valueUint >> 8) & 0xFF;" work only for first 32 bits */
                countBitsToSet -= 8;
                bitIndexAt += 8;
            }
        }
        else {
            //console.log(`setAt(${bitIndexAt}).BE.Uint${countBitsToSet}(${valueUint})`);
            for (let index = 0; countBitsToSet > 0; index += 8) {
                let subBitsCount = Math.min(countBitsToSet, 8);
                this._setAt_Uint8orLess_noAsserts(bitIndexAt + countBitsToSet - subBitsCount, subBitsCount, valueUint);
                valueUint = Math.floor(valueUint / 0x100); /* "valueUint = (valueUint >> 8) & 0xFF;" work only for first 32 bits */
                countBitsToSet -= 8;
            }
        }
    }
    /** set () unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of valueUint to get. Not asserted.
     * @param {number} valueUint - valueUint
     */
    _setAt_Int53orLess_noAsserts(bitIndexAt = 0, countBitsToSet = 54, valueUint) {
        //console.log("_setAt_Int53orLess_noAsserts",this.__countBitsShifted,this.__countBitsPushed,"bitIndexAt="+bitIndexAt,"cntBits="+countBitsToSet,"val="+valueUint.toString(16));
        if (this.endianness.isLittleEndian()) //littleEndian = true in C++ TelemokBitDataView
         {
            //console.log(`setAt(${bitIndexAt}).LE.Int${countBitsToSet}(${valueUint})`);
            for (; countBitsToSet > 0;) //TO DO del countBitsToSet, use bitIndexAt in for
             {
                let subBitsCount = Math.min(countBitsToSet, 8);
                this._setAt_Uint8orLess_noAsserts(bitIndexAt, subBitsCount, valueUint);
                valueUint = Math.floor(valueUint / 0x100); /* "valueUint = (valueUint >> 8) & 0xFF;" work only for first 32 bits */
                countBitsToSet -= 7;
                bitIndexAt += 8;
            }
        }
        else {
            //console.log(`setAt(${bitIndexAt}).BE.Int${countBitsToSet}(${valueUint})`);
            for (let index = 0; countBitsToSet > 0; index += 8) {
                let subBitsCount = Math.min(countBitsToSet, 8);
                this._setAt_Uint8orLess_noAsserts(bitIndexAt + countBitsToSet - subBitsCount, subBitsCount, valueUint);
                valueUint = Math.floor(valueUint / 0x100); /* "valueUint = (valueUint >> 8) & 0xFF;" work only for first 32 bits */
                countBitsToSet -= 8;
            }
        }
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of valueUint to get. Not asserted.
     * @return {number}  - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     */
    _getAt_Uint53orLess_noAsserts(bitIndexAt = 0, countBitsToGet = 53) {
        //let s = `_getAt_Uint53orLess_noAsserts(${bitIndexAt}, ${countBitsToGet}, ${littleEndian}) =`;
        let result = 0;
        if (this.endianness.isLittleEndian()) /* littleEndian is reverse for shift and pop */ {
            for (let byteMultiplier = 1; countBitsToGet > 0; bitIndexAt += 8) {
                let byteData = this._getAt_Uint8orLess_noAsserts(bitIndexAt, Math.min(countBitsToGet, 8));
                countBitsToGet -= 8;
                result += byteData * byteMultiplier; /* Don't use "result |= (byteData << (8 * byteIndex));" because it work for first 32 bits */
                byteMultiplier *= 0x100;
            }
        }
        else {
            for (; countBitsToGet > 0; bitIndexAt += 8) {
                let count = Math.min(countBitsToGet, 8);
                let byteData = this._getAt_Uint8orLess_noAsserts(bitIndexAt, count);
                countBitsToGet -= 8;
                result *= (1 << count); /* Don't use "result <<= 8;" because it work for first 32 bits */
                result += byteData; /* Don't use "result |= byteData;" because it work for first 32 bits */
            }
        }
        //console.log(`${s} "${result.toString(2)}"`);
        return result;
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of valueUint to get. Not asserted.
     * @return {number} - valueUint
     */
    _getAt_Int53orLess_noAsserts(bitIndexAt = 0, countBitsToGet = 54) {
        let result = 0;
        let countBitsToGetMantissa = countBitsToGet;
        //let maskSign = Math.pow(2, countBitsToGetMantissa - 1);
        let maskNegative = Math.pow(2, countBitsToGetMantissa) - 1;
        if (this.endianness.isLittleEndian()) /* littleEndian is reverse for shift and pop */ {
            //console.log(`getAt(${bitIndexAt}).LE.Int${countBitsToGet}()`);
            for (let byteMultiplier = 1; countBitsToGetMantissa > 0; bitIndexAt += 8) {
                let byteData = this._getAt_Uint8orLess_noAsserts(bitIndexAt, Math.min(countBitsToGetMantissa, 8));
                countBitsToGetMantissa -= 8;
                result += byteData * byteMultiplier; /* Don't use "result |= (byteData << (8 * byteIndex));" because it work for first 32 bits */
                byteMultiplier *= 0x100;
            }
        }
        else {
            //console.log(`getAt(${bitIndexAt}).BE.Int${countBitsToGet}()`);
            //countBitsToGetMantissa--;
            //bitIndexAt++;
            for (; countBitsToGetMantissa > 0; bitIndexAt += 8) {
                let count = Math.min(countBitsToGetMantissa, 8);
                let byteData = this._getAt_Uint8orLess_noAsserts(bitIndexAt, count);
                countBitsToGetMantissa -= 8;
                result *= (1 << count); /* Don't use "result <<= 8;" because it work for first 32 bits */
                result += byteData; /* Don't use "result |= byteData;" because it work for first 32 bits */
            }
        }
        let sign = Math.floor(result / (2 ** (countBitsToGet - 2))) & 1;
        //let sign = (maskSign & result) ? true : false;
        //console.log("sign",sign,maskSign,result)
        if (sign === 1)
            result = result - maskNegative - 1;
        //console.log(`getAt result = ${result}`);
        return result;
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to get. Not asserted.
     * @param {BigInt} value -
     */
    _setAt_BigUint64orLess_noAsserts(bitIndexAt = 0, countBitsToSet = 64, value) {
        tempDataView.setBigUint64(0, value, this.endianness.isLittleEndian());
        let a = 0;
        // if(this.endianness.isLittleEndian())//littleEndian = true in C++ TelemokBitDataView
        // {
        // 	for(; countBitsToSet > 0; )
        // 	{
        // 		let countBitsPushToByte = Math.min(countBitsToSet, 8);
        // 		//console.log("EX",a,tempDataView.getUint8(a),tempDataView.getUint8(7-a),Number(value & 0xFFn))
        // 		//a++
        // 		this._setAt_Uint8orLess_noAsserts(bitIndexAt ,countBitsPushToByte, tempDataView.getUint8(7-a));
        // 		//this._setAt_Uint8orLess_noAsserts(bitIndexAt ,countBitsPushToByte, Number(value & 0xFFn));
        // 		//value >>= 8n;
        // 		countBitsToSet -= 8;
        // 		bitIndexAt += 8;
        // 		a++;
        // 	}
        // }
        // else
        {
            for (; countBitsToSet > 0;) {
                let subBitsCount = Math.min(countBitsToSet, 8);
                this._setAt_Uint8orLess_noAsserts(bitIndexAt + countBitsToSet - subBitsCount, subBitsCount, tempDataView.getUint8(7 - a));
                //this._setAt_Uint8orLess_noAsserts(bitIndexAt+countBitsToSet - subBitsCount, subBitsCount, Number(value & 0xFFn));
                //value >>= 8n;
                countBitsToSet -= 8;
                a++;
            }
        }
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to get. Not asserted.
     * @param {BigInt} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     */
    _setAt_BigInt64orLess_noAsserts(bitIndexAt = 0, countBitsToSet = 64, valueBigInt) {
        tempDataView.setBigUint64(0, valueBigInt, !this.endianness.isLittleEndian());
        for (let a = 0; countBitsToSet > 0; a++) {
            let subBitsCount = Math.min(countBitsToSet, 8);
            this._setAt_Uint8orLess_noAsserts(bitIndexAt + countBitsToSet - subBitsCount, subBitsCount, tempDataView.getUint8(a));
            //this._setAt_Uint8orLess_noAsserts(bitIndexAt+countBitsToSet - subBitsCount, subBitsCount, Number(valueBigInt & 0xFFn));
            //valueBigInt >>= 8n;
            countBitsToSet -= 8;
            //a++;
        }
        // let t = 4n;
        // t.valueOf()
        // if(this.endianness.isLittleEndian())//littleEndian = true in C++ TelemokBitDataView
        // {
        // 	for(; countBitsToSet > 0; )
        // 	{
        // 		let countBitsPushToByte = Math.min(countBitsToSet, 8);
        // 		this._setAt_Uint8orLess_noAsserts(bitIndexAt ,countBitsPushToByte, Number(valueBigInt & 0xFFn));
        // 		valueBigInt >>= 8n;
        // 		countBitsToSet -= 8;
        // 		bitIndexAt += 8;
        // 	}
        // }
        // else
        // {
        // 	for(; countBitsToSet > 0; )
        // 	{
        // 		let subBitsCount = Math.min(countBitsToSet, 8);
        // 		this._setAt_Uint8orLess_noAsserts(bitIndexAt+countBitsToSet - subBitsCount, subBitsCount, Number(valueBigInt & 0xFFn));
        // 		valueBigInt >>= 8n;
        // 		countBitsToSet -= 8;
        // 	}
        // }
    }
    /** get (take from custom place of bitDataView) unsigned integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get. Not asserted.
     */
    _getAt_BigUint64orLess_noAsserts(bitIndexAt = 0, countBitsToGet = 64) {
        let result = 0n;
        if (this.endianness.isLittleEndian()) /* littleEndian is reverse for shift and pop */ {
            for (let byteMultiplier = 1n; countBitsToGet > 0; bitIndexAt += 8) {
                let byteData = BigInt(this._getAt_Uint8orLess_noAsserts(bitIndexAt, Math.min(countBitsToGet, 8)));
                countBitsToGet -= 8;
                result += byteData * byteMultiplier; /* Don't use "result |= (byteData << (8 * byteIndex));" because it work for first 32 bits */
                byteMultiplier <<= 8n;
                //byteMultiplier *= 0x100n;
            }
        }
        else {
            for (; countBitsToGet > 0; bitIndexAt += 8) {
                let count = Math.min(countBitsToGet, 8);
                let byteData = BigInt(this._getAt_Uint8orLess_noAsserts(bitIndexAt, count));
                countBitsToGet -= 8;
                result <<= BigInt(count);
                result |= byteData;
            }
        }
        //console.log(`${s} "${result.toString(2)}"`);
        return result;
    }
    /** get (take from custom place of bitDataView) signed integer.
     * @param {number} bitIndexAt - Bit index from begin of bitDataView. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get. Not asserted.
     */
    _getAt_BigInt64orLess_noAsserts(bitIndexAt = 0, countBitsToGet = 64) {
        //let countBitsToGet2 = countBitsToGet;
        let maskSign = 1n << BigInt(countBitsToGet - 1);
        let maskNegative = (1n << BigInt(countBitsToGet - 1)) - 1n;
        let result = 0n;
        if (this.endianness.isLittleEndian()) /* littleEndian is reverse for shift and pop */ {
            for (let byteMultiplier = 1n; countBitsToGet > 0; bitIndexAt += 8) {
                let byteData = BigInt(this._getAt_Uint8orLess_noAsserts(bitIndexAt, Math.min(countBitsToGet, 8)));
                countBitsToGet -= 8;
                result += byteData * byteMultiplier; /* Don't use "result |= (byteData << (8 * byteIndex));" because it work for first 32 bits */
                byteMultiplier <<= 8n;
                //byteMultiplier *= 0x100n;
            }
        }
        else {
            for (; countBitsToGet > 0; bitIndexAt += 8) {
                let count = Math.min(countBitsToGet, 8);
                let byteData = BigInt(this._getAt_Uint8orLess_noAsserts(bitIndexAt, count));
                countBitsToGet -= 8;
                result <<= BigInt(count);
                result |= byteData;
            }
        }
        //let sign = (Math.floor(result / (2 ** (countBitsToGet2 - 2)))&1) ? true : false;
        let sign = !!(maskSign & result);
        //console.log("sign",sign,maskSign,result)
        //console.log(`getAt64A  ${result.toString(2)}`);
        if (sign) {
            //result =  result & (~maskSign);
            //console.log(`getAt64B   ${result.toString(2)}`);
            result = -(((~result) & maskNegative) + 1n);
            //console.log(`getAt64B-- ${result.toString(2)}`);
            //result =-result;
            //console.log(`getAt64B-  ${result.toString(2)}`);
            //result =  ~result;
            //console.log(`getAt64~   ${result.toString(2)}`);
        }
        //result =( (~result) & maskNegative) + 1n;
        //console.log(`getAt64C ${result.toString(2)}`);
        //console.log(`${s} "${result.toString(2)}"`);
        return result;
    }
    setAt_Uint8Array_noExpandNoAsserts(bitIndexAt = 0, uint8Array, littleEndian = false) {
        if (littleEndian) {
            //for(let i = uint8Array.length - 1; i >= 0; i--)
            for (let i = uint8Array.length - 1; i >= 0; i--)
                this._setAt_Uint8orLess_noAsserts(bitIndexAt + i * 8, 8, uint8Array[uint8Array.length - 1 - i]);
        }
        else {
            for (let i = 0; i < uint8Array.length; i++)
                this._setAt_Uint8orLess_noAsserts(bitIndexAt + i * 8, 8, uint8Array[i]);
        }
    }
    _setUntil_Uint8Array_noExpandNoAsserts(bitIndexUntil = 0, uint8Array, littleEndian = false) {
        return this.setAt_Uint8Array_noExpandNoAsserts(this.getCountStoredBits() - bitIndexUntil - uint8Array.length * 8, uint8Array, littleEndian);
    }
    /**  push (add to right of bitDataView) Uint8Array instance.
     * @param {Uint8Array} uint8Array - uint8Array data to push
     */
    push_Uint8Array(uint8Array /*, littleEndian:boolean = false*/) {
        this.expandRightIfNeed(uint8Array.length * 8);
        this.__countBitsPushed += uint8Array.length * 8;
        this._setUntil_Uint8Array_noExpandNoAsserts(0, uint8Array, false);
        // if(littleEndian)
        // {
        // 	for(let i = uint8Array.length - 1; i >= 0; i--)
        // 		this._push_Uint8orLess_noExpandNoAsserts(8, uint8Array[i]);
        // }
        // else
        // {
        // 	for(let i = 0; i < uint8Array.length; i++)
        // 		this._push_Uint8orLess_noExpandNoAsserts(8, uint8Array[i]);
        // }
    }
    _getAt_Uint8Array_noAsserts(address, countBitsToGet = this.getCountStoredBits(), littleEndian = false) {
        // if(this.__countBitsShifted + bitsEach * count > this.__countBitsPushed)
        // 	throw new Error(`BitDataView.shift_UIntegers(bitsEach = ${bitsEach}, countIfArray = ${countIfArray}) not enough ${bitsEach * count} bits, only ${this.getCountStoredBits()} bits stored.`);
        let countBytes = Math.ceil(countBitsToGet / 8);
        let uint8Array = new Uint8Array(countBytes);
        for (let i = 0; countBitsToGet > 0; i++) {
            let count = countBitsToGet >= 8 ? 8 : countBitsToGet;
            let resultByteIndex = littleEndian ? countBytes - 1 - i : i;
            uint8Array[resultByteIndex] = this._getAt_Uint8orLess_noAsserts(address, count);
            address += 8;
            countBitsToGet -= 8;
        }
        // let uint8Array = this.shift_UIntegers(8, countElements);
        // if(littleEndian)
        // 	uint8Array.reverse();
        return uint8Array;
    }
    /**  shift (take from left of bitDataView) Unit8Array.
     * @param {number} countBitsToShift - Count bits to shift. If count % 8 != 0, free spaces will be filled by 0. Asserted.
     * @param {boolean} littleEndian - undefined by default. Byte order. Asserted.
     * @return {Uint8Array} -
     */
    shift_Uint8Array(countBitsToShift = this.getCountStoredBits(), littleEndian = false) {
        assertUintMax(countBitsToShift, this.getCountStoredBits());
        // if(this.__countBitsShifted + bitsEach * count > this.__countBitsPushed)
        // 	throw new Error(`BitDataView.shift_UIntegers(bitsEach = ${bitsEach}, countIfArray = ${countIfArray}) not enough ${bitsEach * count} bits, only ${this.getCountStoredBits()} bits stored.`);
        let countBytes = Math.ceil(countBitsToShift / 8);
        let uint8Array = new Uint8Array(countBytes);
        for (let i = 0; countBitsToShift > 0; i++) {
            let count = countBitsToShift >= 8 ? 8 : countBitsToShift;
            let resultByteIndex = littleEndian ? countBytes - 1 - i : i;
            uint8Array[resultByteIndex] = this._shift_Uint8orLess_noAsserts(count);
            countBitsToShift -= 8;
        }
        // let uint8Array = this.shift_UIntegers(8, countElements);
        // if(littleEndian)
        // 	uint8Array.reverse();
        return uint8Array;
    }
    //	shift_Uint16Array(countElements) {return this.shift_UIntegers(16, countElements);}
    ///shift_Uint32Array(countElements) {return this.shift_UIntegers(32, countElements);}
    //shift_BigUint64Array(countElements) {return this.shift_UnsignedBigIntegers(64, countElements);}
    /**  pop (take from right of bitDataView) Unit8Array.
     * @param {number} countBitsToPop - Count bytes to pop. Asserted.
     * param {boolean} littleEndian -
     * @return {Uint8Array} -
     */
    pop_Uint8Array(countBitsToPop = this.getCountStoredBits() /*, littleEndian = false*/) {
        assertUintMax(countBitsToPop, this.getCountStoredBits());
        let countElements = Math.ceil(countBitsToPop / 8);
        let uint8Array = new Uint8Array(countElements);
        for (let i = 0; countBitsToPop > 0; i++) {
            let countBitsInCurrentElement = Math.min(countBitsToPop, 8); //countBitsToPop >= 8 ? 8 : countBitsToPop;
            //let resultByteIndex = littleEndian ? countElements - 1 - i : i;
            //uint8Array[resultByteIndex] = this._pop_Uint53orLess_noAsserts(count);
            uint8Array[i] = this._pop_Uint8orLess_noAsserts(countBitsInCurrentElement);
            countBitsToPop -= 8;
        }
        // let uint8Array = this.shift_UIntegers(8, countElements);
        // if(littleEndian)
        // 	uint8Array.reverse();
        return uint8Array;
    }
    _setAt_DataView_noAsserts(bitAddressAt, countBitsToSet, valueDataView, littleEndian = false) {
        let uint8Array = new Uint8Array(valueDataView.buffer);
        this._setAt_Uint8Array_noAsserts(bitAddressAt, countBitsToSet, uint8Array, littleEndian);
    }
    _getAt_DataView_noAsserts(bitAddressAt, countBitsToGet, littleEndian = false) {
        let uint8Array = this._getAt_Uint8Array_noAsserts(bitAddressAt, countBitsToGet, littleEndian);
        return new DataView(uint8Array.buffer);
    }
    _setAt_Uint8Array_noAsserts(bitIndexAt, countBitsToSet, uint8Array, littleEndian = false) {
        if (countBitsToSet != uint8Array.length * 8)
            throw new Error("TODO, custom Uint8Array not ready");
        this.setAt_Uint8Array_noExpandNoAsserts(bitIndexAt, uint8Array, littleEndian);
    }
    _getAt_toUint8Array_noAsserts(uint8Array, address, countBitsToGet = this.getCountStoredBits(), littleEndian = false) {
        let countBytes = Math.ceil(countBitsToGet / 8);
        //let uint8Array = new Uint8Array(countBytes);
        for (let i = 0; countBitsToGet > 0; i++) {
            let count = countBitsToGet >= 8 ? 8 : countBitsToGet;
            let resultByteIndex = littleEndian ? countBytes - 1 - i : i;
            uint8Array[resultByteIndex] = this._getAt_Uint8orLess_noAsserts(address, count);
            address += 8;
            countBitsToGet -= 8;
        }
        // let uint8Array = this.shift_UIntegers(8, countElements);
        // if(littleEndian)
        // 	uint8Array.reverse();
        //return uint8Array;
    }
    _setAt_TempBuffer(bitIndexAt) {
        this.setAt_Uint8Array_noExpandNoAsserts(bitIndexAt, tmpArr8, false);
    }
    _getAt_TempBuffer(bitIndexAt, countBitsToGet, littleEndian = false) {
        return this._getAt_toUint8Array_noAsserts(tmpArr8, bitIndexAt, countBitsToGet, littleEndian);
    }
    _setAt_Float32_noAsserts(bitIndexAt, valueFloat32) {
        tempDataView.setFloat32(0, valueFloat32, this.endianness.isLittleEndian());
        this._setAt_TempBuffer(bitIndexAt);
    }
    _getAt_Float32_noAsserts(bitIndexAt) {
        this._getAt_TempBuffer(bitIndexAt, 32);
        return tempDataView.getFloat32(0, this.endianness.isLittleEndian());
    }
    _setAt_Float64_noAsserts(bitIndexAt, valueFloat64) {
        tempDataView.setFloat64(0, valueFloat64, this.endianness.isLittleEndian());
        this._setAt_TempBuffer(bitIndexAt);
    }
    _getAt_Float64_noAsserts(bitIndexAt) {
        this._getAt_TempBuffer(bitIndexAt, 64);
        return tempDataView.getFloat64(0, this.endianness.isLittleEndian());
    }
    /********** PROTECTED SECTION. Data type: Byte. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to set. Not asserted.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1). Not asserted.
     * @access protected
     */
    _setUntil_Uint8orLess_noAsserts(bitIndexUntil, countBitsToSet, valueByte) {
        return this._setAt_Uint8orLess_noAsserts(this.getCountStoredBits() - countBitsToSet - bitIndexUntil, countBitsToSet, valueByte);
    }
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get. Not asserted.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     * @access protected
     */
    _getUntil_Uint8orLess_noAsserts(bitIndexUntil, countBitsToGet) {
        return this._getAt_Uint8orLess_noAsserts(this.getCountStoredBits() - countBitsToGet - bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 8 of value to push. Not asserted.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1). Not asserted.
     * @access protected
     */
    _push_Uint8orLess_noAssertsNoExpand(countBitsToPush, valueByte) {
        this.__countBitsPushed += countBitsToPush;
        this._setUntil_Uint8orLess_noAsserts(0, countBitsToPush, valueByte);
    }
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 8 of value to unshift. Not asserted.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1). Not asserted.
     * @access protected
     */
    _unshift_Uint8orLess_noAssertsNoExpand(countBitsToUnshift, valueByte) {
        this.__countBitsShifted -= countBitsToUnshift;
        this._setAt_Uint8orLess_noAsserts(0, countBitsToUnshift, valueByte);
    }
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 8 of value to shift. Not asserted.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     * @access protected
     */
    _shift_Uint8orLess_noAsserts(countBitsToShift) {
        let result = this._getAt_Uint8orLess_noAsserts(0, countBitsToShift);
        this.__countBitsShifted += countBitsToShift;
        return result;
    }
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 8 of value to pop. Not asserted.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     * @access protected
     */
    _pop_Uint8orLess_noAsserts(countBitsToPop) {
        let result = this._getUntil_Uint8orLess_noAsserts(0, countBitsToPop);
        this.__countBitsPushed -= countBitsToPop;
        return result;
    }
    /********** PROTECTED SECTION. Data type: Uint. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to set. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @access protected
     */
    _setUntil_Uint53orLess_noAsserts(bitIndexUntil, countBitsToSet, valueUint) {
        return this._setAt_Uint53orLess_noAsserts(this.getCountStoredBits() - countBitsToSet - bitIndexUntil, countBitsToSet, valueUint);
    }
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of value to get. Not asserted.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     * @access protected
     */
    _getUntil_Uint53orLess_noAsserts(bitIndexUntil, countBitsToGet) {
        return this._getAt_Uint53orLess_noAsserts(this.getCountStoredBits() - countBitsToGet - bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 53 of value to push. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @access protected
     */
    _push_Uint53orLess_noAssertsNoExpand(countBitsToPush, valueUint) {
        this.__countBitsPushed += countBitsToPush;
        this._setUntil_Uint53orLess_noAsserts(0, countBitsToPush, valueUint);
    }
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 53 of value to unshift. Not asserted.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1). Not asserted.
     * @access protected
     */
    _unshift_Uint53orLess_noAssertsNoExpand(countBitsToUnshift, valueUint) {
        this.__countBitsShifted -= countBitsToUnshift;
        this._setAt_Uint53orLess_noAsserts(0, countBitsToUnshift, valueUint);
    }
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 53 of value to shift. Not asserted.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     * @access protected
     */
    _shift_Uint53orLess_noAsserts(countBitsToShift) {
        let result = this._getAt_Uint53orLess_noAsserts(0, countBitsToShift);
        this.__countBitsShifted += countBitsToShift;
        return result;
    }
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 53 of value to pop. Not asserted.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     * @access protected
     */
    _pop_Uint53orLess_noAsserts(countBitsToPop) {
        let result = this._getUntil_Uint53orLess_noAsserts(0, countBitsToPop);
        this.__countBitsPushed -= countBitsToPop;
        return result;
    }
    /********** PROTECTED SECTION. Data type: Int. **********/
    /**
     * SET: write signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 1 to 53 of value to set. Not asserted.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1). Not asserted.
     * @access protected
     */
    _setUntil_Int53orLess_noAsserts(bitIndexUntil, countBitsToSet, valueInt) {
        return this._setAt_Int53orLess_noAsserts(this.getCountStoredBits() - countBitsToSet - bitIndexUntil, countBitsToSet, valueInt);
    }
    /**
     * GET: read signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 1 to 53 of value to get. Not asserted.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     * @access protected
     */
    _getUntil_Int53orLess_noAsserts(bitIndexUntil, countBitsToGet) {
        return this._getAt_Int53orLess_noAsserts(this.getCountStoredBits() - countBitsToGet - bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (signed integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 53 of value to push. Not asserted.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1). Not asserted.
     * @access protected
     */
    _push_Int53orLess_noAssertsNoExpand(countBitsToPush, valueInt) {
        this.__countBitsPushed += countBitsToPush;
        this._setUntil_Int53orLess_noAsserts(0, countBitsToPush, valueInt);
    }
    /**
     * UNSHIFT: write (signed integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 53 of value to unshift. Not asserted.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1). Not asserted.
     * @access protected
     */
    _unshift_Int53orLess_noAssertsNoExpand(countBitsToUnshift, valueInt) {
        this.__countBitsShifted -= countBitsToUnshift;
        this._setAt_Int53orLess_noAsserts(0, countBitsToUnshift, valueInt);
    }
    /**
     * SHIFT: read (signed integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 53 of value to shift. Not asserted.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     * @access protected
     */
    _shift_Int53orLess_noAsserts(countBitsToShift) {
        let result = this._getAt_Int53orLess_noAsserts(0, countBitsToShift);
        this.__countBitsShifted += countBitsToShift;
        return result;
    }
    /**
     * POP: read (signed integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 53 of value to pop. Not asserted.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     * @access protected
     */
    _pop_Int53orLess_noAsserts(countBitsToPop) {
        let result = this._getUntil_Int53orLess_noAsserts(0, countBitsToPop);
        this.__countBitsPushed -= countBitsToPop;
        return result;
    }
    /********** PROTECTED SECTION. Data type: BigUint. **********/
    /**
     * SET: write bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to set. Not asserted.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1). Not asserted.
     * @access protected
     */
    _setUntil_BigUint64orLess_noAsserts(bitIndexUntil, countBitsToSet, valueBigUint) {
        return this._setAt_BigUint64orLess_noAsserts(this.getCountStoredBits() - countBitsToSet - bitIndexUntil, countBitsToSet, valueBigUint);
    }
    /**
     * GET: read bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get. Not asserted.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     * @access protected
     */
    _getUntil_BigUint64orLess_noAsserts(bitIndexUntil, countBitsToGet) {
        return this._getAt_BigUint64orLess_noAsserts(this.getCountStoredBits() - countBitsToGet - bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (bigint) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 64 of value to push. Not asserted.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1). Not asserted.
     * @access protected
     */
    _push_BigUint64orLess_noAssertsNoExpand(countBitsToPush, valueBigUint) {
        this.__countBitsPushed += countBitsToPush;
        this._setUntil_BigUint64orLess_noAsserts(0, countBitsToPush, valueBigUint);
    }
    /**
     * UNSHIFT: write (bigint) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 64 of value to unshift. Not asserted.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1). Not asserted.
     * @access protected
     */
    _unshift_BigUint64orLess_noAssertsNoExpand(countBitsToUnshift, valueBigUint) {
        this.__countBitsShifted -= countBitsToUnshift;
        this._setAt_BigUint64orLess_noAsserts(0, countBitsToUnshift, valueBigUint);
    }
    /**
     * SHIFT: read (bigint) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 64 of value to shift. Not asserted.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     * @access protected
     */
    _shift_BigUint64orLess_noAsserts(countBitsToShift) {
        let result = this._getAt_BigUint64orLess_noAsserts(0, countBitsToShift);
        this.__countBitsShifted += countBitsToShift;
        return result;
    }
    /**
     * POP: read (bigint) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 64 of value to pop. Not asserted.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     * @access protected
     */
    _pop_BigUint64orLess_noAsserts(countBitsToPop) {
        let result = this._getUntil_BigUint64orLess_noAsserts(0, countBitsToPop);
        this.__countBitsPushed -= countBitsToPop;
        return result;
    }
    /********** PROTECTED SECTION. Data type: BigInt. **********/
    /**
     * SET: write BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 1 to 64 of value to set. Not asserted.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     * @access protected
     */
    _setUntil_BigInt64orLess_noAsserts(bitIndexUntil, countBitsToSet, valueBigInt) {
        return this._setAt_BigInt64orLess_noAsserts(this.getCountStoredBits() - countBitsToSet - bitIndexUntil, countBitsToSet, valueBigInt);
    }
    /**
     * GET: read BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 1 to 64 of value to get. Not asserted.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     * @access protected
     */
    _getUntil_BigInt64orLess_noAsserts(bitIndexUntil, countBitsToGet) {
        return this._getAt_BigInt64orLess_noAsserts(this.getCountStoredBits() - countBitsToGet - bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (BigInt) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 64 of value to push. Not asserted.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     * @access protected
     */
    _push_BigInt64orLess_noAssertsNoExpand(countBitsToPush, valueBigInt) {
        this.__countBitsPushed += countBitsToPush;
        this._setUntil_BigInt64orLess_noAsserts(0, countBitsToPush, valueBigInt);
    }
    /**
     * UNSHIFT: write (BigInt) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 64 of value to unshift. Not asserted.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1). Not asserted.
     * @access protected
     */
    _unshift_BigInt64orLess_noAssertsNoExpand(countBitsToUnshift, valueBigInt) {
        this.__countBitsShifted -= countBitsToUnshift;
        this._setAt_BigInt64orLess_noAsserts(0, countBitsToUnshift, valueBigInt);
    }
    /**
     * SHIFT: read (BigInt) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 64 of value to shift. Not asserted.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     * @access protected
     */
    _shift_BigInt64orLess_noAsserts(countBitsToShift) {
        let result = this._getAt_BigInt64orLess_noAsserts(0, countBitsToShift);
        this.__countBitsShifted += countBitsToShift;
        return result;
    }
    /**
     * POP: read (BigInt) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 64 of value to pop. Not asserted.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     * @access protected
     */
    _pop_BigInt64orLess_noAsserts(countBitsToPop) {
        let result = this._getUntil_BigInt64orLess_noAsserts(0, countBitsToPop);
        this.__countBitsPushed -= countBitsToPop;
        return result;
    }
    /********** PROTECTED SECTION. Data type: Float32. **********/
    /**
     * SET: write floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32. Not asserted.
     * @access protected
     */
    _setUntil_Float32_noAsserts(bitIndexUntil, valueFloat32) {
        return this._setAt_Float32_noAsserts(this.getCountStoredBits() - 32 - bitIndexUntil, valueFloat32);
    }
    /**
     * GET: read floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @return {number} - Range: same DataView.getFloat32.
     * @access protected
     */
    _getUntil_Float32_noAsserts(bitIndexUntil) {
        return this._getAt_Float32_noAsserts(this.getCountStoredBits() - 32 - bitIndexUntil);
    }
    /**
     * PUSH: write (floating number 32 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32. Not asserted.
     * @access protected
     */
    _push_Float32_noAssertsNoExpand(valueFloat32) {
        this.__countBitsPushed += 32;
        this._setUntil_Float32_noAsserts(0, valueFloat32);
    }
    /**
     * UNSHIFT: write (floating number 32 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32. Not asserted.
     * @access protected
     */
    _unshift_Float32_noAssertsNoExpand(valueFloat32) {
        this.__countBitsShifted -= 32;
        this._setAt_Float32_noAsserts(0, valueFloat32);
    }
    /**
     * SHIFT: read (floating number 32 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     * @access protected
     */
    _shift_Float32_noAsserts() {
        let result = this._getAt_Float32_noAsserts(0);
        this.__countBitsShifted += 32;
        return result;
    }
    /**
     * POP: read (floating number 32 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     * @access protected
     */
    _pop_Float32_noAsserts() {
        let result = this._getUntil_Float32_noAsserts(0);
        this.__countBitsPushed -= 32;
        return result;
    }
    /********** PROTECTED SECTION. Data type: Float64. **********/
    /**
     * SET: write floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} valueFloat64 - Range: any number. Not asserted.
     * @access protected
     */
    _setUntil_Float64_noAsserts(bitIndexUntil, valueFloat64) {
        return this._setAt_Float64_noAsserts(this.getCountStoredBits() - 64 - bitIndexUntil, valueFloat64);
    }
    /**
     * GET: read floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @return {number} - Range: any number.
     * @access protected
     */
    _getUntil_Float64_noAsserts(bitIndexUntil) {
        return this._getAt_Float64_noAsserts(this.getCountStoredBits() - 64 - bitIndexUntil);
    }
    /**
     * PUSH: write (floating number 64 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number. Not asserted.
     * @access protected
     */
    _push_Float64_noAssertsNoExpand(valueFloat64) {
        this.__countBitsPushed += 64;
        this._setUntil_Float64_noAsserts(0, valueFloat64);
    }
    /**
     * UNSHIFT: write (floating number 64 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number. Not asserted.
     * @access protected
     */
    _unshift_Float64_noAssertsNoExpand(valueFloat64) {
        this.__countBitsShifted -= 64;
        this._setAt_Float64_noAsserts(0, valueFloat64);
    }
    /**
     * SHIFT: read (floating number 64 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: any number.
     * @access protected
     */
    _shift_Float64_noAsserts() {
        let result = this._getAt_Float64_noAsserts(0);
        this.__countBitsShifted += 64;
        return result;
    }
    /**
     * POP: read (floating number 64 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: any number.
     * @access protected
     */
    _pop_Float64_noAsserts() {
        let result = this._getUntil_Float64_noAsserts(0);
        this.__countBitsPushed -= 64;
        return result;
    }
    /********** PROTECTED SECTION. Data type: DataView. **********/
    /**
     * SET: write instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToSet - Count bits from 0 to 0xFFFFFFFE of value to set. Not asserted.
     * @param {DataView} valueDataView - Range: any number. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @access protected
     */
    _setUntil_DataView_noAsserts(bitIndexUntil, countBitsToSet, valueDataView, littleEndian = false) {
        return this._setAt_DataView_noAsserts(this.getCountStoredBits() - countBitsToSet - bitIndexUntil, countBitsToSet, valueDataView, littleEndian);
    }
    /**
     * GET: read instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end. Not asserted.
     * @param {number} countBitsToGet - Count bits from 0 to 0xFFFFFFFE of value to get. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     * @access protected
     */
    _getUntil_DataView_noAsserts(bitIndexUntil, countBitsToGet, littleEndian = false) {
        return this._getAt_DataView_noAsserts(this.getCountStoredBits() - countBitsToGet - bitIndexUntil, countBitsToGet, littleEndian);
    }
    /**
     * PUSH: write (instanceOf DataView) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 0xFFFFFFFE of value to push. Not asserted.
     * @param {DataView} valueDataView - Range: any number. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @access protected
     */
    _push_DataView_noAssertsNoExpand(countBitsToPush, valueDataView, littleEndian = false) {
        this.__countBitsPushed += countBitsToPush;
        this._setUntil_DataView_noAsserts(0, countBitsToPush, valueDataView, littleEndian);
    }
    /**
     * UNSHIFT: write (instanceOf DataView) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 0xFFFFFFFE of value to unshift. Not asserted.
     * @param {DataView} valueDataView - Range: any number. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @access protected
     */
    _unshift_DataView_noAssertsNoExpand(countBitsToUnshift, valueDataView, littleEndian = false) {
        this.__countBitsShifted -= countBitsToUnshift;
        this._setAt_DataView_noAsserts(0, countBitsToUnshift, valueDataView, littleEndian);
    }
    /**
     * SHIFT: read (instanceOf DataView) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 0xFFFFFFFE of value to shift. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     * @access protected
     */
    _shift_DataView_noAsserts(countBitsToShift, littleEndian = false) {
        let result = this._getAt_DataView_noAsserts(0, countBitsToShift, littleEndian);
        this.__countBitsShifted += countBitsToShift;
        return result;
    }
    /**
     * POP: read (instanceOf DataView) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 0xFFFFFFFE of value to pop. Not asserted.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     * @access protected
     */
    _pop_DataView_noAsserts(countBitsToPop, littleEndian = false) {
        let result = this._getUntil_DataView_noAsserts(0, countBitsToPop, littleEndian);
        this.__countBitsPushed -= countBitsToPop;
        return result;
    }
    /********** PUBLIC SECTION. Data type: Byte. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to set.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    setAtByte(bitIndexAt, countBitsToSet, valueByte) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 8);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToSet);
        this._setAt_Uint8orLess_noAsserts(bitIndexAt, countBitsToSet, valueByte);
    }
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 8 of value to set.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    setUntilByte(bitIndexUntil, countBitsToSet, valueByte) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 8);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToSet);
        this._setUntil_Uint8orLess_noAsserts(bitIndexUntil, countBitsToSet, valueByte);
    }
    /**
     * GET: read unsigned integer by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    getAtByte(bitIndexAt, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 8);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getAt_Uint8orLess_noAsserts(bitIndexAt, countBitsToGet);
    }
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 8 of value to get.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    getUntilByte(bitIndexUntil, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 8);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getUntil_Uint8orLess_noAsserts(bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 8 of value to push.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    pushByte(countBitsToPush, valueByte) {
        countBitsToPush = assertIntMinMax(countBitsToPush, 0, 8);
        this.expandRightIfNeed(countBitsToPush);
        this._push_Uint8orLess_noAssertsNoExpand(countBitsToPush, valueByte);
    }
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 8 of value to unshift.
     * @param {number} valueByte - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    unshiftByte(countBitsToUnshift, valueByte) {
        countBitsToUnshift = assertIntMinMax(countBitsToUnshift, 0, 8);
        this.expandLeftIfNeed(countBitsToUnshift);
        this._unshift_Uint8orLess_noAssertsNoExpand(countBitsToUnshift, valueByte);
    }
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 8 of value to shift.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    shiftByte(countBitsToShift) {
        countBitsToShift = assertIntMinMax(countBitsToShift, 0, 8);
        return this._shift_Uint8orLess_noAsserts(countBitsToShift);
    }
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 8 of value to pop.
     * @return {number} - Range: 0 <= value <= 0xFF (2 ^ 8 - 1).
     */
    popByte(countBitsToPop) {
        countBitsToPop = assertIntMinMax(countBitsToPop, 0, 8);
        return this._pop_Uint8orLess_noAsserts(countBitsToPop);
    }
    /********** PUBLIC SECTION. Data type: Uint. **********/
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to set.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    setAtUint(bitIndexAt, countBitsToSet, valueUint) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 53);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToSet);
        this._setAt_Uint53orLess_noAsserts(bitIndexAt, countBitsToSet, valueUint);
    }
    /**
     * SET: write unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 53 of value to set.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    setUntilUint(bitIndexUntil, countBitsToSet, valueUint) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 53);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToSet);
        this._setUntil_Uint53orLess_noAsserts(bitIndexUntil, countBitsToSet, valueUint);
    }
    /**
     * GET: read unsigned integer by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of value to get.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    getAtUint(bitIndexAt, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 53);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getAt_Uint53orLess_noAsserts(bitIndexAt, countBitsToGet);
    }
    /**
     * GET: read unsigned integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 53 of value to get.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    getUntilUint(bitIndexUntil, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 53);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getUntil_Uint53orLess_noAsserts(bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (unsigned integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 53 of value to push.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    pushUint(countBitsToPush, valueUint) {
        countBitsToPush = assertIntMinMax(countBitsToPush, 0, 53);
        this.expandRightIfNeed(countBitsToPush);
        this._push_Uint53orLess_noAssertsNoExpand(countBitsToPush, valueUint);
    }
    /**
     * UNSHIFT: write (unsigned integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 53 of value to unshift.
     * @param {number} valueUint - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    unshiftUint(countBitsToUnshift, valueUint) {
        countBitsToUnshift = assertIntMinMax(countBitsToUnshift, 0, 53);
        this.expandLeftIfNeed(countBitsToUnshift);
        this._unshift_Uint53orLess_noAssertsNoExpand(countBitsToUnshift, valueUint);
    }
    /**
     * SHIFT: read (unsigned integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 53 of value to shift.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    shiftUint(countBitsToShift) {
        countBitsToShift = assertIntMinMax(countBitsToShift, 0, 53);
        return this._shift_Uint53orLess_noAsserts(countBitsToShift);
    }
    /**
     * POP: read (unsigned integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 53 of value to pop.
     * @return {number} - Range: 0 <= value <= 0x1FFFFFFFFFFFFF (2 ^ 53 - 1).
     */
    popUint(countBitsToPop) {
        countBitsToPop = assertIntMinMax(countBitsToPop, 0, 53);
        return this._pop_Uint53orLess_noAsserts(countBitsToPop);
    }
    /********** PUBLIC SECTION. Data type: Int. **********/
    /**
     * SET: write signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 53 of value to set.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    setAtInt(bitIndexAt, countBitsToSet, valueInt) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 1, 53);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToSet);
        this._setAt_Int53orLess_noAsserts(bitIndexAt, countBitsToSet, valueInt);
    }
    /**
     * SET: write signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 53 of value to set.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    setUntilInt(bitIndexUntil, countBitsToSet, valueInt) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 1, 53);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToSet);
        this._setUntil_Int53orLess_noAsserts(bitIndexUntil, countBitsToSet, valueInt);
    }
    /**
     * GET: read signed integer by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 53 of value to get.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    getAtInt(bitIndexAt, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 1, 53);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getAt_Int53orLess_noAsserts(bitIndexAt, countBitsToGet);
    }
    /**
     * GET: read signed integer by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 53 of value to get.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    getUntilInt(bitIndexUntil, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 1, 53);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getUntil_Int53orLess_noAsserts(bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (signed integer) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 53 of value to push.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    pushInt(countBitsToPush, valueInt) {
        countBitsToPush = assertIntMinMax(countBitsToPush, 1, 53);
        this.expandRightIfNeed(countBitsToPush);
        this._push_Int53orLess_noAssertsNoExpand(countBitsToPush, valueInt);
    }
    /**
     * UNSHIFT: write (signed integer) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 53 of value to unshift.
     * @param {number} valueInt - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    unshiftInt(countBitsToUnshift, valueInt) {
        countBitsToUnshift = assertIntMinMax(countBitsToUnshift, 1, 53);
        this.expandLeftIfNeed(countBitsToUnshift);
        this._unshift_Int53orLess_noAssertsNoExpand(countBitsToUnshift, valueInt);
    }
    /**
     * SHIFT: read (signed integer) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 53 of value to shift.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    shiftInt(countBitsToShift) {
        countBitsToShift = assertIntMinMax(countBitsToShift, 1, 53);
        return this._shift_Int53orLess_noAsserts(countBitsToShift);
    }
    /**
     * POP: read (signed integer) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 53 of value to pop.
     * @return {number} - Range: -0x10000000000000 (2^52) <= value <= 0xFFFFFFFFFFFFF (2^52-1).
     */
    popInt(countBitsToPop) {
        countBitsToPop = assertIntMinMax(countBitsToPop, 1, 53);
        return this._pop_Int53orLess_noAsserts(countBitsToPop);
    }
    /********** PUBLIC SECTION. Data type: BigUint. **********/
    /**
     * SET: write bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to set.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    setAtBigUint(bitIndexAt, countBitsToSet, valueBigUint) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 64);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToSet);
        this._setAt_BigUint64orLess_noAsserts(bitIndexAt, countBitsToSet, valueBigUint);
    }
    /**
     * SET: write bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 64 of value to set.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    setUntilBigUint(bitIndexUntil, countBitsToSet, valueBigUint) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 64);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToSet);
        this._setUntil_BigUint64orLess_noAsserts(bitIndexUntil, countBitsToSet, valueBigUint);
    }
    /**
     * GET: read bigint by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    getAtBigUint(bitIndexAt, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 64);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getAt_BigUint64orLess_noAsserts(bitIndexAt, countBitsToGet);
    }
    /**
     * GET: read bigint by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 64 of value to get.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    getUntilBigUint(bitIndexUntil, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 64);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getUntil_BigUint64orLess_noAsserts(bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (bigint) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 64 of value to push.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    pushBigUint(countBitsToPush, valueBigUint) {
        countBitsToPush = assertIntMinMax(countBitsToPush, 0, 64);
        this.expandRightIfNeed(countBitsToPush);
        this._push_BigUint64orLess_noAssertsNoExpand(countBitsToPush, valueBigUint);
    }
    /**
     * UNSHIFT: write (bigint) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 64 of value to unshift.
     * @param {bigint} valueBigUint - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    unshiftBigUint(countBitsToUnshift, valueBigUint) {
        countBitsToUnshift = assertIntMinMax(countBitsToUnshift, 0, 64);
        this.expandLeftIfNeed(countBitsToUnshift);
        this._unshift_BigUint64orLess_noAssertsNoExpand(countBitsToUnshift, valueBigUint);
    }
    /**
     * SHIFT: read (bigint) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 64 of value to shift.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    shiftBigUint(countBitsToShift) {
        countBitsToShift = assertIntMinMax(countBitsToShift, 0, 64);
        return this._shift_BigUint64orLess_noAsserts(countBitsToShift);
    }
    /**
     * POP: read (bigint) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 64 of value to pop.
     * @return {bigint} - Range: 0n <= value <= 0xFFFFFFFFFFFFFFFFn (2 ^ 64 - 1).
     */
    popBigUint(countBitsToPop) {
        countBitsToPop = assertIntMinMax(countBitsToPop, 0, 64);
        return this._pop_BigUint64orLess_noAsserts(countBitsToPop);
    }
    /********** PUBLIC SECTION. Data type: BigInt. **********/
    /**
     * SET: write BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 64 of value to set.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    setAtBigInt(bitIndexAt, countBitsToSet, valueBigInt) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 1, 64);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToSet);
        this._setAt_BigInt64orLess_noAsserts(bitIndexAt, countBitsToSet, valueBigInt);
    }
    /**
     * SET: write BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 1 to 64 of value to set.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    setUntilBigInt(bitIndexUntil, countBitsToSet, valueBigInt) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 1, 64);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToSet);
        this._setUntil_BigInt64orLess_noAsserts(bitIndexUntil, countBitsToSet, valueBigInt);
    }
    /**
     * GET: read BigInt by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 64 of value to get.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    getAtBigInt(bitIndexAt, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 1, 64);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getAt_BigInt64orLess_noAsserts(bitIndexAt, countBitsToGet);
    }
    /**
     * GET: read BigInt by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 1 to 64 of value to get.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    getUntilBigInt(bitIndexUntil, countBitsToGet) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 1, 64);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getUntil_BigInt64orLess_noAsserts(bitIndexUntil, countBitsToGet);
    }
    /**
     * PUSH: write (BigInt) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 1 to 64 of value to push.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    pushBigInt(countBitsToPush, valueBigInt) {
        countBitsToPush = assertIntMinMax(countBitsToPush, 1, 64);
        this.expandRightIfNeed(countBitsToPush);
        this._push_BigInt64orLess_noAssertsNoExpand(countBitsToPush, valueBigInt);
    }
    /**
     * UNSHIFT: write (BigInt) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 1 to 64 of value to unshift.
     * @param {bigint} valueBigInt - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    unshiftBigInt(countBitsToUnshift, valueBigInt) {
        countBitsToUnshift = assertIntMinMax(countBitsToUnshift, 1, 64);
        this.expandLeftIfNeed(countBitsToUnshift);
        this._unshift_BigInt64orLess_noAssertsNoExpand(countBitsToUnshift, valueBigInt);
    }
    /**
     * SHIFT: read (BigInt) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 1 to 64 of value to shift.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    shiftBigInt(countBitsToShift) {
        countBitsToShift = assertIntMinMax(countBitsToShift, 1, 64);
        return this._shift_BigInt64orLess_noAsserts(countBitsToShift);
    }
    /**
     * POP: read (BigInt) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 1 to 64 of value to pop.
     * @return {bigint} - Range: -0x8000000000000000n (2^63) <= value <= 0x7FFFFFFFFFFFFFFFn (2^63-1).
     */
    popBigInt(countBitsToPop) {
        countBitsToPop = assertIntMinMax(countBitsToPop, 1, 64);
        return this._pop_BigInt64orLess_noAsserts(countBitsToPop);
    }
    /********** PUBLIC SECTION. Data type: Float32. **********/
    /**
     * SET: write floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    setAtFloat32(bitIndexAt, valueFloat32) {
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - 32);
        this._setAt_Float32_noAsserts(bitIndexAt, valueFloat32);
    }
    /**
     * SET: write floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    setUntilFloat32(bitIndexUntil, valueFloat32) {
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - 32);
        this._setUntil_Float32_noAsserts(bitIndexUntil, valueFloat32);
    }
    /**
     * GET: read floating number 32 bits by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @return {number} - Range: same DataView.getFloat32.
     */
    getAtFloat32(bitIndexAt) {
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - 32);
        return this._getAt_Float32_noAsserts(bitIndexAt);
    }
    /**
     * GET: read floating number 32 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @return {number} - Range: same DataView.getFloat32.
     */
    getUntilFloat32(bitIndexUntil) {
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - 32);
        return this._getUntil_Float32_noAsserts(bitIndexUntil);
    }
    /**
     * PUSH: write (floating number 32 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    pushFloat32(valueFloat32) {
        this.expandRightIfNeed(32);
        this._push_Float32_noAssertsNoExpand(valueFloat32);
    }
    /**
     * UNSHIFT: write (floating number 32 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat32 - Range: same DataView.getFloat32.
     */
    unshiftFloat32(valueFloat32) {
        this.expandLeftIfNeed(32);
        this._unshift_Float32_noAssertsNoExpand(valueFloat32);
    }
    /**
     * SHIFT: read (floating number 32 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     */
    shiftFloat32() {
        return this._shift_Float32_noAsserts();
    }
    /**
     * POP: read (floating number 32 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: same DataView.getFloat32.
     */
    popFloat32() {
        return this._pop_Float32_noAsserts();
    }
    /********** PUBLIC SECTION. Data type: Float64. **********/
    /**
     * SET: write floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} valueFloat64 - Range: any number.
     */
    setAtFloat64(bitIndexAt, valueFloat64) {
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - 64);
        this._setAt_Float64_noAsserts(bitIndexAt, valueFloat64);
    }
    /**
     * SET: write floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} valueFloat64 - Range: any number.
     */
    setUntilFloat64(bitIndexUntil, valueFloat64) {
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - 64);
        this._setUntil_Float64_noAsserts(bitIndexUntil, valueFloat64);
    }
    /**
     * GET: read floating number 64 bits by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @return {number} - Range: any number.
     */
    getAtFloat64(bitIndexAt) {
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - 64);
        return this._getAt_Float64_noAsserts(bitIndexAt);
    }
    /**
     * GET: read floating number 64 bits by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @return {number} - Range: any number.
     */
    getUntilFloat64(bitIndexUntil) {
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - 64);
        return this._getUntil_Float64_noAsserts(bitIndexUntil);
    }
    /**
     * PUSH: write (floating number 64 bits) after end of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number.
     */
    pushFloat64(valueFloat64) {
        this.expandRightIfNeed(64);
        this._push_Float64_noAssertsNoExpand(valueFloat64);
    }
    /**
     * UNSHIFT: write (floating number 64 bits) before begin of bitDataView and increase size.
     * @param {number} valueFloat64 - Range: any number.
     */
    unshiftFloat64(valueFloat64) {
        this.expandLeftIfNeed(64);
        this._unshift_Float64_noAssertsNoExpand(valueFloat64);
    }
    /**
     * SHIFT: read (floating number 64 bits) after begin of bitDataView and reduce size.
     * @return {number} - Range: any number.
     */
    shiftFloat64() {
        return this._shift_Float64_noAsserts();
    }
    /**
     * POP: read (floating number 64 bits) before end of bitDataView and reduce size.
     * @return {number} - Range: any number.
     */
    popFloat64() {
        return this._pop_Float64_noAsserts();
    }
    /********** PUBLIC SECTION. Data type: DataView. **********/
    /**
     * SET: write instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 0xFFFFFFFE of value to set.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    setAtDataView(bitIndexAt, countBitsToSet, valueDataView, littleEndian = false) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 0xFFFFFFFE);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToSet);
        this._setAt_DataView_noAsserts(bitIndexAt, countBitsToSet, valueDataView, littleEndian);
    }
    /**
     * SET: write instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToSet - Count bits from 0 to 0xFFFFFFFE of value to set.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    setUntilDataView(bitIndexUntil, countBitsToSet, valueDataView, littleEndian = false) {
        countBitsToSet = assertIntMinMax(countBitsToSet, 0, 0xFFFFFFFE);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToSet);
        this._setUntil_DataView_noAsserts(bitIndexUntil, countBitsToSet, valueDataView, littleEndian);
    }
    /**
     * GET: read instanceOf DataView by virtual index at begin of bitDataView and don't change size.
     * @param {number} bitIndexAt - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 0xFFFFFFFE of value to get.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    getAtDataView(bitIndexAt, countBitsToGet, littleEndian = false) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 0xFFFFFFFE);
        bitIndexAt = assertIntMinMax(bitIndexAt, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getAt_DataView_noAsserts(bitIndexAt, countBitsToGet, littleEndian);
    }
    /**
     * GET: read instanceOf DataView by virtual index until end of bitDataView and don't change size.
     * @param {number} bitIndexUntil - Integer bit index until end.
     * @param {number} countBitsToGet - Count bits from 0 to 0xFFFFFFFE of value to get.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    getUntilDataView(bitIndexUntil, countBitsToGet, littleEndian = false) {
        countBitsToGet = assertIntMinMax(countBitsToGet, 0, 0xFFFFFFFE);
        bitIndexUntil = assertIntMinMax(bitIndexUntil, 0, this.getCountStoredBits() - countBitsToGet);
        return this._getUntil_DataView_noAsserts(bitIndexUntil, countBitsToGet, littleEndian);
    }
    /**
     * PUSH: write (instanceOf DataView) after end of bitDataView and increase size.
     * @param {number} countBitsToPush - Count bits from 0 to 0xFFFFFFFE of value to push.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    pushDataView(countBitsToPush, valueDataView, littleEndian = false) {
        countBitsToPush = assertIntMinMax(countBitsToPush, 0, 0xFFFFFFFE);
        this.expandRightIfNeed(countBitsToPush);
        this._push_DataView_noAssertsNoExpand(countBitsToPush, valueDataView, littleEndian);
    }
    /**
     * UNSHIFT: write (instanceOf DataView) before begin of bitDataView and increase size.
     * @param {number} countBitsToUnshift - Count bits from 0 to 0xFFFFFFFE of value to unshift.
     * @param {DataView} valueDataView - Range: any number.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     */
    unshiftDataView(countBitsToUnshift, valueDataView, littleEndian = false) {
        countBitsToUnshift = assertIntMinMax(countBitsToUnshift, 0, 0xFFFFFFFE);
        this.expandLeftIfNeed(countBitsToUnshift);
        this._unshift_DataView_noAssertsNoExpand(countBitsToUnshift, valueDataView, littleEndian);
    }
    /**
     * SHIFT: read (instanceOf DataView) after begin of bitDataView and reduce size.
     * @param {number} countBitsToShift - Count bits from 0 to 0xFFFFFFFE of value to shift.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    shiftDataView(countBitsToShift, littleEndian = false) {
        countBitsToShift = assertIntMinMax(countBitsToShift, 0, 0xFFFFFFFE);
        return this._shift_DataView_noAsserts(countBitsToShift, littleEndian);
    }
    /**
     * POP: read (instanceOf DataView) before end of bitDataView and reduce size.
     * @param {number} countBitsToPop - Count bits from 0 to 0xFFFFFFFE of value to pop.
     * @param {boolean} littleEndian - order of bytes, normal or reverse.
     * @return {DataView} - Range: any number.
     */
    popDataView(countBitsToPop, littleEndian = false) {
        countBitsToPop = assertIntMinMax(countBitsToPop, 0, 0xFFFFFFFE);
        return this._pop_DataView_noAsserts(countBitsToPop, littleEndian);
    }
}
//let tempBitDataView = new BitDataView(tmpArr8.buffer);
//# sourceMappingURL=BitDataView.js.map