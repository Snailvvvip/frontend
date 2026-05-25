import React from './react';
import ReactDOM from './react-dom';
class Counter extends React.Component {
  //1.设置默认属性和初始状态 
  static defaultProps = {
    name: 'zq'
  }
  constructor(props) {
    super(props);
    this.state = { number: 0 };//设置默认状态
    console.log('Counter 1.constructor');
  }
  componentWillMount() {
    console.log('Counter 2.componentWillMount');
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 });
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate');
    //奇数不更新，偶数更新
    return nextState.number % 2 === 0;
  }
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate');
  }
  render() {
    console.log('Counter 3.render');
    return (
      <div>
        <p>{this.state.number}</p>
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
  
}

class ChildCounter extends React.Component {
  state = { number: 0}
  static getDerivedStateFromProps(nextProps, prevState) {
    const { count } = nextProps;
    if (count % 2 === 0) {
      return { number: count * 2 };
    } else if (count % 3 === 0) {
      return { number: count * 3 };
    } else {
      return null; // 不改状态
    }
  }
  render() {
    console.log('ChildCounter 2.render');
    return (
      <div>
        { this.state.number }
      </div>
    )
  }
}

ReactDOM.render(
  <Counter />, document.getElementById('root')
);