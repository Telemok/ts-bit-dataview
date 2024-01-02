var EnumEndianness,EnumBitNumbering;!function(t){t[t.LITTLE_ENDIAN=0]="LITTLE_ENDIAN",t[t.BIG_ENDIAN=1]="BIG_ENDIAN"}(EnumEndianness||(EnumEndianness={}));class Endianness{endianness;constructor(t=EnumEndianness.LITTLE_ENDIAN){this.endianness=t}isBigEndian(){return this.endianness===EnumEndianness.BIG_ENDIAN}isLittleEndian(){return this.endianness===EnumEndianness.LITTLE_ENDIAN}_setBigEndian(){this.endianness=EnumEndianness.BIG_ENDIAN}setBigEndian(){return this.set(EnumEndianness.BIG_ENDIAN)}_setLittleEndian(){this.endianness=EnumEndianness.LITTLE_ENDIAN}setLittleEndian(){return this.set(EnumEndianness.LITTLE_ENDIAN)}get(){return this.endianness}_set(t){this.endianness=t}set(t){let s=this.endianness!==t;return this.endianness=t,s}toString(){return EnumEndianness[this.endianness]}setRandom(){Math.random()>.5?this.setLittleEndian():this.setBigEndian()}}!function(t){t[t.LSB=0]="LSB",t[t.MSB=1]="MSB"}(EnumBitNumbering||(EnumBitNumbering={}));class BitNumbering extends EventTarget{bitNumbering;constructor(t=EnumBitNumbering.LSB){super(),this.bitNumbering=t}isMSB(){return this.bitNumbering===EnumBitNumbering.MSB}isLSB(){return this.bitNumbering===EnumBitNumbering.LSB}get(){return this.bitNumbering}set(t){let s=this.bitNumbering!==t;if(this.bitNumbering=t,s){let t=new Event("change");t.detail={bitNumbering:this.bitNumbering},this.dispatchEvent(t)}return s}setLSB(){return this.set(EnumBitNumbering.LSB)}setMSB(){return this.set(EnumBitNumbering.MSB)}setRandom(){return this.set(Math.random()>=.5?EnumBitNumbering.LSB:EnumBitNumbering.MSB)}toString(){return EnumBitNumbering[this.bitNumbering]}}let tmpArr8=new Uint8Array(8),tempDataView=new DataView(tmpArr8.buffer);function assertUintMax(t,s){if(!Number.isInteger(t))throw new TypeError(`(${t}) must be integer`);if(!(t>=0&&t<=s))throw new RangeError(`(${t}) must be Uint <= ${s}`);return t}function assertIntMinMax(t,s,e){if(!Number.isInteger(t))throw new TypeError(`(${t}) must be integer`);if(!(s<=t&&t<=e))throw new RangeError(`(${t}) must be ${s} <= Int <= ${e}`);return t}class BitDataView{endianness=new Endianness;bitNumbering=new BitNumbering;__automaticMemoryExpansion=!1;__data;__countBitsPushLimit=0;__countBitsPushed=0;__countBitsShifted=0;_andBitInMemoryAddress_noAsserts;_orBitInMemoryAddress_noAsserts;_getAt_BitMemoryAddress_noAsserts;constructor(t){if(this.__automaticMemoryExpansion=!1,void 0===t)this.__data=new Uint8Array(512),this.__countBitsPushLimit=8*this.__data.length,this.__automaticMemoryExpansion=!0;else if("number"==typeof t){if(!(Number.isInteger(t)&&t>0))throw new TypeError("Required uint count of bits");this.__countBitsPushLimit=t;let s=Math.ceil(t/8);this.__data=new Uint8Array(s)}else if(t instanceof Uint8Array)this.__data=t,this.__countBitsPushLimit=8*this.__data.length;else{if(!(t instanceof ArrayBuffer||ArrayBuffer.isView(t)))throw new TypeError("Invalid bufferInfo type");this.__data=new Uint8Array(t),this.__countBitsPushLimit=8*this.__data.length}this.clear();let s=()=>{this._andBitInMemoryAddress_noAsserts=this._andBitInMemoryAddressLsb_noAsserts,this._orBitInMemoryAddress_noAsserts=this._orBitInMemoryAddressLsb_noAsserts,this._getAt_BitMemoryAddress_noAsserts=this._getAt_BitMemoryAddressLsb_noAsserts},e=()=>{this._andBitInMemoryAddress_noAsserts=this._andBitInMemoryAddressMsb_noAsserts,this._orBitInMemoryAddress_noAsserts=this._orBitInMemoryAddressMsb_noAsserts,this._getAt_BitMemoryAddress_noAsserts=this._getAt_BitMemoryAddressMsb_noAsserts};this.bitNumbering.addEventListener("change",(()=>{this.bitNumbering.isLSB()?s():this.bitNumbering.isMSB()&&e()})),s()}get buffer(){return this.__data.buffer}getCountStoredBits(){return this.__countBitsPushed-this.__countBitsShifted}_andBitInMemoryAddressLsb_noAsserts=t=>{let s=t>>>3,e=1<<(7&t);this.__data[s]&=~e};_orBitInMemoryAddressLsb_noAsserts=t=>{let s=t>>>3,e=1<<(7&t);this.__data[s]|=e};_andBitInMemoryAddressMsb_noAsserts=t=>{let s=t>>>3,e=1<<7-(7&t);this.__data[s]&=~e};_orBitInMemoryAddressMsb_noAsserts=t=>{let s=t>>>3,e=1<<7-(7&t);this.__data[s]|=e};_getAt_BitMemoryAddressLsb_noAsserts=t=>{let s=t>>>3,e=7&t;return this.__data[s]>>>e&1};_getAt_BitMemoryAddressMsb_noAsserts=t=>{let s=t>>>3,e=7-t&7;return this.__data[s]>>>e&1};clear(){this.__countBitsPushed=0,this.__countBitsShifted=0}clone(t=!1){let s=new BitDataView;if(s.__countBitsPushLimit=this.__countBitsPushLimit,t)s.__countBitsPushed=this.__countBitsPushed,s.__countBitsShifted=this.__countBitsShifted,s.__data=new Uint8Array(this.__data);else{let t=Math.floor(this.__countBitsShifted/8),e=Math.ceil(this.__countBitsPushed/8)-t;s.__countBitsShifted=this.__countBitsShifted%8,s.__countBitsPushed=this.__countBitsPushed-8*t,s.__data=this.__data.subarray(t,t+e)}return s.__automaticMemoryExpansion=this.__automaticMemoryExpansion,s}getAvailableBitsToExpandRight(){return 4294967294-this.__countBitsPushLimit}getAvailableBitsToPush(){return this.__automaticMemoryExpansion?4294967294-this.__countBitsPushed:this.__countBitsPushLimit-this.__countBitsPushed}getAvailableBitsToUnshift(){return this.__automaticMemoryExpansion?8*(Math.floor(536870911.75)-this.__data.length)+this.__countBitsShifted:this.__countBitsShifted}expandRight(t=2048){if(!this.__automaticMemoryExpansion)throw new Error(`BitDataView.expandRight() can't expand memory for ${t} bits, because it deny. .setAutomaticMemoryExpansionOn() or find overflow problem.`);assertUintMax(t,4294967294-this.__countBitsPushLimit),this.__countBitsPushLimit+=t;let s=new Uint8Array(Math.ceil(this.__countBitsPushLimit/8));s.set(this.__data,0),this.__data=s}expandLeft(t=2048){if(!this.__automaticMemoryExpansion)throw new Error(`BitDataView.expandLeft() can't expand memory for ${t} bits, because it deny. .setAutomaticMemoryExpansionOn() or find overflow problem.`);if(assertUintMax(t,4294967295-this.__countBitsPushLimit),t%8)throw new Error("expandLeft only allow *8 bit count: 8, 16, 24, ...");let s=t>>>3;this.__countBitsPushLimit+=t,this.__countBitsPushed+=t,this.__countBitsShifted+=t;let e=new Uint8Array(Math.ceil(this.__countBitsPushLimit/8));e.set(this.__data,s),this.__data=e}expandRightIfNeed(t,s=2048){this.__countBitsPushed+t>this.__countBitsPushLimit&&(s<t&&(s=t),this.expandRight(s))}expandLeftIfNeed(t,s=2048){this.__countBitsShifted-t<0&&(s<t&&(s=t),this.expandLeft(s))}_importUint8Array_noAsserts(t,s=!0){this.__countBitsPushLimit=this.__countBitsPushed=8*t.length,this.__countBitsShifted=0,this.__data=s?t.slice():t}importUint8Array(t){this._importUint8Array_noAsserts(t)}exportUnit8Array(t=!1){let s=this.getCountStoredBits(),e=Math.ceil(s/8),n=new Uint8Array(e);for(let i=0;s>0;i++){let r=Math.min(s,8);n[t?e-1-i:i]=this._getAt_Uint8orLess_noAsserts(8*i,r),s-=8}return n}toString01(){let t="";for(let s=0,e=this.getCountStoredBits();s<e;s++)t+=this._getAt_Bit_noAsserts(s);return t}toString(){return`BitDataView = {countBitsShifted: ${this.__countBitsShifted}, countBitsPushed: ${this.__countBitsPushed}, getCountStoredBits: ${this.getCountStoredBits()}, countBitsPushLimit: ${this.__countBitsPushLimit}."}`}_push_Nothing_noAsserts(t){this.__countBitsPushed+=t}push_Nothing(t){assertUintMax(t,this.getAvailableBitsToPush()),this._push_Nothing_noAsserts(t)}_unshift_Nothing_noAsserts(t){this.__countBitsShifted+=t}_setBitInMemoryAddress_noAsserts(t,s){t?this._orBitInMemoryAddress_noAsserts(s):this._andBitInMemoryAddress_noAsserts(s)}_setAt_Bit_noAsserts(t,s){this._setBitInMemoryAddress_noAsserts(s,this.__countBitsShifted+t)}_getAt_Bit_noAsserts(t){return this._getAt_BitMemoryAddress_noAsserts(this.__countBitsShifted+t)}_push_Bit_noAssertsNoExpand(t){this._setBitInMemoryAddress_noAsserts(t,this.__countBitsPushed++)}push_Bits(t,s=1){for(assertUintMax(t,1),assertUintMax(s,this.getAvailableBitsToPush()),this.expandRightIfNeed(s);s;s--)this._push_Bit_noAssertsNoExpand(t)}_setAt_Uint8orLess_noAsserts(t=0,s=8,e){let n=this.__countBitsShifted+t;for(;s;s--)this._setBitInMemoryAddress_noAsserts(1&e,n++),e>>>=1}_getAt_Uint8orLess_noAsserts(t=0,s=8){let e=this.__countBitsShifted+t,n=0;for(let t=1;s;s--)this._getAt_BitMemoryAddress_noAsserts(e++)&&(n|=t),t<<=1;return n}_setAt_Uint53orLess_noAsserts(t=0,s=53,e){if(this.endianness.isLittleEndian())for(;s>0;){let n=Math.min(s,8);this._setAt_Uint8orLess_noAsserts(t,n,e),e=Math.floor(e/256),s-=8,t+=8}else for(let n=0;s>0;n+=8){let n=Math.min(s,8);this._setAt_Uint8orLess_noAsserts(t+s-n,n,e),e=Math.floor(e/256),s-=8}}_setAt_Int53orLess_noAsserts(t=0,s=54,e){if(this.endianness.isLittleEndian())for(;s>0;){let n=Math.min(s,8);this._setAt_Uint8orLess_noAsserts(t,n,e),e=Math.floor(e/256),s-=7,t+=8}else for(let n=0;s>0;n+=8){let n=Math.min(s,8);this._setAt_Uint8orLess_noAsserts(t+s-n,n,e),e=Math.floor(e/256),s-=8}}_getAt_Uint53orLess_noAsserts(t=0,s=53){let e=0;if(this.endianness.isLittleEndian())for(let n=1;s>0;t+=8){let i=this._getAt_Uint8orLess_noAsserts(t,Math.min(s,8));s-=8,e+=i*n,n*=256}else for(;s>0;t+=8){let n=Math.min(s,8);s-=8,e*=1<<n,e+=this._getAt_Uint8orLess_noAsserts(t,n)}return e}_getAt_Int53orLess_noAsserts(t=0,s=54){let e=0,n=s,i=Math.pow(2,n)-1;if(this.endianness.isLittleEndian())for(let s=1;n>0;t+=8){let i=this._getAt_Uint8orLess_noAsserts(t,Math.min(n,8));n-=8,e+=i*s,s*=256}else for(;n>0;t+=8){let s=Math.min(n,8);n-=8,e*=1<<s,e+=this._getAt_Uint8orLess_noAsserts(t,s)}return 1===(1&Math.floor(e/2**(s-2)))&&(e=e-i-1),e}_setAt_BigUint64orLess_noAsserts(t=0,s=64,e){tempDataView.setBigUint64(0,e,this.endianness.isLittleEndian());let n=0;for(;s>0;){let e=Math.min(s,8);this._setAt_Uint8orLess_noAsserts(t+s-e,e,tempDataView.getUint8(7-n)),s-=8,n++}}_setAt_BigInt64orLess_noAsserts(t=0,s=64,e){tempDataView.setBigUint64(0,e,!this.endianness.isLittleEndian());for(let e=0;s>0;e++){let n=Math.min(s,8);this._setAt_Uint8orLess_noAsserts(t+s-n,n,tempDataView.getUint8(e)),s-=8}}_getAt_BigUint64orLess_noAsserts(t=0,s=64){let e=0n;if(this.endianness.isLittleEndian())for(let n=1n;s>0;t+=8){let i=BigInt(this._getAt_Uint8orLess_noAsserts(t,Math.min(s,8)));s-=8,e+=i*n,n<<=8n}else for(;s>0;t+=8){let n=Math.min(s,8),i=BigInt(this._getAt_Uint8orLess_noAsserts(t,n));s-=8,e<<=BigInt(n),e|=i}return e}_getAt_BigInt64orLess_noAsserts(t=0,s=64){let e=1n<<BigInt(s-1),n=(1n<<BigInt(s-1))-1n,i=0n;if(this.endianness.isLittleEndian())for(let e=1n;s>0;t+=8){let n=BigInt(this._getAt_Uint8orLess_noAsserts(t,Math.min(s,8)));s-=8,i+=n*e,e<<=8n}else for(;s>0;t+=8){let e=Math.min(s,8),n=BigInt(this._getAt_Uint8orLess_noAsserts(t,e));s-=8,i<<=BigInt(e),i|=n}return!!(e&i)&&(i=-((~i&n)+1n)),i}setAt_Uint8Array_noExpandNoAsserts(t=0,s,e=!1){if(e)for(let e=s.length-1;e>=0;e--)this._setAt_Uint8orLess_noAsserts(t+8*e,8,s[s.length-1-e]);else for(let e=0;e<s.length;e++)this._setAt_Uint8orLess_noAsserts(t+8*e,8,s[e])}_setUntil_Uint8Array_noExpandNoAsserts(t=0,s,e=!1){return this.setAt_Uint8Array_noExpandNoAsserts(this.getCountStoredBits()-t-8*s.length,s,e)}push_Uint8Array(t){this.expandRightIfNeed(8*t.length),this.__countBitsPushed+=8*t.length,this._setUntil_Uint8Array_noExpandNoAsserts(0,t,!1)}_getAt_Uint8Array_noAsserts(t,s=this.getCountStoredBits(),e=!1){let n=Math.ceil(s/8),i=new Uint8Array(n);for(let r=0;s>0;r++){let _=s>=8?8:s;i[e?n-1-r:r]=this._getAt_Uint8orLess_noAsserts(t,_),t+=8,s-=8}return i}shift_Uint8Array(t=this.getCountStoredBits(),s=!1){assertUintMax(t,this.getCountStoredBits());let e=Math.ceil(t/8),n=new Uint8Array(e);for(let i=0;t>0;i++){let r=t>=8?8:t;n[s?e-1-i:i]=this._shift_Uint8orLess_noAsserts(r),t-=8}return n}pop_Uint8Array(t=this.getCountStoredBits()){assertUintMax(t,this.getCountStoredBits());let s=Math.ceil(t/8),e=new Uint8Array(s);for(let s=0;t>0;s++){let n=Math.min(t,8);e[s]=this._pop_Uint8orLess_noAsserts(n),t-=8}return e}_setAt_DataView_noAsserts(t,s,e,n=!1){let i=new Uint8Array(e.buffer);this._setAt_Uint8Array_noAsserts(t,s,i,n)}_getAt_DataView_noAsserts(t,s,e=!1){let n=this._getAt_Uint8Array_noAsserts(t,s,e);return new DataView(n.buffer)}_setAt_Uint8Array_noAsserts(t,s,e,n=!1){if(s!=8*e.length)throw new Error("TODO, custom Uint8Array not ready");this.setAt_Uint8Array_noExpandNoAsserts(t,e,n)}_getAt_toUint8Array_noAsserts(t,s,e=this.getCountStoredBits(),n=!1){let i=Math.ceil(e/8);for(let r=0;e>0;r++){let _=e>=8?8:e;t[n?i-1-r:r]=this._getAt_Uint8orLess_noAsserts(s,_),s+=8,e-=8}}_setAt_TempBuffer(t){this.setAt_Uint8Array_noExpandNoAsserts(t,tmpArr8,!1)}_getAt_TempBuffer(t,s,e=!1){return this._getAt_toUint8Array_noAsserts(tmpArr8,t,s,e)}_setAt_Float32_noAsserts(t,s){tempDataView.setFloat32(0,s,this.endianness.isLittleEndian()),this._setAt_TempBuffer(t)}_getAt_Float32_noAsserts(t){return this._getAt_TempBuffer(t,32),tempDataView.getFloat32(0,this.endianness.isLittleEndian())}_setAt_Float64_noAsserts(t,s){tempDataView.setFloat64(0,s,this.endianness.isLittleEndian()),this._setAt_TempBuffer(t)}_getAt_Float64_noAsserts(t){return this._getAt_TempBuffer(t,64),tempDataView.getFloat64(0,this.endianness.isLittleEndian())}_setUntil_Uint8orLess_noAsserts(t,s,e){return this._setAt_Uint8orLess_noAsserts(this.getCountStoredBits()-s-t,s,e)}_getUntil_Uint8orLess_noAsserts(t,s){return this._getAt_Uint8orLess_noAsserts(this.getCountStoredBits()-s-t,s)}_push_Uint8orLess_noAssertsNoExpand(t,s){this.__countBitsPushed+=t,this._setUntil_Uint8orLess_noAsserts(0,t,s)}_unshift_Uint8orLess_noAssertsNoExpand(t,s){this.__countBitsShifted-=t,this._setAt_Uint8orLess_noAsserts(0,t,s)}_shift_Uint8orLess_noAsserts(t){let s=this._getAt_Uint8orLess_noAsserts(0,t);return this.__countBitsShifted+=t,s}_pop_Uint8orLess_noAsserts(t){let s=this._getUntil_Uint8orLess_noAsserts(0,t);return this.__countBitsPushed-=t,s}_setUntil_Uint53orLess_noAsserts(t,s,e){return this._setAt_Uint53orLess_noAsserts(this.getCountStoredBits()-s-t,s,e)}_getUntil_Uint53orLess_noAsserts(t,s){return this._getAt_Uint53orLess_noAsserts(this.getCountStoredBits()-s-t,s)}_push_Uint53orLess_noAssertsNoExpand(t,s){this.__countBitsPushed+=t,this._setUntil_Uint53orLess_noAsserts(0,t,s)}_unshift_Uint53orLess_noAssertsNoExpand(t,s){this.__countBitsShifted-=t,this._setAt_Uint53orLess_noAsserts(0,t,s)}_shift_Uint53orLess_noAsserts(t){let s=this._getAt_Uint53orLess_noAsserts(0,t);return this.__countBitsShifted+=t,s}_pop_Uint53orLess_noAsserts(t){let s=this._getUntil_Uint53orLess_noAsserts(0,t);return this.__countBitsPushed-=t,s}_setUntil_Int53orLess_noAsserts(t,s,e){return this._setAt_Int53orLess_noAsserts(this.getCountStoredBits()-s-t,s,e)}_getUntil_Int53orLess_noAsserts(t,s){return this._getAt_Int53orLess_noAsserts(this.getCountStoredBits()-s-t,s)}_push_Int53orLess_noAssertsNoExpand(t,s){this.__countBitsPushed+=t,this._setUntil_Int53orLess_noAsserts(0,t,s)}_unshift_Int53orLess_noAssertsNoExpand(t,s){this.__countBitsShifted-=t,this._setAt_Int53orLess_noAsserts(0,t,s)}_shift_Int53orLess_noAsserts(t){let s=this._getAt_Int53orLess_noAsserts(0,t);return this.__countBitsShifted+=t,s}_pop_Int53orLess_noAsserts(t){let s=this._getUntil_Int53orLess_noAsserts(0,t);return this.__countBitsPushed-=t,s}_setUntil_BigUint64orLess_noAsserts(t,s,e){return this._setAt_BigUint64orLess_noAsserts(this.getCountStoredBits()-s-t,s,e)}_getUntil_BigUint64orLess_noAsserts(t,s){return this._getAt_BigUint64orLess_noAsserts(this.getCountStoredBits()-s-t,s)}_push_BigUint64orLess_noAssertsNoExpand(t,s){this.__countBitsPushed+=t,this._setUntil_BigUint64orLess_noAsserts(0,t,s)}_unshift_BigUint64orLess_noAssertsNoExpand(t,s){this.__countBitsShifted-=t,this._setAt_BigUint64orLess_noAsserts(0,t,s)}_shift_BigUint64orLess_noAsserts(t){let s=this._getAt_BigUint64orLess_noAsserts(0,t);return this.__countBitsShifted+=t,s}_pop_BigUint64orLess_noAsserts(t){let s=this._getUntil_BigUint64orLess_noAsserts(0,t);return this.__countBitsPushed-=t,s}_setUntil_BigInt64orLess_noAsserts(t,s,e){return this._setAt_BigInt64orLess_noAsserts(this.getCountStoredBits()-s-t,s,e)}_getUntil_BigInt64orLess_noAsserts(t,s){return this._getAt_BigInt64orLess_noAsserts(this.getCountStoredBits()-s-t,s)}_push_BigInt64orLess_noAssertsNoExpand(t,s){this.__countBitsPushed+=t,this._setUntil_BigInt64orLess_noAsserts(0,t,s)}_unshift_BigInt64orLess_noAssertsNoExpand(t,s){this.__countBitsShifted-=t,this._setAt_BigInt64orLess_noAsserts(0,t,s)}_shift_BigInt64orLess_noAsserts(t){let s=this._getAt_BigInt64orLess_noAsserts(0,t);return this.__countBitsShifted+=t,s}_pop_BigInt64orLess_noAsserts(t){let s=this._getUntil_BigInt64orLess_noAsserts(0,t);return this.__countBitsPushed-=t,s}_setUntil_Float32_noAsserts(t,s){return this._setAt_Float32_noAsserts(this.getCountStoredBits()-32-t,s)}_getUntil_Float32_noAsserts(t){return this._getAt_Float32_noAsserts(this.getCountStoredBits()-32-t)}_push_Float32_noAssertsNoExpand(t){this.__countBitsPushed+=32,this._setUntil_Float32_noAsserts(0,t)}_unshift_Float32_noAssertsNoExpand(t){this.__countBitsShifted-=32,this._setAt_Float32_noAsserts(0,t)}_shift_Float32_noAsserts(){let t=this._getAt_Float32_noAsserts(0);return this.__countBitsShifted+=32,t}_pop_Float32_noAsserts(){let t=this._getUntil_Float32_noAsserts(0);return this.__countBitsPushed-=32,t}_setUntil_Float64_noAsserts(t,s){return this._setAt_Float64_noAsserts(this.getCountStoredBits()-64-t,s)}_getUntil_Float64_noAsserts(t){return this._getAt_Float64_noAsserts(this.getCountStoredBits()-64-t)}_push_Float64_noAssertsNoExpand(t){this.__countBitsPushed+=64,this._setUntil_Float64_noAsserts(0,t)}_unshift_Float64_noAssertsNoExpand(t){this.__countBitsShifted-=64,this._setAt_Float64_noAsserts(0,t)}_shift_Float64_noAsserts(){let t=this._getAt_Float64_noAsserts(0);return this.__countBitsShifted+=64,t}_pop_Float64_noAsserts(){let t=this._getUntil_Float64_noAsserts(0);return this.__countBitsPushed-=64,t}_setUntil_DataView_noAsserts(t,s,e,n=!1){return this._setAt_DataView_noAsserts(this.getCountStoredBits()-s-t,s,e,n)}_getUntil_DataView_noAsserts(t,s,e=!1){return this._getAt_DataView_noAsserts(this.getCountStoredBits()-s-t,s,e)}_push_DataView_noAssertsNoExpand(t,s,e=!1){this.__countBitsPushed+=t,this._setUntil_DataView_noAsserts(0,t,s,e)}_unshift_DataView_noAssertsNoExpand(t,s,e=!1){this.__countBitsShifted-=t,this._setAt_DataView_noAsserts(0,t,s,e)}_shift_DataView_noAsserts(t,s=!1){let e=this._getAt_DataView_noAsserts(0,t,s);return this.__countBitsShifted+=t,e}_pop_DataView_noAsserts(t,s=!1){let e=this._getUntil_DataView_noAsserts(0,t,s);return this.__countBitsPushed-=t,e}setAtByte(t,s,e){s=assertIntMinMax(s,0,8),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setAt_Uint8orLess_noAsserts(t,s,e)}setUntilByte(t,s,e){s=assertIntMinMax(s,0,8),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setUntil_Uint8orLess_noAsserts(t,s,e)}getAtByte(t,s){return s=assertIntMinMax(s,0,8),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getAt_Uint8orLess_noAsserts(t,s)}getUntilByte(t,s){return s=assertIntMinMax(s,0,8),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getUntil_Uint8orLess_noAsserts(t,s)}pushByte(t,s){t=assertIntMinMax(t,0,8),this.expandRightIfNeed(t),this._push_Uint8orLess_noAssertsNoExpand(t,s)}unshiftByte(t,s){t=assertIntMinMax(t,0,8),this.expandLeftIfNeed(t),this._unshift_Uint8orLess_noAssertsNoExpand(t,s)}shiftByte(t){return t=assertIntMinMax(t,0,8),this._shift_Uint8orLess_noAsserts(t)}popByte(t){return t=assertIntMinMax(t,0,8),this._pop_Uint8orLess_noAsserts(t)}setAtUint(t,s,e){s=assertIntMinMax(s,0,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setAt_Uint53orLess_noAsserts(t,s,e)}setUntilUint(t,s,e){s=assertIntMinMax(s,0,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setUntil_Uint53orLess_noAsserts(t,s,e)}getAtUint(t,s){return s=assertIntMinMax(s,0,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getAt_Uint53orLess_noAsserts(t,s)}getUntilUint(t,s){return s=assertIntMinMax(s,0,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getUntil_Uint53orLess_noAsserts(t,s)}pushUint(t,s){t=assertIntMinMax(t,0,53),this.expandRightIfNeed(t),this._push_Uint53orLess_noAssertsNoExpand(t,s)}unshiftUint(t,s){t=assertIntMinMax(t,0,53),this.expandLeftIfNeed(t),this._unshift_Uint53orLess_noAssertsNoExpand(t,s)}shiftUint(t){return t=assertIntMinMax(t,0,53),this._shift_Uint53orLess_noAsserts(t)}popUint(t){return t=assertIntMinMax(t,0,53),this._pop_Uint53orLess_noAsserts(t)}setAtInt(t,s,e){s=assertIntMinMax(s,1,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setAt_Int53orLess_noAsserts(t,s,e)}setUntilInt(t,s,e){s=assertIntMinMax(s,1,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setUntil_Int53orLess_noAsserts(t,s,e)}getAtInt(t,s){return s=assertIntMinMax(s,1,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getAt_Int53orLess_noAsserts(t,s)}getUntilInt(t,s){return s=assertIntMinMax(s,1,53),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getUntil_Int53orLess_noAsserts(t,s)}pushInt(t,s){t=assertIntMinMax(t,1,53),this.expandRightIfNeed(t),this._push_Int53orLess_noAssertsNoExpand(t,s)}unshiftInt(t,s){t=assertIntMinMax(t,1,53),this.expandLeftIfNeed(t),this._unshift_Int53orLess_noAssertsNoExpand(t,s)}shiftInt(t){return t=assertIntMinMax(t,1,53),this._shift_Int53orLess_noAsserts(t)}popInt(t){return t=assertIntMinMax(t,1,53),this._pop_Int53orLess_noAsserts(t)}setAtBigUint(t,s,e){s=assertIntMinMax(s,0,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setAt_BigUint64orLess_noAsserts(t,s,e)}setUntilBigUint(t,s,e){s=assertIntMinMax(s,0,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setUntil_BigUint64orLess_noAsserts(t,s,e)}getAtBigUint(t,s){return s=assertIntMinMax(s,0,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getAt_BigUint64orLess_noAsserts(t,s)}getUntilBigUint(t,s){return s=assertIntMinMax(s,0,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getUntil_BigUint64orLess_noAsserts(t,s)}pushBigUint(t,s){t=assertIntMinMax(t,0,64),this.expandRightIfNeed(t),this._push_BigUint64orLess_noAssertsNoExpand(t,s)}unshiftBigUint(t,s){t=assertIntMinMax(t,0,64),this.expandLeftIfNeed(t),this._unshift_BigUint64orLess_noAssertsNoExpand(t,s)}shiftBigUint(t){return t=assertIntMinMax(t,0,64),this._shift_BigUint64orLess_noAsserts(t)}popBigUint(t){return t=assertIntMinMax(t,0,64),this._pop_BigUint64orLess_noAsserts(t)}setAtBigInt(t,s,e){s=assertIntMinMax(s,1,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setAt_BigInt64orLess_noAsserts(t,s,e)}setUntilBigInt(t,s,e){s=assertIntMinMax(s,1,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setUntil_BigInt64orLess_noAsserts(t,s,e)}getAtBigInt(t,s){return s=assertIntMinMax(s,1,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getAt_BigInt64orLess_noAsserts(t,s)}getUntilBigInt(t,s){return s=assertIntMinMax(s,1,64),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getUntil_BigInt64orLess_noAsserts(t,s)}pushBigInt(t,s){t=assertIntMinMax(t,1,64),this.expandRightIfNeed(t),this._push_BigInt64orLess_noAssertsNoExpand(t,s)}unshiftBigInt(t,s){t=assertIntMinMax(t,1,64),this.expandLeftIfNeed(t),this._unshift_BigInt64orLess_noAssertsNoExpand(t,s)}shiftBigInt(t){return t=assertIntMinMax(t,1,64),this._shift_BigInt64orLess_noAsserts(t)}popBigInt(t){return t=assertIntMinMax(t,1,64),this._pop_BigInt64orLess_noAsserts(t)}setAtFloat32(t,s){t=assertIntMinMax(t,0,this.getCountStoredBits()-32),this._setAt_Float32_noAsserts(t,s)}setUntilFloat32(t,s){t=assertIntMinMax(t,0,this.getCountStoredBits()-32),this._setUntil_Float32_noAsserts(t,s)}getAtFloat32(t){return t=assertIntMinMax(t,0,this.getCountStoredBits()-32),this._getAt_Float32_noAsserts(t)}getUntilFloat32(t){return t=assertIntMinMax(t,0,this.getCountStoredBits()-32),this._getUntil_Float32_noAsserts(t)}pushFloat32(t){this.expandRightIfNeed(32),this._push_Float32_noAssertsNoExpand(t)}unshiftFloat32(t){this.expandLeftIfNeed(32),this._unshift_Float32_noAssertsNoExpand(t)}shiftFloat32(){return this._shift_Float32_noAsserts()}popFloat32(){return this._pop_Float32_noAsserts()}setAtFloat64(t,s){t=assertIntMinMax(t,0,this.getCountStoredBits()-64),this._setAt_Float64_noAsserts(t,s)}setUntilFloat64(t,s){t=assertIntMinMax(t,0,this.getCountStoredBits()-64),this._setUntil_Float64_noAsserts(t,s)}getAtFloat64(t){return t=assertIntMinMax(t,0,this.getCountStoredBits()-64),this._getAt_Float64_noAsserts(t)}getUntilFloat64(t){return t=assertIntMinMax(t,0,this.getCountStoredBits()-64),this._getUntil_Float64_noAsserts(t)}pushFloat64(t){this.expandRightIfNeed(64),this._push_Float64_noAssertsNoExpand(t)}unshiftFloat64(t){this.expandLeftIfNeed(64),this._unshift_Float64_noAssertsNoExpand(t)}shiftFloat64(){return this._shift_Float64_noAsserts()}popFloat64(){return this._pop_Float64_noAsserts()}setAtDataView(t,s,e,n=!1){s=assertIntMinMax(s,0,4294967294),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setAt_DataView_noAsserts(t,s,e,n)}setUntilDataView(t,s,e,n=!1){s=assertIntMinMax(s,0,4294967294),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._setUntil_DataView_noAsserts(t,s,e,n)}getAtDataView(t,s,e=!1){return s=assertIntMinMax(s,0,4294967294),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getAt_DataView_noAsserts(t,s,e)}getUntilDataView(t,s,e=!1){return s=assertIntMinMax(s,0,4294967294),t=assertIntMinMax(t,0,this.getCountStoredBits()-s),this._getUntil_DataView_noAsserts(t,s,e)}pushDataView(t,s,e=!1){t=assertIntMinMax(t,0,4294967294),this.expandRightIfNeed(t),this._push_DataView_noAssertsNoExpand(t,s,e)}unshiftDataView(t,s,e=!1){t=assertIntMinMax(t,0,4294967294),this.expandLeftIfNeed(t),this._unshift_DataView_noAssertsNoExpand(t,s,e)}shiftDataView(t,s=!1){return t=assertIntMinMax(t,0,4294967294),this._shift_DataView_noAsserts(t,s)}popDataView(t,s=!1){return t=assertIntMinMax(t,0,4294967294),this._pop_DataView_noAsserts(t,s)}}export{BitDataView,BitNumbering,Endianness};