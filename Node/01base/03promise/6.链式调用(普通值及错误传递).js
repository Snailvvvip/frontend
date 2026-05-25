
// 链式调用： 上一个人的输出是下一个人的输入   file.txt  -> age.txt

const fs = require('fs');
const path = require('path');

// 希望解决回调地狱的问题，恶魔金字塔。 就采用promise来解决这个问题

function readFile(url,encoding){
    return new Promise((resolve,reject)=>{
        fs.readFile(url,encoding,function(err,data){
            if(err) return reject(err);
            resolve(data)
        })
    })
}
// 1.promise中then传入的方法 返回的如果不是promise(普通值)，那么会将这个结果传递给下一次then的成功中去
// 2.如果then传入的方法在执行的时候出错了 会执行下一次then的失败
// 3.如果then传入的方法在执行返回的是一个promise，那么会根据promise的状态来决定走下一次then的成功还是失败.成功的值和失败的原因会以这个promise的结果为准

// 什么情况会走失败？1） 抛出异常  2） 如果返回的是一个失败的promise会走失败
// 其他情况全部走成功
readFile(path.resolve(__dirname,'file.txt'),'utf8').then(data=>{
    return readFile(path.resolve(__dirname,data+1),'utf8')
}).then((data)=>{
    console.log(data,'s');
},(err=>{
    console.log(err,'e')
})).then(()=>{
    console.log('成功')
},()=>{
    console.log('失败')
})
// fs.readFile(path.resolve(__dirname,'file.txt'),'utf8',function(err,data){
//     if(err) return err;
//     fs.readFile(path.resolve(__dirname,data),'utf-8',function(err,data){
//         if(err) return err;
//         console.log(data);
//     })
// })

// ---- 普通值 ----

// 当一个promise调用then后，还可以继续then，说明需要返回一个全新的promise
// 一个promise如果一旦成功了不能变成失败态

const Promise = require('./promise/3.promise')
let p1 = new Promise((resolve, reject) => {
  // resolve('ok');
  // reject('error');
  setTimeout(() => {
    resolve('123');
  }, 1000)
}).then((data) => {
  return data;
})

p1.then((data) => {
    console.log(data, '000')
}, err => {
    console.log(err, 'err');
});


// x 就是then方法中的返回值
// p1 调用then后返回的新的promise
// 我们用x的值 来决定p1 是成功还是失败


