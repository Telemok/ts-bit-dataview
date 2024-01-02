<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>
</head>

# ts-bit-dataview
TypeScript bit addressing DataView+Stack+Queue+Buffer+Array with any types: Uint13, Int53, BigInt61, Float17, LSB/MSB, LE/BE, .set(), .get(), .push(), .pop(), .shift(), .unshift()

# bitdataview (beta version)

ES6 bit addressing DataView+Stack+Queue+Buffer with any types: Uint13, Int53, BigInt61, Float17, LSB/MSB, LE/BE, .set(), .get(), .push(), .pop(), .shift(), .unshift()

## Features

- Like **DataView**, but with **bit addressing**.
- **.set(), .get(), .push(), .unshift(), .pop(), .shift()** methods for each data type.
- Data types: boolean and custom bit size integers and floats. For example: **Uint17**, **Int39** or **BigUint59**.
- Like a **BitBuffer**, **BitArray**, **BitStack**, **BitQueue**.
- **Small memory** using: 1 bit in memory for every 1 bit data. 23 bits data => 3 bytes in RAM.
- Full **assert arguments** of functions.
- Endianness: **Little Endian** and Big Endian byte order supported.
- Bit numbering: **LSB** (lest significant bit) by default, MSB (most SB) is supported.
- Can export and import to **C/C++ BitDataView** library (only if LSB + Little Endian).
- 100 asserted main methods, 100 unasserted fast methods, > 20 advanced methods
- Binary parsing and decrypting RS-232, HDLC, Ethernet, USB, Can-Bus, TCP/IP RAW packets.
- NodeJs and browser Javascript support.
- Can be used in external schemas. Used in Telemok schemas.
- Old browser support.
- IOT pack data for exchange between C/C++ and JavaScript ready.

## Examples:
Available in folder /examples/

#### 1. Pack Uint7, Boolean, Int43 variables to hex. And unpack.

```javascript
import { BitDataView } from '@telemok/ts-bit-dataview';

let sourceData = {
	percents: 99, // maximal 7 bits
	isOn: true, // 1 bit
	moneyBalance: -1234567890123, // maximal 43 bits
};
let source = new BitDataView();
source.push_Byte(/*pack*/ 7 /*bits*/, sourceData.percents);
source.push_Bits(/*pack 1 bit*/sourceData.isOn);
source.push_Int(/*pack*/ 43 /*bits*/, sourceData.moneyBalance);
console.log("storedBits", source.getCountStoredBits());//storedBits 51
let hex = source.exportHex();//export 7 + 1 + 43 = 51 bits or 7 bytes
console.log("hex", hex);//hex e335fb048ee006
console.log("JSON length", JSON.stringify(sourceData).length);//JSON length 57
//Data packed from 57 to 5 bytes, 11.4x compression ratio.
//send hex to another device, or store, or localstorage
// [another computer another script.js]
let dest = new BitDataView();
dest.importHex(hex);//import "e335fb048ee006"
let result = {
	percents: dest.shift_Byte(/*unpack*/ 7 /*bits*/),
	isOn: dest.shift_Bit(/*unpack 1 bit*/),
	moneyBalance: dest.shift_Int(/*unpack*/ 43 /*bits*/),
};
console.log("result", result);
//result { percents: 99, isOn: 1, moneyBalance: -1234567890123 }
```

#### 2. Pack Uint7, Uint5, Uint6, Bool, Uint12 variables in C/C++.

```cpp
struct Example {
    unsigned percents : 7; // 0 - 100 (max 127)
    unsigned hours : 5; // 0 - 24 (max 31)
    unsigned minutes : 6; // 0 - 60 (max 63)
    unsigned enabled : 1; // 0 - 1
    unsigned ds18b20 : 12; // 0 - 4095
};
Example example;
int main(){// .exe 0x64 Ryzen 5500U
    example.percents = 99;
    example.hours = 19;
    example.minutes = 22;
    example.enabled = 1;
    example.ds18b20 = 1991;
    for (int i = 0; i < sizeof(Example); i++)
        printf("%02X", ((unsigned char*)(&example))[i]);
    // output: "E3693D3E" (LSB, Little Endian)
}
```

