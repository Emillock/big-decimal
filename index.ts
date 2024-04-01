class BigDecimal {
    num1: bigint;
    num2: bigint;

    constructor(num1: bigint, num2: bigint) {
        this.num1 = num1;
        this.num2 = num2;
    }

    toString() {
        const num1Str = this.num1.toString();
        const num2Str = this.num2.toString();
        return `${num1Str}${num2Str.replace("0", "").length === 0 ? "" : '.' + num2Str}`;
    }
}

const num = new BigDecimal(BigInt(100), BigInt(1));

console.log(num.toString());