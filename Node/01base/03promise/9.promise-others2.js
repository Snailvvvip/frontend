const { promisifyAll } = require('./my-promise/promise');
const path = require('path')
const fs = require('fs');
const fsPromises = promisifyAll(fs);
// race 方法 赛跑就死以第一个结果为基准, 取最先的结果为准，其他的代码还会执行，只是不采用结果了

// Promise.race([fsPromises.readFile('name.txt', 'utf8'), fsPromises.readFile('age.txt', 'utf8'), 123]).then(data => {
//     console.log('data', data)
// }).catch(er => {
//     console.log(er)
// })

// 定义超时逻辑 
// let abort
// let p = new Promise((resolve, reject) => {
//     // abort = reject;
//     setTimeout(() => {
//         resolve('data~~~');
//     }, 2000);
// });
// setTimeout(() => {
//     p.abort('超时了'); // 这里只是借助了promise一旦失败就不能成功了，但是promise原有的逻辑还是会执行
// }, 3000)
// // 我们可能会有一个超时逻辑，超过1s 就不采用成功的结果了
// function wrapPromise(userPromise) {
//     // race 有任何一个失败了就失败 [自己造一个promise,userPromise]
//     let abort;
//     let internalPromise = new Promise((resolve, reject) => {
//         abort = reject;
//     })
//     let racePromise = Promise.race([internalPromise,userPromise]);
//     racePromise.abort = abort;
//     return racePromise
// }
// p = wrapPromise(p);
// p.then(data => {
//     console.log(data);
// }).catch(err => {
//     console.log(err);
// });

// 新增的方法 可以获取无论成功还是失败的结果
// Promise.allSettled = function (promises) {
//     let result = [];
//     let times = 0;
//     return new Promise((resolve, reject) => {
//         function processResult(data, index, status) {
//             result[index] = { status, value: data }; // 映射结果
//             if (++times == promises.length) {
//                 resolve(result);
//             }
//         }
//         for (let i = 0; i < promises.length; i++) {
//             let promise = promises[i];
//             Promise.resolve(promise).then((data) => {
//                 processResult(data, i, 'fulfilled');
//             }, (err) => {
//                 processResult(err, i, 'rejected');
//             })
//         }
//     })
// }
// Promise.allSettled([
//     fsPromises.readFile(path.resolve(__dirname, 'file.txt'), 'utf8'),
//     fsPromises.readFile(path.resolve(__dirname, 'file1.txt'))]).then(data => {
//         console.log(data)
//     })


// finnaly 无论成功和失败都执行的方法
Promise.prototype.finally = function (finallyCallback) {
    return this.then((data) => {
        return Promise.resolve(finallyCallback()).then(() => data);
    }, (err) => {
        return Promise.resolve(finallyCallback()).then(() => { throw err })
    })
}

//  评价  -> 去发个请求保存状态
Promise.resolve('hello').finally(() => { // 无论成功失败都执行
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('finally~~~~')
            resolve();
        }, 1000);
    })
}).then(data => {
    console.log(data, 'success')
}).catch(err => {
    console.log(err, 'err')
})
