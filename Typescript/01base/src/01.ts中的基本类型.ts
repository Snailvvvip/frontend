// 编译结果查看dist/bundle.js文件


// 在ts中如果不指定类型，那么ts默认无法推导，结果就是any，可以被任何类型所赋值
// ts中的类型都是:后面，:后面跟着的都是类型

// 在我们的js中，当我们调用方法的时候，涉及到装箱的概念
// 装箱：把基础类型包装成对象类型
// 1..toString(); === Number(1).toString(); 如果默认调用基础类型上的方法，会有装箱的功能，就是把基础类型变成对象类型
// 1.toString() 会认为是个小数

// +'3' => 3 加号把字符串转换成数字

// *************** 1-3 ***********************
// ts中的基础类型
let str: string = 'zq';
let num: number = 1;
let bool: boolean = true;


// Boolean是一个类，类是可以充当类型的，用来描述实例
let a1:boolean = true;
let a2:Boolean = true; // true是Boolean的一个实例
let a3:Boolean = new Boolean(true); // 是可以的
// let a4:boolean = new Boolean(true); // 是错误的,对象不可以赋值给boolean类型
// 小写的类型是基础类型

// *************** 4 元组 ***********************
// ts中还新增了类型即元组，表示长度和类型是固定的数组
let tuple: [string, number, boolean] = ['zq', 100, true];
// tuple[3] = 100; // 报错，不能通过索引增加数据
// tuple.push({}) // 报错，元组在通过方法添加数据的时候，只能添加已经存在的类型

// *************** 5 ***********************
// 数组特点：存放一类类型的集合；联合类型（｜）可以设置数组的不确定性；
let arr: (string | number)[] = [1];
let arr2: Array<(number | string)> = [1];

// *************** 6 ***********************
// 枚举类型
enum AUTH {
  ADMIN = 1,
  MANAGER = 2,
  USER = 4
}
// 默认枚举具有反举功能，最终编译的结果是一个对象，如果没有默认值，会自动给出递增下标；
// 如果当前枚举的值不是一个数字，后面的结果都需要进行手动标识;如果不是数字，不会生成反举
console.log(AUTH.ADMIN);
console.log(AUTH.MANAGER);
// 反举
console.log(AUTH[1]);
console.log(AUTH[4]);

// 默认值为数字，索引自增
enum AUTH_INC {
  ADMIN = 5, // 没有给默认值，则从0开始
  MANAGER,
  USER
}

// 常量枚举，不会编译出额外的代码来；在不需要反举的情况下，我们通常使用常量枚举
enum COLOR {
  RED,
  YELLOW,
  BLUE
}
console.log(COLOR.RED);
console.log(COLOR.YELLOW);


// *************** 7,8 null / undefined ***********************
// null / undefined区别是什么

// ts中null和undefined可以赋值给任何类型（任何类型的子类型）；严格模式下，不能将null和undefined赋值给其他类型
// 严格模式中，null -> null  undefined -> undefined
let un: undefined = undefined;
let nu: null = null;

// strictNullChecks 如果开启null严格检测，则null不能赋值给其他人

// *************** 9 void ***********************

// void能接受的返回值有undefined和null，在严格模式下不能使用null
function a(): void {
  
}

// *************** 10 never ***********************
// never 标识永远不 1）永远无法到终点（死循环，抛错） 2）判断的时候会出现never 3)用never来做一些特殊处理
function throwError(): never {
  throw new Error();
}

function whileTrue (): never {
  while (true) {
    
  }
}

function getVal(str: string) { // 在判断无法走到的时候，结果是never类型
  if (typeof str == 'string') {
    
  } else {
    str
  }
}

// *************** 11 ***********************
// Symbol bigInt
let s1: symbol = Symbol();
let s2: symbol = Symbol(); // Symbol是独一无二的

let big1 = Number.MAX_SAFE_INTEGER + 1;
let big2 = Number.MAX_SAFE_INTEGER + 2;
console.log(big1 === big2); // true

let big3 = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
let big4 = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
console.log(big3 === big4); // false

// any(放弃ts校验) 不进行类型检测





// 默认添加 export { }，表示当前是一个模块，是局部作用域，与外部声明隔开
export { }