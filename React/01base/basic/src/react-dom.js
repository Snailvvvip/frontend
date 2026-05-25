import {
  REACT_TEXT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  PLACEMENT,
  MOVE,
  REACT_PROVIDER,
  REACT_CONTEXT,
  REACT_MEMO,
} from "./constants";
import { addEvent } from "./event";

let scheduleUpdate;
//这是一个全局变量，用来记录hook的值
let hookState = [];
//存放当前hook的索引值
let hookIndex = 0;

/**
 * 把虚拟DOM变成真实DOM插入到容器内部
 * @param {*} vdom 虚拟DOM
 * @param {*} parentDOM 容器
 */
function render(vdom, parentDOM) {
  mount(vdom, parentDOM);
  //在React里不管在哪里触发的更新，真正的调度都是从根节点开始的
  scheduleUpdate = () => {
    hookIndex = 0; //把索引重置为0
    //从根节点执行完整的dom-diff 进行组件的更新
    compareTwoVdom(parentDOM, vdom, vdom);
  };
}

function mount(vdom, parentDom) {
  let newDom = createDOM(vdom);
  if (newDom) {
    parentDom.appendChild(newDom);
    if (newDom._componentDidMount) {
      newDom._componentDidMount();
    }
  }
}

export function useEffect(effect, deps) {
  //先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastDestroy, lastDeps] = hookState[hookIndex];
    let same = deps && deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
    } else {
      //如果有任何一个值不一样，则执行上一个销毁函数
      lastDestroy && lastDestroy();
      //开启一个新的宏任务
      setTimeout(() => {
        let destroy = effect();
        hookState[hookIndex++] = [destroy, deps];
      });
    }
  } else {
    //如果是第一次执行执行到此
    setTimeout(() => {
      let destroy = effect();
      hookState[hookIndex++] = [destroy, deps];
    });
  }
}
export function useLayoutEffect(effect, deps) {
  //先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastDestroy, lastDeps] = hookState[hookIndex];
    let same = deps && deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
    } else {
      //如果有任何一个值不一样，则执行上一个销毁函数
      lastDestroy && lastDestroy();
      //开启一个新的宏任务
      queueMicrotask(() => {
        let destroy = effect();
        hookState[hookIndex++] = [destroy, deps];
      });
    }
  } else {
    //如果是第一次执行执行到此
    queueMicrotask(() => {
      let destroy = effect();
      hookState[hookIndex++] = [destroy, deps];
    });
  }
}
export function useRef(initialState) {
  hookState[hookIndex] = hookState[hookIndex] || { current: initialState }; //hookState[0]=10
  return hookState[hookIndex++];
}
export function useReducer(reducer, initialState) {
  hookState[hookIndex] = hookState[hookIndex] || initialState; //hookState[0]=10
  let currentIndex = hookIndex; // 闭包保存的变量, dispatch修改状态的时候是定义时的值currentIndex，hookIndex改变对dispatch无影响
  function dispatch(action) {
    action =
      typeof action === "function" ? action(hookState[currentIndex]) : action;
    hookState[currentIndex] = reducer
      ? reducer(hookState[currentIndex], action)
      : action;
    scheduleUpdate(); //状态变化后，要执行调度更新任务
  }
  return [hookState[hookIndex++], dispatch];
}

export function useState(initialState) {
  // useState是一个useReducer的语法糖，是一个简单的实现
  return useReducer(null, initialState);
  /* hookState[hookIndex]=hookState[hookIndex]||initialState;//hookState[0]=10
    let currentIndex = hookIndex; // 闭包保存的变量
    function setState(newState){
        hookState[currentIndex]=newState;//currentIndex指向hookIndex赋值的时候的那个值 0
        scheduleUpdate();//状态变化后，要执行调度更新任务
    }
    return [hookState[hookIndex++],setState]; */
}

/**
 * 可以缓存对象
 * @param {*} factory 可以用来创建对象的工厂方法
 * @param {*} deps 依赖数组
 */
