
// ts出现的目的就是为了代码的安全


// 联合类型，默认并集的关系 ---------------1----------------------
let strOrNumber: number | string; // 如果联合类型不赋予任何类型，那么它只能调用多个类型中间的公共方法
// 注意，一般情况下，联合类型都需要赋值后使用
// strOrNumber.toString(); // 代码报错需先关闭严格模式(strict和strictNullChecks)
strOrNumber = 123;
strOrNumber.toFixed(2);
strOrNumber = 'abc';
strOrNumber.split('');






// 非空断言 -----------------------2---------------------
let ele: HTMLElement | null = document.getElementById('app');
// ! 表示非空断言，一定不为空。如果出现为空的情况自行承担。
ele!.style.color = 'red';

// ? 可选链运算符，es10语法，下面的两个都是js语法
ele?.style.color  // 表示ele有值才取style属性
// ?? 空值合并操作符，过滤前一个值是不是null或undefined,如果是null/undefined则返回后面的值
console.log(false ?? 2); // false



// 类型断言处理 为空 的情况： as语法  （强转） -------------------3-----------------------
(ele as HTMLElement).style.color = 'red'; // 强制断言成一个类型
// (<HTMLElement>ele).style.color = 'red'; // 不建议使用，可能和JSX冲突
let sn: number | boolean;
// (sn! as string).split(''); // 断言只能用于断言存在的类型
(sn! as number).toFixed(2);

sn! as any as string // 双重断言，一般不建议使用，会破坏数据的原有类型



// 字面量类型，类似枚举，有固定的值; 通过type关键字来自定义类型 -------4--------------------------
type COLOR = 'red' | 'yellow' | 'blue';
let color: COLOR = 'red';

// 联合类型，非空，强转，字面量类型 ======================================================




export { };