#### 3. New instance with parameters

```javascript
import { BitDataView } from '@telemok/ts-bit-dataview';

let bitdataview = new BitDataView({
    automaticMemoryExpansion: true,//Allow auto expand, when push or unshift
    bufferBaseSizeBits: 0, //Base size, default is 256 * 8 bits
    significantBit: "LSB", //Bits order
    endianness: "BIG_ENDIAN", //Bytes order
    startOffsetBits: 0, //Move start offset to begin of buffer
});
```
#### 4. Make binary packed packet

```javascript
import { BitDataView } from '@telemok/ts-bit-dataview';

function userPutDataToPacket(bdv) {//put some user different data
	bdv.push_Uint(12, driver.PACKET_TYPE_TELEMETRY_1);
	bdv.push_Float32(driver.getTemperature());
	bdv.push_Int(19, driver.getBalance());
	bdv.push_Byte(7, driver.getPercents());
	bdv.push_Uint(12, driver.getThermocouple());
	bdv.push_BigUint(59, driver.getUptimeTicks());
}

let bdv = new BitDataView({
    automaticMemoryExpansion: false, //Fixed buffer size, deny auto expand
    bufferBaseSizeBits: 400, //Buffer size bits
    significantBit: "LSB", //Bits order
    endianness: "LITTLE_ENDIAN", //Bytes order
    startOffsetBits: 9 + 12, //Move offset for prepend packet header
});
userPutDataToPacket(bdv);//Get any user data
if(bdv.getCountStoredBits() > 375)//Check data size overflow
	throw new Error(`Overflow`);
bdv.unshift_Uint(9, bdv.getCountStoredBits());//Put 9-bits length BEFORE packet.
let uint8ArrayPacket = bdv.exportUnit8Array();//Zeroes will be added to end of byte
bdv.unshift_Uint(16, crc16(uint8ArrayPacket));//Add crc16 of length+packet to begin of packet
bdv.push_Uint(8, "\n".charCodeAt(0));//Add "\n" as end of packet

protocol.sendHex(bitdataview.exportHex());
```
#### 5. Parse binary unpack packet

```javascript
import { BitDataView } from '@telemok/ts-bit-dataview';

let bitdataview = new BitDataView();

function parsePacket(bitdataview:BitDataView)
{
    let length = bitdataview.shift(9);//Read 9-bit length from begin of packet
    if(length > bitdataview.getCountStoredBits())
	    throw new Error(`Wrong length`);
    let packetType = bitdataview.shift_Uint(12);
    if(packetType === driver.PACKET_TYPE_TELEMETRY_1)
    {
        //Check packet size if need. But if no data will be auto throw. Length don't used, it example.
        let result = {
            temperature: bitdataview.shiftFloat32(),
            balance: bitdataview.shiftInt(19),
            percents: bitdataview.shiftByte(7),
            thermocouple: bitdataview.shiftUint(12),
            uptimeTicks: bitdataview.shiftBigUint(59),
        };
        console.log("result","PACKET_TYPE_TELEMETRY_1", result);
    }
	else
		console.error(`Parsed wrong packet type`, packetType);
}

protocol.addEventListener('readByte', event =>{
       let byte = event.detail.byte;//Validate byte if need
    
    if(byte === "\n".charCodeAt(0)){//end of packet finded
        if(bitdataview.getCountStoredBits() < 9 + 16 + 12)
          throw new Error(`Low size packet`);
        let crc16True = bitdataview.shift_Uint(16);//Read crc16 from packet
        let uint8ArrayPacket = bitdataview.exportUnit8Array();//Zeroes will be added to end of byte
        let crc16Calc = crc16(uint8ArrayPacket);//Calc crc16 of length+packet to end of packet
        if(crc16True !== crc16Calc)
          throw new Error(`Wrong crc16`);
        parsePacket(bitdataview);
    }
    if(bitdataview.getAvailableBitsToPush() < 8){
        bitdataview.clear();
        console.error("Wrong packet stream");
        return;
    }
    bitdataview.push_Byte(8, byte);
});
```

