/**
 * @file    BitNumbering.ts

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
