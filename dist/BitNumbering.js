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
export var EnumBitNumbering;
(function (EnumBitNumbering) {
    EnumBitNumbering[EnumBitNumbering["LSB"] = 0] = "LSB";
    EnumBitNumbering[EnumBitNumbering["MSB"] = 1] = "MSB";
})(EnumBitNumbering || (EnumBitNumbering = {}));
export class BitNumbering extends EventTarget {
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
//# sourceMappingURL=BitNumbering.js.map