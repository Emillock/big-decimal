class BigDecimal {
    num1: bigint;
    num2: bigint;

    constructor(num1: bigint | string | number, num2?: bigint | string | number) {

        if (num2 === undefined) {
            const numArr = (num1 as string).split(".");
            this.num1 = BigInt(numArr[0]!);
            this.num2 = BigInt(numArr[1] ?? 0);
            return;
        }

        this.num1 = BigInt(num1);
        this.num2 = BigInt(num2);
    }

    static sum(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        
        const bigDec1Num2Len = bigDec1.num2.toString().length;
        const bigDec2Num2Len = bigDec2.num2.toString().length;
        const maxLen = Math.max(bigDec1Num2Len, bigDec2Num2Len);

        const bigDec1Num2Str = bigDec1.num2.toString().padEnd(maxLen, '0');
        const bigDec2Num2Str = bigDec2.num2.toString().padEnd(maxLen, '0');

        const bigDec1Join = BigInt(bigDec1.num1.toString() + bigDec1Num2Str);
        const bigDec2Join = BigInt(bigDec2.num1.toString() + bigDec2Num2Str);

        const resBigInt = bigDec1Join + bigDec2Join;

        const resStr = resBigInt.toString().split('');
        resStr.splice(resBigInt.toString().length - maxLen, 0, '.');

        return new BigDecimal(resStr.join(''));
    }

    toString() {
        const num1Str = this.num1.toString();
        const num2Str = this.num2.toString();
        return `${num1Str}${num2Str.replace("0", "").length === 0 ? "" : '.' + num2Str.replace(/0+$/,'')}`;
    }
}

const num1 = new BigDecimal(100, 1000000000000000000000000000n);
const num2 = new BigDecimal(100, 2);

console.log(BigDecimal.sum(num1, num2).toString());