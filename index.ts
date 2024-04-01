class BigDecimal {
    num1: bigint;
    num2: bigint;

    constructor(num1: bigint | string | number, num2: bigint | string | number | undefined) {

        if (num2 === undefined) {
            const numArr = (num1 as string).split(".");
            this.num1 = BigInt(numArr[0]!);
            this.num2 = BigInt(numArr[1] ?? 0);
            return;
        }

        this.num1 = BigInt(num1);
        this.num2 = BigInt(num2);
    }

    toString() {
        const num1Str = this.num1.toString();
        const num2Str = this.num2.toString();
        return `${num1Str}${num2Str.replace("0", "").length === 0 ? "" : '.' + num2Str}`;
    }
}

const num = new BigDecimal(BigInt(100), BigInt(1));

console.log(num.toString());