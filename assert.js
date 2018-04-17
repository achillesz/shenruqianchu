var assert = require('assert');
var a = 0;

//assert(a,'这里需要值为true');
//assert.ok(a, '这里需要值为true'); 如果正确不抛出异常 需要错误值出发异常

// assert.ifError(a);  如果错误 不抛出异常 需要传入正确的值触发异常

// assert.fail(a,1,'','<');  抛出异常,有message时显示message，没有使用operator作为为分隔符


var b = 0;

// assert.equal(a,b,'a,b不相等 ==');

var buf1 = new Buffer('abc');
var buf2 = new Buffer('abc');

assert.strictEqual(buf1, buf2, 'buf1和buf2不一样');  //AssertionError: buf1和buf2不一样