const Koa = require('koa');
const Router = require('@koa/router');
const querystring = require('querystring');
const uuid = require('uuid');
const session = require('koa-session');
const crypto = require('crypto'); // sha256(express)  sha1(koa)  比md5 多个盐值 
const app = new Koa();

const secret = 'zfsecret'
app.keys = [secret]; // 提供cookie用于签名的秘钥
app.use(session({}, app));
const router = new Router();

let cardName = 'zhufeng'; // 店铺名字
// let session = {}; // session就是一个服务器记账的本子，为了稍后能通过这个本找到具体信息
router.get('/wash', async function(ctx) {
    let hasVisit = ctx.session[cardName];
    if (hasVisit) {
        ctx.session[cardName].mny -= 100;
        ctx.body = '恭喜你消费了 ' + ctx.session[cardName].mny
    } else {
        ctx.session[cardName] = { mny: 500 };
        ctx.body = '恭喜你已经是本店会员了 有500元'
    }


    // let hasVisit = ctx.cookies.get(cardName,{signed:true});
    // if(hasVisit && session[hasVisit]){ // 必须保证你的卡是我的店的
    //     session[hasVisit].mny -= 100;
    //     ctx.body = '恭喜你消费了 ' + session[hasVisit].mny
    // }else{
    //     const id = uuid.v4(); //冲500
    //     session[id] = {mny:500};
    //     ctx.cookies.set(cardName,id,{signed:true});
    //     ctx.body = '恭喜你已经是本店会员了 有500元'
    // }
})
// ssr 前后端同构的时候 用session来事件用户鉴别是最方便的
app.use(router.routes()).use(router.allowedMethods()); // 405

app.listen(3000, function() {
    console.log(`server start 3000`)
})