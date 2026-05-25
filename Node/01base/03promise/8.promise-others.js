
const fs = require('fs')
const path = require('path');

// const Promise1 = require('./my-promise/promise');
// function readFile(url, encoding) {
//     // 延迟对象的使用场景
//     let dfd = Promise1.deferred();
//     fs.readFile(path.resolve(__dirname, url), encoding, function (err, data) {
//         if (err) return dfd.reject(err);
//         dfd.resolve(data);
//     })
//     return dfd.promise
// }
// readFile('file.txt', 'utf8').then(data => {
//     console.log(data)
// })


//Promise.resolve   Promise.reject
// resolve的特点就是传入的是一个promise，我们会等待这个promise执行完毕
// Promise.resolve(new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('hello')
//     },1000)
// })).then(data=>{
//     console.log(data)
// })

// Promise.reject(new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('hello')
//     },1000)
// })).then(data=>{
//     console.log(data)
// },err=>{
//     console.log(err)
// })


// catch 捕获异常 
// Promise.reject(new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('hello')
//     }, 1000)
// })).catch(err => {
//     console.log(err)
// })


// 执行完毕后会将结果放到数组里，all的含义就是都成功才成功，有一个失败就失败了


// let util = require('util'); // 工具方法
let fsPromises = promisifyAll(fs); // node中的api可以通过util转换成promise写法，仅仅针对node中的api 因为node中的回调方法 都有err和data
function promisify(fn) { // fs.readFile
    return function (...args) { // readFile
        return new Promise((resolve, reject) => {
            fn(...args, function (err, data) {
                if (err) return reject(err);
                resolve(data)
            })
        })
    }
}
function promisifyAll(obj) {
    let result = {}
    for (let key in obj) { // 判断值是不是一个函数，是函数就转化成promise
        result[key] = typeof obj[key] === 'function' ? promisify(obj[key]) : obj[key]
    }
    return result;
}
Promise.all([fsPromises.readFile(path.resolve(__dirname, 'name.txt'), 'utf8'), fsPromises.readFile(path.resolve(__dirname, 'age.txt'), 'utf8'), '123']).then(data => {
    console.log(data)
})


