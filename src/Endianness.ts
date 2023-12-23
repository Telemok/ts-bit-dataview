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

export enum EnumEndianness {
    LITTLE_ENDIAN = 0,
    BIG_ENDIAN = 1,
}

export class Endianness {
    protected endianness: EnumEndianness;

    public constructor(initialEnumEndianness:EnumEndianness = EnumEndianness.LITTLE_ENDIAN) {
        this.endianness = initialEnumEndianness;
        /*Attention!!! In JavaScript DataView by default is Big Endian!!!*/
    }

    public isBigEndian(): boolean {
        return this.endianness === EnumEndianness.BIG_ENDIAN;
    }

    public isLittleEndian(): boolean {
        return this.endianness === EnumEndianness.LITTLE_ENDIAN;
    }

    public _setBigEndian(): void {
        this.endianness = EnumEndianness.BIG_ENDIAN;
    }
    public setBigEndian(): boolean {
        return this.set(EnumEndianness.BIG_ENDIAN);
    }

    public _setLittleEndian(): void {
        this.endianness = EnumEndianness.LITTLE_ENDIAN;
    }
    public setLittleEndian(): boolean {
        return this.set(EnumEndianness.LITTLE_ENDIAN);
    }

    public get(): EnumEndianness {
        return this.endianness;
    }

    public _set(newEnumEndianness: EnumEndianness): void {
        this.endianness = newEnumEndianness;
    }
    public set(newEnumEndianness: EnumEndianness): boolean {
        let changed = this.endianness !== newEnumEndianness;
        this.endianness = newEnumEndianness;
        return changed;
    }

    public toString(): string {
        return EnumEndianness[this.endianness];
    }
    public setRandom()
    {
        if(Math.random() > 0.5)
            this.setLittleEndian();
        else
            this.setBigEndian();
    }
}