## Source code:
https://github.com/Telemok/ts-bit-dataview.git

## Installation to NodeJs:
1. ><ins id="code1">npm install git+https://github.com/Telemok/ts-bit-dataview.git </ins>
   <button data-clipboard-target="#code1" class="flex gap-1 items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>Copy code</button>

2. <code>import { BitDataView } from '@telemok/ts-bit-dataview';</code>
3. ``const bitDataView = new BitDataView();``



## Installation to DOM .html
script type="module">
import {BitDataView} from "https://cdn.jsdelivr.net/gh/Telemok/ts-bit-dataview/dist/es-bundle.min.js"

## Main functions:
```javascript
/* setAt - set value in address at begin of bitDataView (dont't change size) */
setAtBit(bitIndexAt, value)
setAtByte(bitIndexAt, countBitsToSet/*0-8*/, value)
setAtUint(bitIndexAt, countBitsToSet/*0-53*/, value)//use endianness
setAtInt(bitIndexAt, countBitsToSet/*1-53*/, value)//use endianness
setAtBigUint(bitIndexAt, countBitsToSet/*0-64*/, value)//use endianness
setAtBigInt(bitIndexAt, countBitsToSet/*1-64*/, value)//use endianness
setAtFloat32(bitIndexAt, value)//use endianness
setAtFloat64(bitIndexAt, value)//use endianness

/* setUntil - set value in address until end of bitDataView (dont't change size) */
setUntilBit(bitIndexUntil, value)
setUntilByte(bitIndexUntil, countBitsToSet/*0-8*/, value)
setUntilUint(bitIndexUntil, countBitsToSet/*0-53*/, value)//use endianness
setUntilInt(bitIndexUntil, countBitsToSet/*1-53*/, value)//use endianness
setUntilBigUint(bitIndexUntil, countBitsToSet/*0-64*/, value)//use endianness
setUntilBigInt(bitIndexUntil, countBitsToSet/*1-64*/, value)//use endianness
setUntilFloat32(bitIndexUntil, value)//use endianness
setUntilFloat64(bitIndexUntil, value)//use endianness

/* getAt - get value in address at begin of bitDataView (dont't change size) */
getAtBit(bitIndexAt)
getAtByte(bitIndexAt, countBitsToSet/*0-8*/)
getAtUint(bitIndexAt, countBitsToSet/*0-53*/)//use endianness
getAtInt(bitIndexAt, countBitsToSet/*1-53*/)//use endianness
getAtBigUint(bitIndexAt, countBitsToSet/*0-64*/)//use endianness
getAtBigInt(bitIndexAt, countBitsToSet/*1-64*/)//use endianness
getAtFloat32(bitIndexAt)//use endianness
getAtFloat64(bitIndexAt)//use endianness

/* getUntil - get value in address until end of bitDataView (dont't change size) */
getUntilBit(bitIndexUntil)
getUntilByte(bitIndexUntil, countBitsToSet/*0-8*/)
getUntilUint(bitIndexUntil, countBitsToSet/*0-53*/)//use endianness
getUntilInt(bitIndexUntil, countBitsToSet/*1-53*/)//use endianness
getUntilBigUint(bitIndexUntil, countBitsToSet/*0-64*/)//use endianness
getUntilBigInt(bitIndexUntil, countBitsToSet/*1-64*/)//use endianness
getUntilFloat32(bitIndexUntil)//use endianness
getUntilFloat64(bitIndexUntil)//use endianness


/* push - add value before end of bitDataView (increase size) */
pushNothing(countBits)
pushBits(value, count = 1)
pushByte(countBitsToSet/*0-8*/, value)
pushUint(countBitsToSet/*0-53*/, value)//use endianness
pushInt(countBitsToSet/*1-53*/, value)//use endianness
pushBigUint(countBitsToSet/*0-64*/, value)//use endianness
pushBigInt(countBitsToSet/*1-64*/, value)//use endianness
pushFloat32(value)//use endianness
pushFloat64(value)//use endianness
pushDataView(dataView, littleEndian = false)

/* unshift - add value before begin of bitDataView (increase size) */
unshiftBits(value, count = 1)
unshiftByte(countBitsToSet/*0-8*/, value)
unshiftUint(countBitsToSet/*0-53*/, value)//use endianness
unshiftInt(countBitsToSet/*1-53*/, value)//use endianness
unshiftBigUint(countBitsToSet/*0-64*/, value)//use endianness
unshiftBigInt(countBitsToSet/*1-64*/, value)//use endianness
unshiftFloat32(value)//use endianness
unshiftFloat64(value)//use endianness
unshiftDataView(dataView, littleEndian = false)

/* pop - take value from end of bitDataView (reduce size) */
popBit(count = 1)
popByte(countBitsToSet/*0-8*/)
popUint(countBitsToSet/*0-53*/)//use endianness
popInt(countBitsToSet/*1-53*/)//use endianness
popBigUint(countBitsToSet/*0-64*/)//use endianness
popBigInt(countBitsToSet/*1-64*/)//use endianness
popFloat32()//use endianness
popFloat64()//use endianness
popDataView(countBytes = undefined , littleEndian = false)

/* shift - take value from begin of bitDataView (reduce size) */
shiftBit(count = 1)
shiftByte(countBitsToSet/*0-8*/)
shiftUint(countBitsToSet/*0-53*/)//use endianness
shiftInt(countBitsToSet/*1-53*/)//use endianness
shiftBigUint(countBitsToSet/*0-64*/)//use endianness
shiftBigInt(countBitsToSet/*1-64*/)//use endianness
shiftFloat32()//use endianness
shiftFloat64()//use endianness
shiftDataView(countBytes = undefined , littleEndian = false)

importUint8Array(uint8Array)
exportUnit8Array(littleEndian = false)
```

