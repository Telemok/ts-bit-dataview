//import {EnumEndianness, Endianness} from "./Endianness";

const { Endianness, EnumEndianness } = require('../dist/Endianness');

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
