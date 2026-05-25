// koa的cookie使用

const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();

const secret = 'zqsecret'; // 存放在服务器中的
app.keys = [secret]; // 提供cookie用于签名的秘钥
const router = new Router();
router.get('/write', async function(ctx) {
  ctx.cookies.set('name', 'zq', {
    domain: '.zq.cn', // .zq.cn域名下才可以被写入
    httpOnly: true,
    maxAge: 5  // 5s之后失效
  })
  ctx.cookies.set('age', '12', { signed: true })
  ctx.body = 'write ok';
})
router.get('/read', async function(ctx) {
  ctx.body = ctx.cookies.get('age', { signed: true }) || 'empty'; // name=zf; age=12
})



app.use(router.routes()).use(router.allowedMethods());  // allowedMethods：响应头中返回允许使用的请求方法；状态码405：表示用错请求方法了
  
app.listen(3000, () => {
  console.log('server start 3000');
})