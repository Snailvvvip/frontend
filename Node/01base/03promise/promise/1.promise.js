const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
class Promise {
    constructor(executor) {
        this.status = PENDING;// promise的默认状态
        this.value = undefined; // 成功的值和失败的原因 
        this.reason = undefined;
        
        const resolve = (value) => { // 更改状态的方法 resolve
            if(this.status == PENDING){
                this.value = value;
                this.status = FULFILLED
            }
        }
        const reject = (reason) => { // 更改状态的方法 reject
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED
            }
        }
        try{
            executor(resolve, reject); // executor就是执行器立刻执行，出错就调用reject
        }catch(e){
            reject(e);
        }
    }
    then(onFulfilled, onRejected){ // 调用then的时候会判断是成功还是失败
        if(this.status === FULFILLED){
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.reason)
        }
    }
}

module.exports = Promise;