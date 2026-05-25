
## cookie和session/sessionStorage/localStorage/indexDB
### cookie特点：
- cookie是在http-header中的 （不宜过大，如果过大可能会造成页面白屏）
- http“无状态”，所以可以通过浏览器添加cookie，服务端也可以设置cookie, 每次请求都会携带cookie （每次请求都携带，浪费流量）识别用户；合理设置(超过4k数据可能会丢失)。 
- cookie 默认不能跨域。 （两个完全不同的域名不能跨域，如果是父子域名则可以设置子域能拿到父域中的数据）；cookie存在前端里会存在安全问题，应该放在服务器上。

### session特点
- session存在服务器里的，默认浏览器是拿不到的，session可以存放数据原则上没有上线，而且安全；sessions是基于cookie的；
- session默认都是存在内存中的（如果服务器宕掉了，session就丢失了；解决方案是 -> 存到到数据库中；数据库也有可能数据丢失则换一种方案使用jwt）

### jwt
- jwt这种方案，服务根据用户提供的信息生成一个令牌。每次带带上令牌和你的信息，用你的信息再次生成令牌做对比 （令牌里面不能存放隐私） token

### sessionStorage
- sessionStorage 浏览器关闭掉就丢失了  （不能跨域）

### localStorage
- localStorage 浏览器关掉也不会丢

### indexDB
- indexDB 浏览器的数据库

这些都不能跨域   

> 静态资源如何优化： （压缩gzip，强制缓存，协商缓存，预加载） localStorage来存储js文件