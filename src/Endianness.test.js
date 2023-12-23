//import {EnumEndianness, Endianness} from "../dist/esnext/Endianness.js";

const { Endianness, EnumEndianness } = require('../dist/commonjs/Endianness.js');

test('List should add and retrieve items', () => {
    const endianness = new Endianness();

    endianness.isBigEndian();
    endianness.isLittleEndian();
    endianness.setBigEndian();
    endianness.setLittleEndian();
    endianness.get();
    endianness.toString();
    endianness.setRandom();
    endianness.set(EnumEndianness.LittleEndian);

    expect(endianness.get()).toBe(EnumEndianness.LittleEndian);

});
