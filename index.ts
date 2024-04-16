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

            if (numArr[1] !== undefined && numArr[1].split('')[0] === '0' && numArr[1].split('').length > 1) {
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
        const bigDec1Num2Len = bigDec1.num2.toString().replace(/0+$/, '').length + bigDec1.zerosBefNum2;
        const bigDec2Num2Len = bigDec2.num2.toString().replace(/0+$/, '').length + bigDec2.zerosBefNum2;
        const maxLen = Math.max(bigDec1Num2Len, bigDec2Num2Len);
        // console.log(bigDec1.zerosBefNum2, bigDec2.zerosBefNum2, maxLen);

        const bigDec1Num2Str = ("0".repeat(bigDec1.zerosBefNum2) + bigDec1.num2.toString().replace(/0+$/, '')).padEnd(maxLen, '0');
        const bigDec2Num2Str = ("0".repeat(bigDec2.zerosBefNum2) + bigDec2.num2.toString().replace(/0+$/, '')).padEnd(maxLen, '0');
        // console.log(bigDec1Num2Str, bigDec2Num2Str);
        const bigDec1Join = BigInt((bigDec1.isNegative ? "-" : "") + bigDec1.num1.toString() + bigDec1Num2Str);
        const bigDec2Join = BigInt((bigDec2.isNegative ? "-" : "") + bigDec2.num1.toString() + bigDec2Num2Str);
        // console.log(bigDec1Join, bigDec2Join);

        return { bigDecJoinArr: [bigDec1Join, bigDec2Join], maxLen, bigDec1Num2Len, bigDec2Num2Len };
    }

    static sum(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, maxLen } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDecJoinArr[0] as bigint;
        const bigDec2Join = bigDecJoinArr[1] as bigint;

        const resBigInt = bigDec1Join + bigDec2Join;
        // console.log(bigDec1Join,bigDec2Join,resBigInt,maxLen);

        const resArr = resBigInt.toString().split('');
        resArr.splice(resBigInt.toString().length - maxLen, 0, '.');

        return new BigDecimal(resArr.join(''));
    }

    static diff(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr, maxLen } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDecJoinArr[0] as bigint;
        const bigDec2Join = bigDecJoinArr[1] as bigint;

        // console.log(bigDec1Join, bigDec2Join);


        let resBigInt = bigDec1Join - bigDec2Join;
        const isNegative = resBigInt < 0n;
        resBigInt = BigDecimal.bigIntAbs(resBigInt);
        // console.log(resBigInt);

        // console.log(resBigInt.toString().length - maxLen, maxLen);

        const resArr = resBigInt.toString().split('');
        for (let i = resBigInt.toString().length - maxLen; i < 0; ++i) {
            resArr.splice(0, 0, '0');
        }
        // console.log(resArr);

        resArr.splice(Math.max(resBigInt.toString().length - maxLen, 0), 0, '.');
        resArr.splice(0, 0, isNegative ? '-' : "");
        return new BigDecimal(resArr.join(''));
    }

    static prod(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        if (bigDec1.toString() === "1" || bigDec2.toString() === "1") return bigDec1.toString() === "1" ? bigDec2 : bigDec1;

        const { bigDecJoinArr } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        const bigDec1Join = bigDec1.num2 === 0n ? bigDec1.num1 : BigInt(bigDecJoinArr[0]!.toString().replace(/0+$/, ''));
        const bigDec2Join = bigDec2.num2 === 0n ? bigDec2.num1 : BigInt(bigDecJoinArr[1]!.toString().replace(/0+$/, ''));

        const resBigInt = bigDec1Join * bigDec2Join;
        // console.log(bigDec1Join, bigDec2Join, resBigInt);


        const resArr = resBigInt.toString().split('');

        if (bigDec1.num2 !== 0n || bigDec2.num2 !== 0n) {

            let dotIndex = resBigInt.toString().length - ((bigDec1.num2 === 0n ? 0 : bigDec1.num2.toString().length + bigDec1.zerosBefNum2) + (bigDec2.num2 === 0n ? 0 : bigDec2.num2.toString().length + bigDec2.zerosBefNum2));
            // console.log(resBigInt.toString().length, bigDec1.num2 === 0n ? 0 : bigDec1.num2.toString().length, bigDec2.num2 === 0n ? 0 : bigDec2.num2.toString().length);

            // console.log(dotIndex);

            while (dotIndex < 0) {
                resArr.splice(0, 0, '0');
                dotIndex++;
            }
            // console.log(resArr.join(''));
            resArr.splice(dotIndex, 0, '.');

            // console.log(resArr.join(''));
        }

        return new BigDecimal(resArr.join(''));
    }


    static div(bigDec1: BigDecimal, bigDec2: BigDecimal) {
        const { bigDecJoinArr } = BigDecimal.bigDecJoin(bigDec1, bigDec2);;

        let bigDec1Join = BigDecimal.bigIntAbs(bigDecJoinArr[0] as bigint);
        const bigDec2Join = BigDecimal.bigIntAbs(BigInt(bigDec2.zerosBefNum2 > 0 ? bigDecJoinArr[1]!.toString().replace(/0+$/, "") : bigDecJoinArr[1]!));
        // console.log(bigDec1Join, bigDec2Join);

        const isNegative = bigDec2.isNegative !== bigDec1.isNegative;

        let resBefDot = bigDec1Join / bigDec2Join;
        let resBefDotLen = resBefDot === 0n ? 0 : resBefDot.toString().length;
        let resAfDot = 0n;
        let zerosBefNum2 = 0;

        for (let i = 0; i <= 10 + resBefDotLen && bigDec1Join > 0; ++i) {
            // console.log(bigDec1Join + "/" + bigDec2Join + "=" + (bigDec1Join / bigDec2Join));

            if (i >= 1) {
                // console.log(i, bigDec1Join / bigDec2Join);

                resAfDot = resAfDot * 10n + bigDec1Join / bigDec2Join;
                if (resAfDot === 0n) zerosBefNum2++;
            }
            // console.log(bigDec1Join % bigDec2Join * 10n);

            bigDec1Join = bigDec1Join % bigDec2Join * 10n;
        }

        // console.log(resBefDot, resAfDot);

        const resArr = ((resBefDot === 0n ? "" : resBefDot.toString()) + "0".repeat(zerosBefNum2) + resAfDot.toString()).split('');
        resArr.splice(resBefDotLen, 0, '.');

        return new BigDecimal((isNegative ? "-" : "") + (resAfDot === 0n ? resBefDot : resArr.join('')));
    }

    static fac(bigDec: BigDecimal) {
        var fact = 1n;
        for (let i = 2n; i <= bigDec.num1; i++) {
            fact *= i;
        }
        return fact;
    }

    static bigIntNthRoot(base: bigint, root: bigint) {
        let s = base + 1n;
        let k1 = root - 1n;
        let u = base;
        while (u < s) {
            s = u;
            u = ((u * k1) + base / (u ** k1)) / root;
        }
        return s;
    }

    static nthRoot(bigDec: BigDecimal, root: bigint) {
        const arr = [new BigDecimal(BigDecimal.bigIntNthRoot(bigDec.num1, root).toString())];

        for (let i = 1; i < 10; ++i) {
            const pow = BigDecimal.intPow(arr[i - 1]!, root - 1n).toFixed(50);
            const div1 = BigDecimal.div(bigDec, pow).toFixed(50);
            const diff = BigDecimal.diff(div1, arr[i - 1]!).toFixed(50);
            const div2 = BigDecimal.div(diff, new BigDecimal(root.toString())).toFixed(50);
            const sum = BigDecimal.sum(arr[i - 1]!, div2).toFixed(50);
            // console.log(`${arr[i - 1]!}^${root - 1n}=${pow.toString()}`);

            // console.log(`${bigDec.toString()}/(${arr[i - 1]}^${root - 1n})=${div1.toString()}`);
            // console.log(`${div1.toString()}-${arr[i - 1]}=${diff.toString()}`);
            // console.log(`${diff.toString()}/${new BigDecimal(root.toString())}=${div2.toString()}`);
            // console.log(`${arr[i - 1]!}+${div2.toString()}=${sum.toString()}`);

            // console.log("----------------");

            arr[i] = sum;
        }
        // arr.forEach(i => console.log(i.toString()));

        return arr[arr.length - 1]!;
    }

    static intPow(bigDec: BigDecimal, n: bigint): BigDecimal {
        // console.log(bigDec.toString(), n);

        if (n == 0n) return new BigDecimal("1");
        if (n % 2n == 0n) return BigDecimal.intPow(BigDecimal.prod(bigDec, bigDec), n / 2n);
        return BigDecimal.prod(bigDec, BigDecimal.intPow(bigDec, n - 1n)).toFixed(100);
    }

    static pow(bigDec: BigDecimal, pow: BigDecimal) {
        const num1Pow = BigDecimal.intPow(bigDec, pow.num1);
        // console.log(1);
        const denumPow = pow.num2 === 0n ? new BigDecimal("1") : BigDecimal.nthRoot(bigDec, BigInt("1" + "0".repeat(pow.num2.toString().length))).toFixed(50);
        // console.log(2);
        const num2Pow = pow.num2 === 0n ? new BigDecimal("1") : BigDecimal.intPow(denumPow, pow.num2).toFixed(50);
        // console.log(3);
        // console.log(num1Pow.toString(), denumPow.toString(), num2Pow.toString());
        const prod = BigDecimal.prod(num1Pow, num2Pow);
        return pow.isNegative ? BigDecimal.div(new BigDecimal("1"), prod) : prod;
    }

    toFixed(n: number) {
        // console.log(this.toString());

        return new BigDecimal(this.toString().slice(0, n));
    }

    // static ln(bigDec: BigDecimal) {
    //     const arr = [BigDecimal.div(bigDec, BigDecimal.diff(bigDec, new BigDecimal(1)))];
    //     for (let i = 1; i <= 11; ++i) {
    //         console.log(i);

    //         const powOf2 = new BigDecimal((2 ** -i).toString()).toFixed(30);
    //         console.log(powOf2.toString());
    //         const powOfx = BigDecimal.pow(bigDec, powOf2).toFixed(30);
    //         console.log(powOfx.toString());
    //         const numerator = BigDecimal.prod(powOf2, powOfx);
    //         const denumenator = BigDecimal.sum(new BigDecimal("1"), powOfx);
    //         arr[i] = BigDecimal.div(numerator, denumenator);
    //         console.log("----------------");
    //     }
    //     let res = arr[0] as BigDecimal;
    //     for (let i = 1; i < arr.length; ++i) {
    //         res = BigDecimal.diff(res, arr[i]!);
    //     }

    //     return BigDecimal.div(new BigDecimal("1"), res);
    // }


    // FUNCTION BELOW WORKS ONLY FOR NUMBERS LESS THAN OR EQUAL TO 2 AND GREATER THAN 0
    // static ln(bigDec: BigDecimal) {
    //     const arr = [];

    //     for (let i = 1; i < 10; ++i) {
    //         arr[i] = BigDecimal.div(BigDecimal.pow(BigDecimal.diff(bigDec, new BigDecimal("1")), new BigDecimal(i.toString())), new BigDecimal(i.toString()));
    //         arr[i]!.isNegative = !((i + 1) % 2 === 0);
    //     }

    //     let res = arr[1] as BigDecimal;
    //     arr.forEach((i) => console.log(i?.toString()));

    //     for (let i = 2; i < arr.length; ++i) {
    //         res = BigDecimal.sum(res, arr[i]!);
    //     }

    //     return res;
    // }

    static ln(bigDec: BigDecimal) {
        const arr = [];

        const divOfZ = BigDecimal.div(BigDecimal.diff(bigDec, new BigDecimal("1")), BigDecimal.sum(bigDec, new BigDecimal("1"))).toFixed(20);
        for (let i = 0; i < 250; ++i) {
            if (i % 100 === 0) console.log(i);
            const sumOfI = new BigDecimal((2 * i + 1).toString()).toFixed(20);
            arr[i] = BigDecimal.div(BigDecimal.pow(divOfZ, sumOfI).toFixed(50), sumOfI).toFixed(20);

            // console.log(`2*${i}+1=${2 * i + 1}`);
            // console.log(`${BigDecimal.diff(bigDec, new BigDecimal("1")).toString()}/${BigDecimal.sum(bigDec, new BigDecimal("1")).toString()}=${divOfZ.toString()}`);
            // console.log(`${divOfZ.toString()}^${sumOfI.toString()}=${BigDecimal.pow(divOfZ, sumOfI).toFixed(20).toString()}`);
            // console.log(`${BigDecimal.pow(divOfZ, sumOfI).toFixed(10).toString()}/${sumOfI.toString()}=${arr[i]!.toString()}`);

            // console.log("----------------");

        }

        let res = arr[0] as BigDecimal;
        // arr.forEach((i) => console.log(i?.toString()));

        for (let i = 1; i < arr.length; ++i) {
            // let prevRes=Object.assign({}, res);

            res = BigDecimal.sum(res, arr[i]!);

            // console.log(`${prevRes.toString()}+${arr[i]!.toString()}=${res.toString()}`);
        }

        res = BigDecimal.prod(res, new BigDecimal("2"));

        return res;
    }

    static log(bigDec: BigDecimal, base: BigDecimal = new BigDecimal(10)) {
        return BigDecimal.div(BigDecimal.ln(bigDec), BigDecimal.ln(base));
    }

    static sin(bigDec: BigDecimal) {
        function fac(num: number) {
            let result = new BigDecimal(num.toString());
            if (num === 0 || num === 1)
                return new BigDecimal("1");
            while (num > 1) {
                num--;
                result = BigDecimal.prod(result, new BigDecimal(num.toString()));
            }
            return result;
        }

        const arr = [];


        for (let i = 0; i < 10; ++i) {
            const neg = new BigDecimal(((-1) ** i).toString());
            const numerator = BigDecimal.pow(bigDec, new BigDecimal(2 * i + 1));
            const denumenator = fac(2 * i + 1);
            const res = BigDecimal.div(numerator, denumenator);
            arr[i] = BigDecimal.prod(neg, res);
        }

        let res = arr[0] as BigDecimal;

        for (let i = 1; i < arr.length; ++i) {
            // let prevRes=Object.assign({}, res);

            res = BigDecimal.sum(res, arr[i]!);

            // console.log(`${prevRes.toString()}+${arr[i]!.toString()}=${res.toString()}`);
        }

        return res;
    }

    toString() {
        const num1Str = this.num1.toString();
        const num2Str = this.num2.toString();
        return `${this.isNegative ? "-" : ""}${num1Str}${num2Str.replace("0", "").length === 0 ? "" : '.' + "0".repeat(this.zerosBefNum2) + num2Str.replace(/0+$/, '')}`;
    }
}



const num1 = new BigDecimal("10");
// const num1 = new BigDecimal("354.05");
const num2 = new BigDecimal("2");
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
                diff: "-0.0000001",
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

// for (let i of cases) {
//     const num1 = new BigDecimal(i.args[0]![0]!, i.args[0]![1]!);
//     const num2 = new BigDecimal(i.args[1]![0]!, i.args[1]![1]!);
//     const res = {
//         sum: BigDecimal.sum(num1, num2).toString(),
//         diff: BigDecimal.diff(num1, num2).toString(),
//         prod: BigDecimal.prod(num1, num2).toString(),
//         div: BigDecimal.div(num1, num2).toString(),
//     }
//     for (let j in res) {
//         if (res[j as keyof typeof i.res] !== i.res[j as keyof typeof i.res]) console.log(...i.args + ` did not pass ${j}. Expected Result: ${i.res[j as keyof typeof i.res]} Got Result: ${res[j as keyof typeof i.res]}`);
//     }
// }

// console.log(BigDecimal.sqrt(num1).toString());
// console.log(BigDecimal.prod(num1, num2).toString());

// console.log(BigDecimal.sin(new BigDecimal("0.1")).toString());

console.log(BigDecimal.fac(num1).toString());
