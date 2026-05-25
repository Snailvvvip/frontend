const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
class Promise {
    constructor(executor) {
        this.status = PENDING;// promise的默认状态
        this.value = undefined; // 成功的值和失败的原因 
        this.reason = undefined;

        this.onResolvedCallbacks = []; // 这里存放所有成功的回调
        this.onRejectedCallbacks = []; // 所有失败的回调
        const resolve = (value) => { // 更改状态的方法 resolve
            if(this.status == PENDING){
                this.value = value;
                this.status = FULFILLED
                this.onResolvedCallbacks.forEach(cb=>cb(this.value))
            }
        }
        const reject = (reason) => { // 更改状态的方法 reject
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(cb=>cb(this.reason))
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
        if(this.status == PENDING){
            // 发布订阅  有可能调用then的时候没成功也没失败，我就将回调存起来，稍后根据用户调用的方法在进行执行
            this.onResolvedCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected)
        }
    }
}

module.exports = Promise;