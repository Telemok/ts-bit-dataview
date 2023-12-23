/**
 * @file    Endianness.ts

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
