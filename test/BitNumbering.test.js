//import {EnumBitNumbering, BitNumbering} from "../dist/esnext/BitNumbering";
//Jest not support import
const { BitNumbering, EnumBitNumbering } = require('../dist/commonjs/BitNumbering.js');

test('List should add and retrieve items', () => {
    const bitNumbering = new BitNumbering();

    bitNumbering.isMSB();
    bitNumbering.isLSB();
    bitNumbering.setMSB();
    bitNumbering.setLSB();
    bitNumbering.get();
    bitNumbering.toString();
    bitNumbering.setRandom();
    bitNumbering.set(EnumBitNumbering.LSB);

    expect(bitNumbering.get()).toBe(EnumBitNumbering.LSB);

});
