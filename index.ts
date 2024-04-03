class BigDecimal {
    num1: bigint;
    num2: bigint;
    isNegative: boolean;

    constructor(num1: bigint | string | number, num2?: bigint | string | number) {
        this.isNegative = num1.toString().includes('-');
        if (typeof num1 === "string" && num2 === undefined) {
            const numArr = (num1 as string).split(".");

            this.num1 = BigDecimal.bigIntAbs(BigInt(numArr[0] === "-" ? 0 : numArr[0]!));
            this.num2 = BigDecimal.bigIntAbs(BigInt(numArr[1] ?? 0));
            return;
        }

        this.num1 = BigDecimal.bigIntAbs(BigInt(num1));
        this.num2 = BigDecimal.bigIntAbs(BigInt(num2??0));
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

        const bigDec1Join = BigInt((bigDec1.isNegative ? "-" : "") + bigDec1.num1.toString() + bigDec1Num2Str);
        const bigDec2Join = BigInt((bigDec2.isNegative ? "-" : "") + bigDec2.num1.toString() + bigDec2Num2Str);

        return { bigDecJoinArr: [bigDec1Join, bigDec2Join], maxLen };
    }

    static sum(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, maxLen } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDecJoinArr[0] as bigint;
        const bigDec2Join = bigDecJoinArr[1] as bigint;

        const resBigInt = bigDec1Join + bigDec2Join;

        const resStr = resBigInt.toString().split('');
        resStr.splice(resBigInt.toString().length - maxLen, 0, '.');

        return new BigDecimal(resStr.join(''));
    }

    static diff(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, maxLen } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDecJoinArr[0] as bigint;
        const bigDec2Join = bigDecJoinArr[1] as bigint;

        const resBigInt = bigDec1Join - bigDec2Join;

        const resStr = resBigInt.toString().split('');
        resStr.splice(resBigInt.toString().length - maxLen, 0, '.');

        return new BigDecimal(resStr.join(''));
    }

    toString() {
        const num1Str = this.num1.toString();
        const num2Str = this.num2.toString();
        return `${this.isNegative ? "-" : ""}${num1Str}${num2Str.replace("0", "").length === 0 ? "" : '.' + num2Str.replace(/0+$/, '')}`;
    }
}

const num1 = new BigDecimal(-100, 1000000);
const num2 = new BigDecimal(100, 1000001);
const cases: Array<{
    args: Array<number[]>
    res: {
        sum: string,
        diff: string
    }
}> = [
        {
            args: [
                [100],
                [100]
            ],
            res: {
                sum: "200",
                diff: "0"
            }
        },
        {
            args: [
                [0, 1],
                [0, 1]
            ],
            res: {
                sum: "0.2",
                diff: "0"
            }
        },
        {
            args: [
                [100, 1],
                [100, 1]
            ],
            res: {
                sum: "200.2",
                diff: "0"
            }
        },
        {
            args: [
                [300, 4],
                [100, 2]
            ],
            res: {
                sum: "400.6",
                diff: "200.2"
            }
        },
        {
            args: [
                [100, 2],
                [300, 4]
            ],
            res: {
                sum: "400.6",
                diff: "-200.2"
            }
        },
        {
            args: [
                [100, 10000000000],
                [100, 100000000000]
            ],
            res: {
                sum: "200.2",
                diff: "0"
            }
        },
        {
            args: [
                [100, 1000000],
                [100, 1000001]
            ],
            res: {
                sum: "200.2000001",
                diff: "-0.1"
            }
        },
        {
            args: [
                [-100, 2],
                [300, 4]
            ],
            res: {
                sum: "200.2",
                diff: "-400.6"
            }
        },
        {
            args: [
                [-100, 2],
                [-300, 4]
            ],
            res: {
                sum: "-400.6",
                diff: "200.2"
            }
        },
        {
            args: [
                [100, 2],
                [-300, 4]
            ],
            res: {
                sum: "-200.2",
                diff: "400.6"
            }
        },
    ]

for (let i of cases) {
    const num1 = new BigDecimal(i.args[0]![0]!, i.args[0]![1]!);
    const num2 = new BigDecimal(i.args[1]![0]!, i.args[1]![1]!);
    const sumRes = BigDecimal.sum(num1, num2).toString();
    const diffRes = BigDecimal.diff(num1, num2).toString();
    if (sumRes !== i.res.sum) console.log(...i.args + ` did not pass sum. Expected Result: ${i.res.sum} Got Result: ${sumRes}`);
    if (diffRes !== i.res.sum) console.log(...i.args + ` did not pass diff. Expected Result: ${i.res.diff} Got Result: ${diffRes}`);
}
