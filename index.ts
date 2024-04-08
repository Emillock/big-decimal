class BigDecimal {
    num1: bigint;
    num2: bigint;
    isNegative: boolean;
    zerosBefNum2: number;

    constructor(num1: bigint | string | number, num2?: bigint | string | number) {
        this.isNegative = num1.toString().includes('-');
        this.zerosBefNum2 = 0;



        if (num2 === undefined && (typeof num1 === "string" || typeof num1 === "number")) {
            const numArr = num1.toString().split(".");

            if (numArr[1] !== undefined && numArr[1].split('')[0] === '0') {
                // console.log(numArr[1].replace(/[1-9]+\d*/g, ''));

                this.zerosBefNum2 = numArr[1].replace(/[1-9]+\d*/, '').length;
            }

            this.num1 = BigDecimal.bigIntAbs(BigInt(numArr[0] === "-" ? 0 : numArr[0]!));
            this.num2 = BigDecimal.bigIntAbs(BigInt(numArr[1] === undefined ? 0 : numArr[1].replace(/0+$/, '')));
            return;
        }

        num2 = num2?.toString().replace(/0+$/, '');

        if (typeof num2 === "string" && num2.split('').length > 1 && num2.split('')[0] === '0') {
            this.zerosBefNum2 = num2.replace(/[1-9]+\d*/, '').length;
        }

        this.num1 = BigDecimal.bigIntAbs(BigInt(num1));
        this.num2 = BigDecimal.bigIntAbs(BigInt(num2 ?? 0));
    }

    private static bigIntAbs(bigInt: bigint) {
        return (bigInt < 0n) ? -bigInt : bigInt;
    }

    private static bigDecJoin(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const bigDec1Num2Len = bigDec1.num2.toString().length;
        const bigDec2Num2Len = bigDec2.num2.toString().length;
        const maxLen = Math.max(bigDec1Num2Len, bigDec2Num2Len);

        const bigDec1Num2Str = bigDec1.num2.toString().padEnd(maxLen, '0');
        const bigDec2Num2Str = bigDec2.num2.toString().padEnd(maxLen, '0');
        // console.log(bigDec1Num2Str, bigDec2Num2Str);
        const bigDec1Join = BigInt((bigDec1.isNegative ? "-" : "") + bigDec1.num1.toString() + "0".repeat(bigDec1.zerosBefNum2) + bigDec1Num2Str);
        const bigDec2Join = BigInt((bigDec2.isNegative ? "-" : "") + bigDec2.num1.toString() + "0".repeat(bigDec2.zerosBefNum2) + bigDec2Num2Str);
        // console.log(bigDec1Join, bigDec2Join);

        return { bigDecJoinArr: [bigDec1Join, bigDec2Join], maxLen, bigDec1Num2Len, bigDec2Num2Len };
    }

    static sum(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, maxLen } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDecJoinArr[0] as bigint;
        const bigDec2Join = bigDecJoinArr[1] as bigint;

        const resBigInt = bigDec1Join + bigDec2Join;
        // console.log(resBigInt);

        const resArr = resBigInt.toString().split('');
        resArr.splice(resBigInt.toString().length - maxLen, 0, '.');

        return new BigDecimal(resArr.join(''));
    }

    static diff(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, maxLen } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDecJoinArr[0] as bigint;
        const bigDec2Join = bigDecJoinArr[1] as bigint;

        const resBigInt = bigDec1Join - bigDec2Join;

        const resArr = resBigInt.toString().split('');
        resArr.splice(resBigInt.toString().length - maxLen, 0, '.');

        return new BigDecimal(resArr.join(''));
    }

    static prod(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, bigDec1Num2Len, bigDec2Num2Len } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = BigInt(bigDec1.num2 === 0n ? bigDecJoinArr[0]! : bigDecJoinArr[0]!.toString().replace(/0+$/, ''));
        const bigDec2Join = BigInt(bigDec2.num2 === 0n ? bigDecJoinArr[1]! : bigDecJoinArr[1]!.toString().replace(/0+$/, ''));

        const resBigInt = bigDec1Join * bigDec2Join;

        const resArr = resBigInt.toString().split('');

        let dotIndex = resBigInt.toString().length - (bigDec1Num2Len + bigDec2Num2Len);

        while (dotIndex < 0) {
            resArr.splice(dotIndex++, 0, '0');
        }

        resArr.splice(dotIndex, 0, '.');

        // console.log(resArr.join(''));

        return new BigDecimal(resArr.join(''));
    }


    static div(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        let bigDec1Join = BigDecimal.bigIntAbs(bigDecJoinArr[0] as bigint);
        const bigDec2Join = BigDecimal.bigIntAbs(bigDecJoinArr[1] as bigint);

        const isNegative = bigDec2.isNegative !== bigDec1.isNegative;

        let resBefDot = bigDec1Join / bigDec2Join;
        let resBefDotLen = resBefDot === 0n ? 0 : resBefDot.toString().length;
        let resAfDot = 0n;

        for (let i = 0; i <= 10 + resBefDotLen && bigDec1Join > 0; ++i) {
            // console.log(bigDec1Join+"/"+bigDec2Join+"="+(bigDec1Join/bigDec2Join));

            if (i >= 1) {
                // console.log(i,bigDec1Join / bigDec2Join);

                resAfDot = resAfDot * 10n + bigDec1Join / bigDec2Join;
            }
            // console.log(bigDec1Join % bigDec2Join * 10n);
            
            bigDec1Join = bigDec1Join % bigDec2Join * 10n;
        }

        // console.log(resBefDot,resAfDot);

        const resArr = ((resBefDot === 0n ? "" : resBefDot.toString()) + resAfDot.toString()).split('');
        resArr.splice(resBefDotLen, 0, '.');

        return new BigDecimal((isNegative ? "-" : "") + (resAfDot === 0n ? resBefDot : resArr.join('')));
    }

    toString() {
        const num1Str = this.num1.toString();
        const num2Str = this.num2.toString();
        return `${this.isNegative ? "-" : ""}${num1Str}${num2Str.replace("0", "").length === 0 ? "" : '.' + "0".repeat(this.zerosBefNum2) + num2Str.replace(/0+$/, '')}`;
    }
}

