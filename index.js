var BigDecimal = /** @class */ (function () {
    function BigDecimal(num1, num2) {
        this.num1 = num1;
        this.num2 = num2;
    }
    BigDecimal.prototype.toString = function () {
        return "".concat(this.num1.toString(), ".").concat(this.num2.toString());
    };
    return BigDecimal;
}());
throw new Error("111");
var num = new BigDecimal(BigInt(100), BigInt(1));
console.log("1" + num.toString());
