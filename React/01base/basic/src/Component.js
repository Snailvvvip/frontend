
import { findDOM, compareTwoVdom } from './react-dom';
// 更新队列
export let updateQueue = {
  isBatchingUpdate: false, // 来控制更新是同步还是异步的,默认值是非批量的，即同步的
  updaters: [], // 更新器的数组
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.updaters.length = 0;
    updateQueue.isBatchingUpdate = false;
  }
}
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []; // 等待生效的数组
    // this.callbacks = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();// 触发更新
  }
  // 发射更新，状态和属性变化都可能会执行这个方法
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // 有可能是批量异步更新，也有可能是同步更新
    if (updateQueue.isBatchingUpdate) { // 批量异步更新
      updateQueue.updaters.push(this); // 不刷新组件试图了，只是把自己这个updater实例添加到updateQueue等待生效，this即是Updater类的实例
    } else { // 同步直接更新
      this.updateComponent();
    }
  }
  updateComponent() {
    const { classInstance, nextProps, pendingStates } = this;
    // 如果属性变了或者状态变了都会进入更新逻辑
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState())
    }
  }
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance; // {number: 0} 老状态
    pendingStates.forEach(partialState => { // 每个分状态
      if (typeof partialState === 'function') {
        partialState = partialState(state); // state的值是每次计算后的新值，传新的State给回调函数partialState
      }
      state = {...state, ...partialState }
    });
    pendingStates.length = 0; // 清空等待生效的状态 的数组
    return state;
  }

}
/**
 * 
 * @param {*} classInstance 类的实例
 * @param {*} nextProps 新的属性对象
 * @param {*} nextState 新的状态对象
 */
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; // 表示组件是否更新
  // 如果有shouldComponentUpdate方法并且shouldComponentUpdate方法返回了false
  if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false; // 表示不需要更新
  }
  // 如果要更新，并且有componentWillUpdate方法，就执行它
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  // 不管要不要更新组件，状态都要更新
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState;
  if (willUpdate) {
    classInstance.forceUpdate(); // 强制更新
  }
  // classInstance.state = nextState; // 先把心状体赋值给实例的state
  // classInstance.forceUpdate(); // 强制更新
}
class Component {
  static isReactComponent = true; // 当子类继承父类的时候，父类的静态属性也是可以继承的
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  // 根据新的属性状态 计算新的要渲染的虚拟Dom
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom; // 上一次类组件render方法计算得到的虚拟DOM(oldRenderVdom是在mountClassComponent函数中添加的)
    let oldDOM = findDOM(oldRenderVdom); // 获取oldRenderVdom对应的真实DOM
    if(this.constructor.contextType){
        this.context = this.constructor.contextType._currentValue;
    }
    if (this.constructor.getDerivedStateFromProps) { // this是实例，constructor指向构造函数即类
      let newState = this.constructor.getDerivedStateFromProps(this.props, this.state);
      if (newState) this.state = newState;
    }
    let snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
    //然后基于新的属性和状态，计算新的虚拟DOM
    let newRenderVdom = this.render();
    // // 根据新的虚拟DOM得到新的真实DOM
    // let newDOM = createDOM(newRenderVdom);
    // // 把老的真实DOM替换为新的真实DOM
    // oldDOM.parentNode.replaceChild(newDOM, oldDOM);
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot);
    }
  }
}


export default Component;