export function useMemo(factory, deps) {
  //先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastMemo, lastDeps] = hookState[hookIndex];
    let same = deps && deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = factory();
      hookState[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    //说明是初次渲染
    let newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
/**
 * 可以缓存回调函数
 * @param {*} callback 回调函数
 * @param {*} deps 依赖数组
 */
export function useCallback(callback, deps) {
  //先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastCallback, lastDeps] = hookState[hookIndex];
    let same = deps && deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookState[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    //说明是初次渲染
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }
}

/**
 * 把虚拟DOM转成真实DOM
 */
export function createDOM(vdom) {
  if (!vdom) return null;
  let { type, props, ref } = vdom;
  let dom; // 真实DOM
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemo(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProvider(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContext(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      // 说明它是一个类组件
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type); // div span p
  }
  // 处理属性
  if (props) {
    updateProps(dom, {}, props);
    if (props.children) {
      let children = props.children;
      if (typeof children === "object" && children.type) {
        //说明这是一个React元素
        children._mountIndex = 0; // dom-diff使用
        mount(children, dom);
      } else if (Array.isArray(children)) {
        reconcileChildren(props.children, dom); // 处理子节点
      }
    }
  }
  vdom.dom = dom; // 让虚拟DOM的dom属性指向这个虚拟DOM对应的真实DOM
  if (ref) {
    ref.current = dom; // 如果把虚拟DOM转成真实DOM，就让ref.current = 真实DOM
  }
  return dom;
}

function mountMemo(vdom) {
  //type = {$$typeof:REACT_MEMO,type,//函数组件compare}
  let { type, props } = vdom; // type.type 函数组件
  let renderVdom = type.type(props);
  vdom.prevProps = props; //在vdom记录上一次的属性对象
  vdom.oldRenderVdom = renderVdom; //findDOM的时候用的
  return createDOM(renderVdom);
}

/**
 * 渲染Provder组件
 * 1.真正要渲染的是它的儿子children
 * 2.把Provider组件自己收到的value属性赋值给context._currentValue
 * @param {*} vdom
 * @returns
 */
function mountProvider(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  context._currentValue = props.value;
  let renderVdom = props.children;
  vdom.oldRenderVdom = renderVdom; //这个操作就是让当前的虚拟DOM的oldRenderVdom指向要渲染的虚拟DOm
  return createDOM(renderVdom);
}
function mountContext(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  let currentValue = context._currentValue;
  let renderVdom = props.children(currentValue);
  vdom.oldRenderVdom = renderVdom; //这个操作就是让当前的虚拟DOM的oldRenderVdom指向要渲染的虚拟DOm
  return createDOM(renderVdom);
}
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref); // render是React.forwardRef返回对象的属性，值时函数组件
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  //在类组件的构建函数中 类的实例this上是没有context属性的
  let context = ClassComponent.contextType
    ? ClassComponent.contextType._currentValue
    : undefined;
  let classInstance = new ClassComponent(props);
  if (ClassComponent.contextType) {
    classInstance.context = context;
  }
  // 如果类组件的虚拟DOM有ref属性，那么就把类的实例赋值给ref.current属性
  if (ref) ref.current = classInstance;
  if (classInstance.componentWillMount) {
    // 组件将要挂载
    classInstance.componentWillMount();
  }
  //把类组件的实例挂载到它对应的vdom上
  vdom.classInstance = classInstance;
  let renderVdom = classInstance.render();
  classInstance.oldRenderVdom = renderVdom; // 后面进行组件更新使用的
  // 把类组件的实例的render方法返回的虚拟DOM转换成真实DOM
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) {
    // 此时只是创建dom并未挂载完成，把componentDidMount绑在dom上以便mount后执行
    dom._componentDidMount =
      classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let oldRenderVdom = type(props); // 执行函数组件
  vdom.oldRenderVdom = oldRenderVdom; // 这个代码现在还没有用，后面进行组件更新使用的
  return createDOM(oldRenderVdom);
}
function reconcileChildren(childrenVdom, parentDOM) {
  childrenVdom.forEach((childVdom, index) => {
    childVdom._mountIndex = index;
    mount(childVdom, parentDOM);
  });
}

/**
 * 把新的属性更新到真实DOM上
 * @param {*} dom dom 真实DOM
 * @param {*} oldProps 旧的属性对象
 * @param {*} newProps 新的属性对象
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      // children
      continue;
    } else if (key === "style") {
      // style
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      // dom[key.toLocaleLowerCase()] = newProps[key];
      // 以后不再把事件函数绑定到对应DOM上，而是会进行事件委推，全部委托到document上
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key]; // className
    }
  }
}
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    // vdom={type:'h1'}
    return vdom.dom;
  } else {
    // 类组件和函数组件，他们虚拟DOM上没有dom属性，但是有oldRenderVdom属性
    let renderVdom = vdom.classInstance
      ? vdom.classInstance.oldRenderVdom
      : vdom.oldRenderVdom;
    return findDOM(renderVdom);
  }
}

/**
 * dom-diff核心是比较新旧虚拟DOM的差异，然后把差异同步到真实DOM节点上
 * 1 老新都没有
 * 2 老有新没有
 * 3.老没有新有
 * 4.老新都有
 * @param {*} parentDOM
 * @param {*} oldVdom
 * @param {*} newVdom
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  //老新都没有,什么都不需要做
  if (!oldVdom && !newVdom) {
    return null;
    //如果老的有，新的没有 卸载老节点
  } else if (oldVdom && !newVdom) {
    unMountVdom(oldVdom);
    //如果老的没有，新有的
  } else if (!oldVdom && newVdom) {
    let newDOM = createDOM(newVdom); //根据新的虚拟DOm创建新的真实DOM
    parentDOM.appendChild(newDOM); //添加到父节点上
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM); //添加到父节点上
    }
    if (newDOM._componentDidMount) newDOM._componentDidMount();
    //如果老的有，新的也有，但是类型不同
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unMountVdom(oldVdom); //删除老的节点
    let newDOM = createDOM(newVdom); //根据新的虚拟DOm创建新的真实DOM
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM); //添加到父节点上
    }
    if (newDOM._componentDidMount) newDOM._componentDidMount();
    //如果老的有，新的也有，并且类型也一样，只需要更新就可以，就可以复用老的节点了
  } else {
    //进入 深度对比子节点的流程
    updateElement(oldVdom, newVdom);
  }
}

/**
 * 深度更新节点
 * @param {} oldVdom
 * @param {*} newVdom
 */
function updateElement(oldVdom, newVdom) {
  if (oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemo(oldVdom, newVdom);
    //Provider更新
  } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProvider(oldVdom, newVdom);
    //Consumer的更新
  } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContext(oldVdom, newVdom);
    //如果新老节点都是纯文本节点的
  } else if (oldVdom.type === REACT_TEXT) {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content; //更新文本节点的内容为新的文本内容
    }
  } else if (oldVdom.type === REACT_FRAGMENT) {
    let currentDOM = (newVdom.dom = findDOM(oldVdom)); //获取老的真实DOM，准备复用
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    //此节点是下原生组件 span div而且 类型一样，说明可以复用老的dom节点
  } else if (typeof oldVdom.type === "string") {
    let currentDOM = (newVdom.dom = findDOM(oldVdom)); //获取老的真实DOM，准备复用
    updateProps(currentDOM, oldVdom.props, newVdom.props); //直接用新的属性更新老的DOM节点即可
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      //类组件
      updateClassComponent(oldVdom, newVdom);
    } else {
      //函数组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}
function updateMemo(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;
  //比较结果是相等,就不需要重新渲染 render
  let renderVdom = oldVdom.oldRenderVdom;
  if (!type.compare(prevProps, newVdom.props)) {
    let currentDOM = findDOM(oldVdom);
    let parentDOM = currentDOM.parentNode;
    let { type, props } = newVdom;
    renderVdom = type.type(props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  }
  newVdom.prevProps = newVdom.props;
  newVdom.oldRenderVdom = renderVdom;
}
function updateProvider(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom); //<div style={{margin:'10px'
  let parentDOM = currentDOM.parentNode; //div#root
  let { type, props } = newVdom; //type ={$$typeof:REACT_PROVIDER,_context:context }
  let context = type._context;
  context._currentValue = props.value; //给context赋上新的_currentValue
  let renderVdom = props.children;
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}
function updateContext(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom); //<div style={{margin:'10px'
  let parentDOM = currentDOM.parentNode; //div#root
  let { type, props } = newVdom; //type ={$$typeof:REACT_PROVIDER,_context:context }
  let context = type._context;
  let renderVdom = props.children(context._currentValue);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props);
  }
  classInstance.updater.emitUpdate(newVdom.props);
  newVdom.oldRenderVdom = classInstance.oldRenderVdom; //是用来找真实DOM时有用
}
function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
/**
 * 实现完整的DOM-DIFF算法
 * @param {*} parentDOM 父DOM节点
 * @param {*} oldVChildren 老的虚拟DOM儿子的数组
 * @param {*} newVChildren 新的虚拟DOM儿子的数组
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren)
    ? oldVChildren
    : oldVChildren
    ? [oldVChildren]
    : [];
  newVChildren = Array.isArray(newVChildren)
    ? newVChildren
    : newVChildren
    ? [newVChildren]
    : [];
  let keyedOldMap = {};
  let lastPlacedIndex = 0; //上一个不需要移动的老DOM节点的索引
  oldVChildren.forEach((oldVChild, index) => {
    let oldKey = oldVChild.key || index; //如果提供了key,会使用key作为唯一标识，如果没有提供，会使用索引
    keyedOldMap[oldKey] = oldVChild;
  });
  //存着将要进行的操作
  let patch = [];
  //循环新数组
  newVChildren.forEach((newVChild, index) => {
    newVChild._mountIndex = index; //设置虚拟DOM的挂载索引为index
    let newKey = newVChild.key || index;
    let oldVChild = keyedOldMap[newKey];
    if (oldVChild) {
      //如果找到了，先执行更新虚拟DOM元素 在React15里 DOM的更新和DOM-DIFF放在一起进行的。
      updateElement(oldVChild, newVChild);
      //如果找到的可以复用的老的DOM节点,它原来的挂载索引要比lastPlacedIndex要小，就需要移动，否则不需要移动
      if (oldVChild._mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          fromIndex: oldVChild._mountIndex,
          toIndex: index,
        });
      }
      //如果此节点被复用了，把它从map中删除
      delete keyedOldMap[newKey];
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild._mountIndex);
    } else {
      // 老的DOM节点中没有找到可复用老节点
      patch.push({
        type: PLACEMENT, // 插入 insert
        newVChild,
        toIndex: index,
      });
    }
  });
  /* Object.values(keyedOldMap).forEach(oldVChild=>{
      patch.push({
          type: DELETION,
          oldVChild,
          fromIndex:oldVChild._mountIndex
      });
  }); */
  //获取要移动 的元素 这里面只有B
  //此处我只是把B从界面中移动了，但是B还在是内存里的，B 这个DOM元素并没有被销毁
  const moveChilds = patch
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVChild);
  //现在keyedOldMap放着所有的剩下的元素
  Object.values(keyedOldMap)
    .concat(moveChilds)
    .forEach((oldVChild) => {
      let currentDOM = findDOM(oldVChild);
      //获取到B D F三个真实DOM元素，然后从界面中删除
      currentDOM.parentNode.removeChild(currentDOM);
    });
  patch.forEach((action) => {
    let { type, oldVChild, newVChild, toIndex } = action;
    let childNodes = parentDOM.childNodes; //获取真实的子DOM元素的集合[A,C,E]
    if (type === PLACEMENT) {
      let newDOM = createDOM(newVChild); //根据虚拟DOM创建真实DOM
      let childDOMNode = childNodes[toIndex]; //找一下目标索引现在对应的真实DOM元素
      if (childDOMNode) {
        //如果此位置 上已经 有DOM元素的，插入到它前面是
        parentDOM.insertBefore(newDOM, childDOMNode);
      } else {
        parentDOM.appendChild(newDOM); //添加到最后就可以了
      }
    } else if (type === MOVE) {
      let oldDOM = findDOM(oldVChild); //找到老的真实DOM 还可以把内存中的B取到，插入到指定的位置 B
      let childDOMNode = childNodes[toIndex]; //找一下目标索引现在对应的真实DOM元素
      if (childDOMNode) {
        //如果此位置 上已经 有DOM元素的，插入到它前面是
        parentDOM.insertBefore(oldDOM, childDOMNode);
      } else {
        parentDOM.appendChild(oldDOM); //添加到最后就可以了
      }
    }
  });

  // let maxChildrenLength = Math.max(oldVChildren.length, newVChildren.length);
  // //oldChildren=3 newChildren=2   oldChildren=2 newChildren=3
  // for (let i = 0; i < maxChildrenLength; i++) {
  //     //试图取出当前的节点的下一个，最近的弟弟真实DOM节点
  //     let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item));
  //     compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], findDOM(nextVdom));
  // }
}
function unMountVdom(vdom) {
  let { props, ref } = vdom;
  let currentDOM = findDOM(vdom); //获取此虚拟DOM对应的真实DOM
  //vdom可能是原生组件span 类组件 classComponent 也可能是函数组件Function
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();
  }
  if (ref) {
    ref.current = null;
  }
  //取消监听函数
  Object.keys(props).forEach((propName) => {
    //如果你是把事件监听绑定在真实DOM上
    if (propName.slice(0, 2) === "on") {
      if (currentDOM) delete currentDOM._store;
      /*  
            const eventName = propName.slice(2).toLowerCase();//onClick  click
             currentDOM.removeEventListener(eventName, props[propName]); */
    }
    //我们现在用了合成事件
  });
  //如果此虚拟DOM有子节点的话，递归全部删除
  if (props.children) {
    //得到儿子的数组
    let children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    children.forEach(unMountVdom);
  }
  //把自己这个虚拟DOM对应的真实DOM从界面删除
  if (currentDOM) currentDOM.parentNode.removeChild(currentDOM);
}
const ReactDom = {
  render,
  createPortal: render,
};
export default ReactDom;