const num1 = new BigDecimal(3, 0);
const num2 = new BigDecimal(2, 0);
const cases: Array<
    {
        args: Array<number[]>
        res: {
            sum: string,
            diff: string,
            prod: string,
            div: string
        }
    }
> = [
        {
            args: [
                [100],
                [100]
            ],
            res: {
                sum: "200",
                diff: "0",
                prod: "10000",
                div: "1"
            }
        },
        {
            args: [
                [0, 1],
                [0, 1]
            ],
            res: {
                sum: "0.2",
                diff: "0",
                prod: "0.01",
                div: "1"
            }
        },
        {
            args: [
                [100, 1],
                [100, 1]
            ],
            res: {
                sum: "200.2",
                diff: "0",
                prod: "10020.01",
                div: "1"
            }
        },
        {
            args: [
                [300, 4],
                [100, 2]
            ],
            res: {
                sum: "400.6",
                diff: "200.2",
                prod: "30100.08",
                div: "2.99800399201"
            }
        },
        {
            args: [
                [100, 2],
                [300, 4]
            ],
            res: {
                sum: "400.6",
                diff: "-200.2",
                prod: "30100.08",
                div: "0.3335552596"
            }
        },
        {
            args: [
                [100, 10000000000],
                [100, 100000000000]
            ],
            res: {
                sum: "200.2",
                diff: "0",
                prod: "10020.01",
                div: "1"
            }
        },
        {
            args: [
                [100, 1000000],
                [100, 1000001]
            ],
            res: {
                sum: "200.2000001",
                diff: "-0.1",
                prod: "10020.01001001",
                div: "0.999999999"
            }
        },
        {
            args: [
                [-100, 2],
                [300, 4]
            ],
            res: {
                sum: "200.2",
                diff: "-400.6",
                prod: "-30100.08",
                div: "-0.3335552596"
            }
        },
        {
            args: [
                [-100, 2],
                [-300, 4]
            ],
            res: {
                sum: "-400.6",
                diff: "200.2",
                prod: "30100.08",
                div: "0.3335552596"
            }
        },
        {
            args: [
                [100, 2],
                [-300, 4]
            ],
            res: {
                sum: "-200.2",
                diff: "400.6",
                prod: "-30100.08",
                div: "-0.3335552596"
            }
        },
        {
            args: [
                [3000, 4],
                [100, 2]
            ],
            res: {
                sum: "3100.6",
                diff: "2900.2",
                prod: "300640.08",
                div: "29.944111776447"
            }
        },
        {
            args: [
                [3, 0],
                [2, 0]
            ],
            res: {
                sum: "5",
                diff: "1",
                prod: "6",
                div: "1.5"
            }
        },
    ]

for (let i of cases) {
    const num1 = new BigDecimal(i.args[0]![0]!, i.args[0]![1]!);
    const num2 = new BigDecimal(i.args[1]![0]!, i.args[1]![1]!);
    const res = {
        sum: BigDecimal.sum(num1, num2).toString(),
        diff: BigDecimal.diff(num1, num2).toString(),
        prod: BigDecimal.prod(num1, num2).toString(),
        div: BigDecimal.div(num1, num2).toString(),
    }
    for (let j in res) {
        if (res[j as keyof typeof i.res] !== i.res[j as keyof typeof i.res]) console.log(...i.args + ` did not pass ${j}. Expected Result: ${i.res[j as keyof typeof i.res]} Got Result: ${res[j as keyof typeof i.res]}`);
    }
}

// console.log(BigDecimal.prod(num1, num2).toString());
// console.log(BigDecimal.div(num1, num2).toString());