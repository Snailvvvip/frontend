import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    // 只有在构造函数中才直接给this.state赋值
    this.state = {
      number: 0,
      age: 10
    }
  }

  handleClick = event => {
    // updateQueue.isBatchingUpdate = true // 批量异步更新

    // 可通过setState修改状态，每次修改后，组件会重新刷新
    // seState参数是新的状态对象，这个新的状态对象会合并到老状态对象上。
    // 老状态没有的属性会添加，老状态有的属性会被覆盖
    // state状态的更新是批量的，是异步执行的
    // this.setState(state => ({ number: state.number + 1 })); // 第一个参数是函数也是异步更新的
    this.setState({ number: this.state.number + 1 }); 
    console.log(this.state);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    setTimeout(() => { // 在setTimeout是同步更新的
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
    })
    // Promise.resolve().then(() => {
    //   this.setState({ number: this.state.number + 1 });
    //   console.log(this.state);
    //   this.setState({ number: this.state.number + 1 });
    //   console.log(this.state);
    // })
    // this.setState({
    //   number: this.state.number + 1
    // })
    // console.log(this.state);

    // Cannot assign to read only property 'title' of object 'this.props'
    // this.props.title = '新标题';

    // 如果你直接修改state的话，this.state的确改变了，但是组件并没有刷新，页面也没有更新，视图不更新。
    // this.state.number += 1;
    // console.log(this.state);
    // updateQueue.batchUpdate(); // 批量异步更新
  }
  handleClickWrap = () => {
    console.log('handleClickWrap')
  }
  render() {
    return (
      <div onClick={ this.handleClickWrap}>
        <p>{ this.props.title }</p>
        <p>number: {this.state.number}</p>
        <p>age: {this.state.age}</p>
        <button onClick={ this.handleClick }>+</button>
      </div>
    )
  }

}

ReactDOM.render(<Counter title='老标题' />, document.getElementById('root'));