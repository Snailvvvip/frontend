// 深度代理
function deepProxy(val, handler) {
  if (typeof val !== "object") return val;
  for (let key in val) {
    val[key] = deepProxy(val[key], handler);
  }
  return new Proxy(val, handler());
}

// 创建代理
function createObservable(val) {
  // 声明一个专门用来代理的对象
  let handler = () => {
    return {
      set(target, key, value) {
        return Reflect.set(target, key, value);
      },
      get(target, key) {
        return Reflect.get(target, key);
      },
    };
  };
  return deepProxy(val, handler);
}

function observable(target) {
  // 需要将这个目标对象进行代理操作 创建成可观察对象
  return createObservable(target);
}

export default observable;
