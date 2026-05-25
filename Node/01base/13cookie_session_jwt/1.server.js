// cookie实现

const Koa = require('koa');
const Router = require('@koa/router');
const querystring = require('querystring');
const crypto = require('crypto');  // md5是公开算法，别人看出是md5加密的话，可以伪造所以不能使用md5；sha256(express) sha1(koa) 都属于加盐算法，比md5多个盐值
const app = new Koa();

const secret = 'zqsecret'; // 存放在服务器中的

const toBase64URL = (str)=>{
  return str.replace(/\=/g,'').replace(/\+/g,'-').replace(/\//,'_');
}

// cookie的签名只是防止用户去篡改数据，如果用户篡改过了，我就丢弃掉，并不是为了安全
app.use(async (ctx, next) => {
  const cookies = [];
  ctx.my = {
    set(key, value, options = {}) {
      let optsArr = [];
      if (options.domain) {
          optsArr.push(`domain=${options.domain}`)
      }
      if (options.httpOnly) {
          optsArr.push(`httpOnly=${options.httpOnly}`)
      }
      if (options.maxAge) {
          optsArr.push(`max-age=${options.maxAge}`)
      }
      if (options.signed) { // 说明 为了安全 需要给数据签名

        // base64作为数据在浏览器中传递的时候 会 把 + / = 做特殊处理
        let sign = toBase64URL(crypto.createHmac('sha1',secret).update([key, value].join('=')).digest('base64'));
        cookies.push(`agesign=${sign}`)

      }
      cookies.push(`${key}=${value}; ${optsArr.join('; ')}`) // 分号+空格，获取的时候需要注意下
      ctx.res.setHeader('Set-Cookie', cookies);
    },
    get(key, options) {
      let cookieObj = querystring.parse(ctx.req.headers['cookie'], '; '); // a=1; b=2 {a:1,b:2}
      if(options.signed){
          // 上次的签名 == 当前的签名
          if (cookieObj[`${key}sign`]  == toBase64URL(crypto.createHmac('sha1',secret).update(`${key}=${cookieObj[key]}`).digest('base64'))){
              return cookieObj[key]
          }else{
              return 'error';
          }
      }
      return cookieObj[key] || '';
    }
  }
  return next();
});


const router = new Router();

// (为什么用cdn， cdn是一个特殊域名，不会发送cookie)
// document.cookie
// key cookie的key
// value cookie的值
// domain 域名
// path 路径
// exipres/max-age存活时间
// httpOnly
// xsrf 诱导用户点击一个图片，发请求通过url把你本地cookie传递给他自己的服务器 document.cookie

// 浏览器增加cookie的方式：document.cookie
router.get('/write', async function(ctx) {
  // ctx.res.setHeader('Set-Cookie', 'zq');
  // ctx.res.setHeader('Set-Cookie', ['name=zq', 'age=18']); // 多个值用数组进行设置，不能一个一个设置，后面设置的值会覆盖前面的值。
  // ctx.res.setHeader('Set-Cookie', ['name=zq', 'age=18;domain=.zf.cn']); // domain:设置可以访问的域名，比如：a.zf.cn或者b.zf.cn都是可以访问的。
  // ctx.res.setHeader('Set-Cookie', ['name=zq', 'age=18;domain=.zf.cn;path=/write', ]); // path:设置只有/write路径才可以读到cookie;(一般没人设置)
  // ctx.res.setHeader('Set-Cookie', ['name=zq', 'age=18; domain=.zf.cn; httpOnly=true', ]); // httpOnly为true, document.cookie获取不到
  ctx.my.set('name', 'zq', {
    domain: '.zq.cn', // .zq.cn域名下才可以被写入
    httpOnly: true,
    maxAge: 5  // 5s之后失效
  })
  // ctx.my.set('name', 'zq1', {
  //   maxAge: 50
  // })

  // 验证数据的正确性，防止数据被篡改，我们需要给cookie 加盐
  ctx.my.set('age', '12', { signed: true })

  ctx.body = 'write ok';
})
router.get('/read', async function(ctx) {
    ctx.body = ctx.my.get('age',{ signed:true }) // name=zf; age=12
})



app.use(router.routes()).use(router.allowedMethods());  // allowedMethods：响应头中返回允许使用的请求方法；状态码405：表示用错请求方法了
  
app.listen(3000, () => {
  console.log('server start 3000');
})