## Advanced functions:

```javascript
clear(fullClear = false, sizeBits = 256 * 8)
clone(copyStrictPrivateStructure = false)

const bitNumbering = new BitNumbering();
bitNumbering.isMSB();
bitNumbering.isLSB();
bitNumbering.setMSB();
bitNumbering.setLSB();
bitNumbering.get();
bitNumbering.toString();
bitNumbering.setRandom();
bitNumbering.set(EnumBitNumbering.LSB);

const endianness = new Endianness();
endianness.isBigEndian();
endianness.isLittleEndian();
endianness.setBigEndian();
endianness.setLittleEndian();
endianness.get();
endianness.toString();
endianness.setRandom();
endianness.set(EnumEndianness.LittleEndian);


getCountStoredBits()
getAvailableBitsToExpandRight()
getAvailableBitsToPush()
getAvailableBitsToUnshift()
expandRight(expandBits = 256 * 8)
expandLeft(expandBits = 256 * 8)
expandRightIfNeed(checkPushBits, bitCountIfExpandRequired = 256 * 8)
expandLeftIfNeed(checkUnshiftBits, bitCountIfExpandRequired = 256 * 8)	

toString()

```

## Tests:

### Test1. Compare with DataView component (70 msec)
Only LSB.

Little endian and big endian.

1000 random offsets and values
```javascript
dataView.getUint32() vs .setAtUint(32) and .getAtUint(32)
dataView.getInt32() vs .setAtInt(32) and .getAtInt(32)
dataView.getUint16() vs .setAtUint(16) and .getAtUint(16)
dataView.getUint8() vs .setAtUint(8) and .getAtUint(8)
dataView.getUint8() vs .setAtByte(8) and .getAtByte(8)
dataView.getBigUint64() vs .setAtBigUint(64) and .getAtBigUint(64)
dataView.getFloat64() vs .setAtFloat64() and .getAtFloat64()
dataView.getFloat32() vs .setAtFloat32() and .getAtFloat32()
```

## Another libs another authors:

Warning, table has many mistakes!

