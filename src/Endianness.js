"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endianness = exports.EnumEndianness = void 0;
var EnumEndianness;
(function (EnumEndianness) {
    EnumEndianness[EnumEndianness["LITTLE_ENDIAN"] = 0] = "LITTLE_ENDIAN";
    EnumEndianness[EnumEndianness["BIG_ENDIAN"] = 1] = "BIG_ENDIAN";
})(EnumEndianness || (exports.EnumEndianness = EnumEndianness = {}));
var Endianness = /** @class */ (function () {
    function Endianness(initialEnumEndianness) {
        if (initialEnumEndianness === void 0) { initialEnumEndianness = EnumEndianness.LITTLE_ENDIAN; }
        this.endianness = initialEnumEndianness;
        /*Attention!!! In JavaScript DataView by default is Big Endian!!!*/
    }
    Endianness.prototype.isBigEndian = function () {
        return this.endianness === EnumEndianness.BIG_ENDIAN;
    };
    Endianness.prototype.isLittleEndian = function () {
        return this.endianness === EnumEndianness.LITTLE_ENDIAN;
    };
    Endianness.prototype._setBigEndian = function () {
        this.endianness = EnumEndianness.BIG_ENDIAN;
    };
    Endianness.prototype.setBigEndian = function () {
        return this.set(EnumEndianness.BIG_ENDIAN);
    };
    Endianness.prototype._setLittleEndian = function () {
        this.endianness = EnumEndianness.LITTLE_ENDIAN;
    };
    Endianness.prototype.setLittleEndian = function () {
        return this.set(EnumEndianness.LITTLE_ENDIAN);
    };
    Endianness.prototype.get = function () {
        return this.endianness;
    };
    Endianness.prototype._set = function (newEnumEndianness) {
        this.endianness = newEnumEndianness;
    };
    Endianness.prototype.set = function (newEnumEndianness) {
        var changed = this.endianness !== newEnumEndianness;
        this.endianness = newEnumEndianness;
        return changed;
    };
    Endianness.prototype.toString = function () {
        return EnumEndianness[this.endianness];
    };
    Endianness.prototype.setRandom = function () {
        if (Math.random() > 0.5)
            this.setLittleEndian();
        else
            this.setBigEndian();
    };
    return Endianness;
}());
exports.Endianness = Endianness;
