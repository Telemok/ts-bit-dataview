"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitNumbering = exports.EnumBitNumbering = void 0;
var EnumBitNumbering;
(function (EnumBitNumbering) {
    EnumBitNumbering[EnumBitNumbering["LSB"] = 0] = "LSB";
    EnumBitNumbering[EnumBitNumbering["MSB"] = 1] = "MSB";
})(EnumBitNumbering || (exports.EnumBitNumbering = EnumBitNumbering = {}));
var BitNumbering = /** @class */ (function (_super) {
    __extends(BitNumbering, _super);
    function BitNumbering(initialEnumBitNumbering) {
        if (initialEnumBitNumbering === void 0) { initialEnumBitNumbering = EnumBitNumbering.LSB; }
        var _this = _super.call(this) || this;
        _this.bitNumbering = initialEnumBitNumbering;
        return _this;
    }
    BitNumbering.prototype.isMSB = function () {
        return this.bitNumbering === EnumBitNumbering.MSB;
    };
    BitNumbering.prototype.isLSB = function () {
        return this.bitNumbering === EnumBitNumbering.LSB;
    };
    BitNumbering.prototype.get = function () {
        return this.bitNumbering;
    };
    BitNumbering.prototype.set = function (newEnumBitNumbering) {
        var changed = this.bitNumbering !== newEnumBitNumbering;
        this.bitNumbering = newEnumBitNumbering;
        if (changed) {
            var ev = new Event("change");
            // node-js don't support CustomEvent, typescript don't support event.detail
            //@ts-ignore
            ev.detail = { bitNumbering: this.bitNumbering };
            this.dispatchEvent(ev);
        }
        return changed;
    };
    BitNumbering.prototype.setLSB = function () {
        return this.set(EnumBitNumbering.LSB);
    };
    BitNumbering.prototype.setMSB = function () {
        return this.set(EnumBitNumbering.MSB);
    };
    BitNumbering.prototype.setRandom = function () {
        return this.set(Math.random() >= 0.5 ? EnumBitNumbering.LSB : EnumBitNumbering.MSB);
    };
    BitNumbering.prototype.toString = function () {
        return EnumBitNumbering[this.bitNumbering];
    };
    return BitNumbering;
}(EventTarget));
exports.BitNumbering = BitNumbering;
