// 学习课件：http://www.zhufengpeixun.com/jg-vue/node/async-1.html
// 架构课Node正式课-课时1
// 仓库地址：https://gitee.com/jw-speed/jiagouke2-node
/**
 * 高阶函数的概念:
 * 1. 一个函数的参数可以接收一个函数，我们称之为高阶函数。回调函数是高阶函数的一种。
 * 2. 一个函数返回一个函数。（不单指闭包）
 * 这两个条件满足任何一个均可。promise内部肯定也是回调函数(内部包含着高阶函数)。
 * 扩展方法的时候会用到高阶函数。
 * 
 */

function core(...args) {
  // ...
  console.log('core', ...args);
  // ...
}
Function.prototype.before = function(cb) {
  // 在这里 this = core; 谁调用的before，this指向谁
  return (...args) => { // 剩余运算符，可以把多个参数转化成数组；箭头函数的特点：没有this，没有arguments，没有原型链 
    cb();
    this(...args); // this是指core函数，箭头函数没有this会向上查找
  }
}
let newCore = core.before(() => {
  console.log('before');
})

newCore('a', 'b');


// AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，其实就是给原函数增加一层，不用管原函数内部实现


/**
 * 扩展：什么叫闭包：函数的定义是有作用域的概念，一个函数定义的作用域和执行的作用域不在同一个，肯定会出现闭包。
 */

function a() {
  let x = 1;
  return function b() {
    console.log(x);
  };
}
b(); // 在a的外部调用是闭包，b被调用后a不能销毁