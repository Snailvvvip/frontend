import React from './react';
import ReactDOM from './react-dom';
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  getFocus = () => {
    this.inputRef.current.focus();
  }
  render() {
    return <input ref={ this.inputRef } />
  }
}
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  getFocus = () => {
    // 如果给一个类组件添加了ref属性，那么ref.current会指向类组件的实例
    this.inputRef.current.getFocus();
  }
  render() {
    //如果给一个原生组件添加了一个ref属性，那么当此原生虚拟DOM组件变成真实的DOM之后，会把真实的DOM元素赋给this.aRef.current
    return (
      <div>
        <TextInput ref={this.inputRef} />
        <button onClick={ this.getFocus }>输入框获得焦点</button>
      </div>
    )
  }
}
ReactDOM.render(
  <Form />, document.getElementById('root')
);
