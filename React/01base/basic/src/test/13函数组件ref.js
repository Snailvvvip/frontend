import React from './react';
import ReactDOM from './react-dom';
// class TextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputRef = React.createRef();
//   }
//   getFocus = () => {
//     this.inputRef.current.focus();
//   }
//   render() {
//     return <input ref={ this.inputRef } />
//   }
// }

function TextInput(props, forwardRef) {
  return <input ref={ forwardRef }/>
}
const ForwardedTextInput = React.forwardRef(TextInput);

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  getFocus = () => {
    this.inputRef.current.focus();
  }
  render() {
    console.log(<h1></h1>)
    return (
      <div>
        <ForwardedTextInput ref={this.inputRef} />
        <button onClick={ this.getFocus }>输入框获得焦点</button>
      </div>
    )
  }
}
ReactDOM.render(
  <Form />, document.getElementById('root')
);
