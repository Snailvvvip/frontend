// Promise 默认是一个类 用的时候需要new ，而且创建的实例上都有一个then方法. 在new过程中需要传入一个执行器

// 1) promise中有一个value属性用来描述成功的原因  reason是一个失败的原因
// 2) promise中如果出现异常也会执行失败的逻辑
// 3) promise有三个状态 pending 既不成功也不失败  fulfilled 成功态  rejected失败态
// 4）当状态是pending的时候 可以转化成成功或者失败,否则不能去改变状态
// 5) executor会立刻执行，并且传入两个参数resolve, reject 

const Promise = require('./promise/1.promise')
const p1 = new Promise((resolve, reject) => {
    setTimeout(()=>{
        reject('成功')
    },1000);
});
p1.then((value) => { // then里面要有两个参数  onFulfilled, onRejected
    console.log('成功',value)
}, (reason) => {
    console.log('失败',reason)
})

p1.then((value) => { // then里面要有两个参数  onFulfilled, onRejected
    console.log('成功',value)
}, (reason) => {
    console.log('失败',reason)
})


// 实现promise的链式调用