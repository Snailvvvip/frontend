// 函数的柯里化 ----即是--》 高阶函数  

// 柯里化的概念： 如果一个函数有多个参数, 我们可以根据参数的个数，转化成n个函数；
// 柯里化我们一般都认为参数是一个一个的传递的。
// 偏函数： 根据参数的个数分解成函数，每次调用函数的参数个数可以不是一个。也统称为柯里化
// 反柯里化： 让函数范围变的更大一些

// (如果我们想暂存参数 可以考虑使用柯里化 ； 柯里化就算是一个闭包函数)  
// (柯里化的作用：可以使函数变为更加具体的函数)


// -----------------------------------------------
// 实现类型检测功能：

// 判断数据类型的方法：
// typeof（我们一般用于判断基础类型）   >  Array.isArray > Object.prototype.toString.call（判断具体类型 返回的是一个字符串） > instanceof（xxx是谁的实例 原理） > constructor（深拷贝）

function isType(type){
    return function (val){
        return Object.prototype.toString.call(val) === `[object ${type}]`
    }
}
// 函数分步传递参数，将函数拆分成功能更具体化的函数
const flag = isType('hello','String');
const util = {};
const types = ['String','Number','Boolean'];
types.forEach(type=>{
    util['is'+type] = isType(type);
});


// 写完通用柯里化函数后
// function isType(type,val){
//     return Object.prototype.toString.call(val) === `[object ${type}]`
// }
// let isString =curring(isType)('String');
// let isNumber = curring(isType)('Number')
// let isBoolean = curring(isType)('Boolean');
// console.log(isString(123));
// console.log(isNumber(456));
// console.log(isBoolean(123));




// --------------------------------

// 实现一个通用的柯里化函数 开发是经常使用的，面试中经常被问到

function sum(a,b,c,d){
    return a+b+c+d;
}

function curring(fn) {
  const inner = (args = []) => { // 存储每次调用时传入的参数
    return args.length >= fn.length ? fn(...args) : (...outerArgs) => inner([...args, ...outerArgs]) 
   }
  return inner();
}

let fn = curring(sum)
let fn1 = fn(1)
let fn2 = fn1(2,3)
let result = fn2(4);
console.log(result);

// 请求数据  多个接口等待数据返回后 再去渲染页面 