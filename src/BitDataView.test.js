const { BitDataView } = require('../dist/BitDataView');
//import { BitDataView } from './dist/BitDataView'

test('List should add and retrieve items1', () => {

    let bitDataView = new BitDataView(800 * 8);//tesing result
    const byteDataView = new DataView(bitDataView.buffer);//true result



    const COUNT_TESTS = 1000;
    let timerBegin = new Date();
    bitDataView.push_Nothing(800*8);
    for(let isLittleEndian = 0; isLittleEndian < 2; isLittleEndian++)
    {
        if(isLittleEndian)
            bitDataView.endianness.setLittleEndian();//_setLittleEndian();
        else
            bitDataView.endianness.setBigEndian();// _setBigEndian();

        let valueOrigin, valueCheckedDataView, valueGetted;

        for(let i = 0; i < COUNT_TESTS; i++)
        {
            let byteOffset = Math.floor(Math.random() * 700);

            valueOrigin = Math.floor(Math.random() * 0x100000000);
            bitDataView.setAtUint(byteOffset * 8, 32, valueOrigin);
            valueCheckedDataView = byteDataView.getUint32(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Uint53orLess`);
            valueGetted = bitDataView.getAtUint(byteOffset * 8, 32);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_Uint53orLess`);


            /*JavaScript support Uint53 and Int54, but it hard to make library with Int54 with significant and endianness*/
            valueOrigin = Math.floor(Math.random() * 0x80000000) - 0x40000000;
            bitDataView.setAtInt(byteOffset * 8, 32, valueOrigin);
            valueCheckedDataView = byteDataView.getInt32(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Int53orLess`);
            valueGetted = bitDataView.getAtInt(byteOffset * 8, 32);
            if(valueOrigin !== valueGetted)
            {
                console.error(valueOrigin.toString(16), valueCheckedDataView.toString(16), valueGetted.toString(16))
                throw new Error(`getAt_Int53orLess`);
            }

            valueOrigin = Math.floor(Math.random() * 0x10000);
            bitDataView.setAtUint(byteOffset * 8, 16, valueOrigin);
            valueCheckedDataView = byteDataView.getUint16(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Uint53orLess`);
            valueGetted = bitDataView.getAtUint(byteOffset * 8, 16);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_Uint53orLess`);

            valueOrigin = Math.floor(Math.random() * 0x100);
            bitDataView.setAtUint(byteOffset * 8, 8, valueOrigin);
            valueCheckedDataView = byteDataView.getUint8(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Uint53orLess`);
            valueGetted = bitDataView.getAtUint(byteOffset * 8, 8);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_Uint53orLess`);

            valueOrigin = Math.floor(Math.random() * 0x100);
            bitDataView.setAtByte(byteOffset * 8, 8, valueOrigin);
            valueCheckedDataView = byteDataView.getUint8(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Uint8orLess`);
            valueGetted = bitDataView.getAtByte(byteOffset * 8, 8);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_Uint8orLess`);

            valueOrigin = (BigInt(Math.floor(Math.random() * 0x100000000))<<32n) | BigInt(Math.floor(Math.random() * 0x100000000));
            bitDataView.setAtBigUint(byteOffset * 8, 64, valueOrigin);
            valueCheckedDataView = byteDataView.getBigUint64(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_BigUint64orLess: ${valueOrigin}, ${valueCheckedDataView}`);
            valueGetted = bitDataView.getAtBigUint(byteOffset * 8, 64);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_BigUint64orLess`);

            valueOrigin = (BigInt(Math.floor(Math.random() * 0x80000000)) << 32n) | BigInt(Math.floor(Math.random() * 0x100000000));
            valueOrigin *= (Math.random() > 0.5 ? -1n : 1n);
            //console.log("valueOrigin",valueOrigin.toString(2))
            bitDataView.setAtBigInt(byteOffset * 8, 64, valueOrigin);
            valueCheckedDataView = byteDataView.getBigInt64(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_BigUint64orLess: ${valueOrigin}, ${valueCheckedDataView}`);
            valueGetted = bitDataView.getAtBigInt(byteOffset * 8, 64);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_BigUint64orLess`);

            valueOrigin = Math.random() ;
            byteDataView.setFloat64(0, valueOrigin);
            valueOrigin = byteDataView.getFloat64(0);
            bitDataView.setAtFloat64(byteOffset * 8, valueOrigin);
            valueCheckedDataView = byteDataView.getFloat64(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Float64: ${valueOrigin}, ${valueCheckedDataView}`);
            valueGetted = bitDataView.getAtFloat64(byteOffset * 8);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_Float64`);

            valueOrigin = Math.random() ;
            byteDataView.setFloat32(0, valueOrigin);
            valueOrigin = byteDataView.getFloat32(0);
            bitDataView.setAtFloat32(byteOffset * 8, valueOrigin);
            valueCheckedDataView = byteDataView.getFloat32(byteOffset, !!isLittleEndian);
            if(valueOrigin !== valueCheckedDataView)
                throw new Error(`setAt_Float32: ${valueOrigin}, ${valueCheckedDataView}`);
            valueGetted = bitDataView.getAtFloat32(byteOffset * 8);
            if(valueOrigin !== valueGetted)
                throw new Error(`getAt_Float32`);
        }
    }

    let timerEnd = new Date();
    console.log("test complete",  timerEnd-timerBegin,"msec")
});


try{
    btw.setAtByte(0,0)
    btw.setUntilByte(0,0)
    btw.getAtByte(0)
    btw.getUntilByte(0)
    btw.pushByte(0,0,0)
    btw.unshiftByte(0,0,0)
    btw.shiftByte(0,0)
    btw.popByte(0,0)
    btw._setUntil_Uint8orLess_noAsserts(0,0)
    btw._getUntil_Uint8orLess_noAsserts(0)
    btw._push_Uint8orLess_noAssertsNoExpand(0,0,0)
    btw._unshift_Uint8orLess_noAssertsNoExpand(0,0,0)
    btw._shift_Uint8orLess_noAsserts(0,0)
    btw._pop_Uint8orLess_noAsserts(0,0)
    btw.setAtUint(0,0)
    btw.setUntilUint(0,0)
    btw.getAtUint(0)
    btw.getUntilUint(0)
    btw.pushUint(0,0,0)
    btw.unshiftUint(0,0,0)
    btw.shiftUint(0,0)
    btw.popUint(0,0)
    btw._setUntil_Uint53orLess_noAsserts(0,0)
    btw._getUntil_Uint53orLess_noAsserts(0)
    btw._push_Uint53orLess_noAssertsNoExpand(0,0,0)
    btw._unshift_Uint53orLess_noAssertsNoExpand(0,0,0)
    btw._shift_Uint53orLess_noAsserts(0,0)
    btw._pop_Uint53orLess_noAsserts(0,0)
    btw.setAtInt(0,0)
    btw.setUntilInt(0,0)
    btw.getAtInt(0)
    btw.getUntilInt(0)
    btw.pushInt(0,0,0)
    btw.unshiftInt(0,0,0)
    btw.shiftInt(0,0)
    btw.popInt(0,0)
    btw._setUntil_Int53orLess_noAsserts(0,0)
    btw._getUntil_Int53orLess_noAsserts(0)
    btw._push_Int53orLess_noAssertsNoExpand(0,0,0)
    btw._unshift_Int53orLess_noAssertsNoExpand(0,0,0)
    btw._shift_Int53orLess_noAsserts(0,0)
    btw._pop_Int53orLess_noAsserts(0,0)
    btw.setAtBigUint(0,0)
    btw.setUntilBigUint(0,0)
    btw.getAtBigUint(0)
    btw.getUntilBigUint(0)
    btw.pushBigUint(0,0,0)
    btw.unshiftBigUint(0,0,0)
    btw.shiftBigUint(0,0)
    btw.popBigUint(0,0)
    btw._setUntil_BigUint64orLess_noAsserts(0,0)
    btw._getUntil_BigUint64orLess_noAsserts(0)
    btw._push_BigUint64orLess_noAssertsNoExpand(0,0,0)
    btw._unshift_BigUint64orLess_noAssertsNoExpand(0,0,0)
    btw._shift_BigUint64orLess_noAsserts(0,0)
    btw._pop_BigUint64orLess_noAsserts(0,0)
    btw.setAtBigInt(0,0)
    btw.setUntilBigInt(0,0)
    btw.getAtBigInt(0)
    btw.getUntilBigInt(0)
    btw.pushBigInt(0,0,0)
    btw.unshiftBigInt(0,0,0)
    btw.shiftBigInt(0,0)
    btw.popBigInt(0,0)
    btw._setUntil_BigInt64orLess_noAsserts(0,0)
    btw._getUntil_BigInt64orLess_noAsserts(0)
    btw._push_BigInt64orLess_noAssertsNoExpand(0,0,0)
    btw._unshift_BigInt64orLess_noAssertsNoExpand(0,0,0)
    btw._shift_BigInt64orLess_noAsserts(0,0)
    btw._pop_BigInt64orLess_noAsserts(0,0)
    btw.setAtFloat32(0,0)
    btw.setUntilFloat32(0,0)
    btw.getAtFloat32(0)
    btw.getUntilFloat32(0)
    btw.pushFloat32(0,0,0)
    btw.unshiftFloat32(0,0,0)
    btw.shiftFloat32(0,0)
    btw.popFloat32(0,0)
    btw._setUntil_Float32_noAsserts(0,0)
    btw._getUntil_Float32_noAsserts(0)
    btw._push_Float32_noAssertsNoExpand(0,0,0)
    btw._unshift_Float32_noAssertsNoExpand(0,0,0)
    btw._shift_Float32_noAsserts(0,0)
    btw._pop_Float32_noAsserts(0,0)
    btw.setAtFloat64(0,0)
    btw.setUntilFloat64(0,0)
    btw.getAtFloat64(0)
    btw.getUntilFloat64(0)
    btw.pushFloat64(0,0,0)
    btw.unshiftFloat64(0,0,0)
    btw.shiftFloat64(0,0)
    btw.popFloat64(0,0)
    btw._setUntil_Float64_noAsserts(0,0)
    btw._getUntil_Float64_noAsserts(0)
    btw._push_Float64_noAssertsNoExpand(0,0,0)
    btw._unshift_Float64_noAssertsNoExpand(0,0,0)
    btw._shift_Float64_noAsserts(0,0)
    btw._pop_Float64_noAsserts(0,0)
    btw.setAtDataView(0,0)
    btw.setUntilDataView(0,0)
    btw.getAtDataView(0)
    btw.getUntilDataView(0)
    btw.pushDataView(0,0,0)
    btw.unshiftDataView(0,0,0)
    btw.shiftDataView(0,0)
    btw.popDataView(0,0)
    btw._setUntil_DataView_noAsserts(0,0)
    btw._getUntil_DataView_noAsserts(0)
    btw._push_DataView_noAssertsNoExpand(0,0,0)
    btw._unshift_DataView_noAssertsNoExpand(0,0,0)
    btw._shift_DataView_noAsserts(0,0)
    btw._pop_DataView_noAsserts(0,0)
}catch(ex){}