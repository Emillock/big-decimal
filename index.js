var BigDecimal = /** @class */ (function () {
    function BigDecimal(num1, num2) {
        var _a;
        if (num2 === undefined) {
            var numArr = num1.split(".");
            this.num1 = BigInt(numArr[0]);
            this.num2 = BigInt((_a = numArr[1]) !== null && _a !== void 0 ? _a : 0);
            return;
        }
        this.num1 = BigInt(num1);
        this.num2 = BigInt(num2);
    }
    BigDecimal.sum = function (bigDec1, bigDec2) {
        console.log(bigDec1.toString());
        var bigDec1Num2Len = bigDec1.num2.toString().length;
        var bigDec2Num2Len = bigDec2.num2.toString().length;
        var maxLen = Math.max(bigDec1Num2Len, bigDec2Num2Len);
        var bigDec1Num2Str = bigDec1.num2.toString().padEnd(maxLen, '0');
        var bigDec2Num2Str = bigDec2.num2.toString().padEnd(maxLen, '0');
        console.log(bigDec1Num2Str);
        console.log(bigDec2Num2Str);
        var bigDec1Join = BigInt(bigDec1.num1.toString() + bigDec1Num2Str);
        var bigDec2Join = BigInt(bigDec2.num2.toString() + bigDec2Num2Str);
        var resBigInt = bigDec1Join + bigDec2Join;
        var resStr = resBigInt.toString().split('');
        resStr.splice(resBigInt.toString().length - maxLen, 0, '.');
        return new BigDecimal(resStr.join(''));
    };
    BigDecimal.prototype.toString = function () {
        var num1Str = this.num1.toString();
        var num2Str = this.num2.toString();
        return "".concat(num1Str).concat(num2Str.replace("0", "").length === 0 ? "" : '.' + num2Str);
    };
    return BigDecimal;
}());
var num1 = new BigDecimal(100, 1);
var num2 = new BigDecimal(100, 2);
console.log(BigDecimal.sum(num1, num2).toString());