Url | Lng | Addr<BR>bits | Var<BR>bits | LE<BR>BE | MSB<BR>LSB| types | Buffer<BR>Stack<BR>Queue<BR>Schema | Comment
--- | --- | ---- | ---- | ------  | ------- | ------- | -------| -------
https://github.com/Telemok/ts-bit-dataview.git | TS | x1 | x1 | LE<BR>BE | MSB<BR>LSB| bool<BR>(u)int<BR>flt1-64<BR>big(U)Int | Buffer<BR>Stack<BR>Queue | This library
https://www.npmjs.com/package/@telemok/bitdataview <BR>https://github.com/Telemok/bitdataview | JS | x1 | x1 | LE<BR>BE | MSB<BR>LSB| bool<BR>(u)int<BR>flt1-64<BR>big(U)Int | Buffer<BR>Stack<BR>Queue | Old library
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView | JS | x8 | x8 | LE<BR>BE | | (u)int<BR>flt32-64<BR>big(U)Int | Buffer | Internal
https://nodejs.org/api/buffer.html | JS | x8 | x8 |  | |  | Buffer | Internal
https://github.com/feross/buffer | JS | x8 | x8 |  | |  | Buffer |
https://github.com/JoshGlazebrook/smart-buffer | JS | x8 | x8 |  | |  | Buffer |
https://github.com/FlorianWendelborn/bitwise | JS | x1 |  |  | | bool | Array | ?Many memory
https://github.com/inolen/bit-buffer | JS | x8 | x8 |  | |  | Buffer |
https://github.com/rochars/byte-data | JS | x8 | x8 |  | |  | Buffer |
https://github.com/uupaa/Bit.js/ | JS | x1 | x1 |  | | bool<BR>uint | Buffer |
https://github.com/fredricrylander/bits | JS | x1 | x1 |  | | bool<BR>uint | Buffer |
https://github.com/steinwurf/bitter | C++ | x1 | x1 | LE | MSB<BR>LSB | bool<BR>uint | Buffer |
https://github.com/conekt/bitsandbytes | JS | x8 | x8 | LE<BR>BE |  | | Queue? |
https://github.com/thi-ng/umbrella/tree/develop/packages/bitstream | JS | x1 | x1 | BE | LSB | bool<BR>uint | Queue |
https://github.com/reklatsmasters/binary-data | JS | x8 | x8 | BE<BR>LE |  | uint8x | Queue |
https://github.com/foliojs/restructure | JS | x8 | x8 | BE<BR>LE |  | uint8x<BR>flt16-64 | Queue |
https://www.npmjs.com/package/node-bit-stream | JS | x8 | x8 |  |  |  |  |
https://www.npmjs.com/package/bits-bytes | JS | x1 | x1 |  |  | bool<BR>uint | ??? |
https://www.npmjs.com/package/@binary-format/binary-format | TS | x8 | x8 |  |  |uint | Queue |
https://www.npmjs.com/package/hipparchos | JS | x1 | x8 |  |  |uint | Buffer |
https://www.npmjs.com/package/@thi.ng/rle-pack | TS | x1 | x1 |  |  |uint |  |  no direct access
https://www.npmjs.com/package/binopsy | JS |  |  |  |  |   |  |
https://www.npmjs.com/package/uint-buffer | JS | x8 | x8 | LE<BR>BE |  | uint  | Buffer | like DataView
https://github.com/keichi/binary-parser | JS | x8 | x8 | LE<BR>BE |  |  |  |
https://github.com/anfema/bin-grammar | JS | x8 | x8 | LE<BR>BE |  | uint | Schema |
https://www.npmjs.com/package/@astronautlabs/bitstream | ES6 | -- | x1 | BE | MSB<BR>LSB | uint | Queue | Many interesting code.
https://github.com/RobertBorg/node-BinaryFormat | JS | x8 | x8 | ??? | ??? |??? | Schema |  C/compatible
https://rochars.github.io/byte-data/ | JS | x8 | x8 | LE<BR>BE | ??? | (u)int<BR>flt16-64<BR>utf8(1-4) | Queue |  C/compatible

