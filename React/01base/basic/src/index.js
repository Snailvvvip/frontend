import React from './react';
import ReactDOM from './react-dom';

function Child(props, forwardRef) {
  // return <input ref={ forwardRef }/>
  const inputRef = React.useRef();
  //这个方法可以定制暴露给父组件ref值 forwardRef.current = {focus},只暴露给父组件focus
  React.useImperativeHandle(forwardRef, () => {
    return {
      focus() {
        inputRef.current.focus();
      }
    }
  });
  return <input ref={inputRef}/>
}
const ForwaredChild = React.forwardRef(Child);

function Parent () {
  // let [number, setNumber] = React.useState(0);
  const inputRef = React.useRef();
  const getFocus = () => {
    inputRef.current.focus();
    // 如果子组件的把自己的内部的真实DOM完整暴露给父组件的，父组件可以对此DOM元素进行任何操作
    // inputRef.current.remove();
    // inputRef.current.value = 'xx';
  }
  return (
    <div>
      <ForwaredChild ref={inputRef}/>
      <button onClick={getFocus}>获得焦点</button>
    </div>
  )
}

ReactDOM.render(<Parent/>, document.getElementById('root'));
