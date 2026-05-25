

 const Promise = require('./promise/4.promise')
let p1 = new Promise((resolve, reject) => {
  resolve('ok');
}).then((data) => {
  // return { then: () => { }} // 什么都没输出
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject(data);
      resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('okok')
        }, 1000);
      }))
    }, 1000);
  });
})

p1.then((data) => {
  console.log(data, '000');
}, err => {
  console.log(err, 'err');
})


new Promise((resolve, reject) => {
  resolve('ok');
}).then().then().then().then(data => {
// }).then(null).then(null).then(null).then(data => {
// }).then(data => data).then(data => data).then(data => data).then(data => {
  console.log(data); // ok
});

new Promise((resolve, reject) => {
  reject('err');
}).then(null, err => {  throw err }).then(null, err => {  throw err }).then(null, err => {  throw err }).then(data => {
  console.log(data); // ok
}, error => {
  console.log('error')
});