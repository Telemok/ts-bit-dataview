/**
* https://en.wikipedia.org/wiki/Bit_numbering
 */

export enum EnumBitNumbering {
    LSB = 0,
    MSB = 1,
}

export class BitNumbering extends EventTarget {
    protected bitNumbering: EnumBitNumbering;

    public constructor(initialEnumBitNumbering:EnumBitNumbering = EnumBitNumbering.LSB) {
        super();
        this.bitNumbering = initialEnumBitNumbering;
    }

    public isMSB(): boolean {
        return this.bitNumbering === EnumBitNumbering.MSB;
    }

    public isLSB(): boolean {
        return this.bitNumbering === EnumBitNumbering.LSB;
    }



    public get(): EnumBitNumbering {
        return this.bitNumbering;
    }

    public set(newEnumBitNumbering: EnumBitNumbering): boolean {
        let changed = this.bitNumbering !== newEnumBitNumbering;
        this.bitNumbering = newEnumBitNumbering;
        if(changed)
        {
            let ev = new Event("change");
            // node-js don't support CustomEvent, typescript don't support event.detail
            //@ts-ignore
            ev.detail = {bitNumbering: this.bitNumbering};
            this.dispatchEvent(ev);
        }

        return changed;
    }
    public setLSB(): boolean {
        return this.set(EnumBitNumbering.LSB);
    }
    public setMSB(): boolean {
        return this.set(EnumBitNumbering.MSB);
    }
    public setRandom():boolean
    {
        return this.set(Math.random() >= 0.5 ? EnumBitNumbering.LSB : EnumBitNumbering.MSB);
    }

    public toString(): string {
        return EnumBitNumbering[this.bitNumbering];
    }
}