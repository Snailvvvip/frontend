import React from './react';
import ReactDOM from './react-dom';


function Counter() {
  const [number1, setNumber1] = React.useState(0);
  const [number2, setNumber2] = React.useState(10);
  let handleClick = () => {
    setNumber1(number1 + 1);
    setNumber2(number2 + 1);
  }
  return (
    <div>
      <p>{ number1 }</p>
      <p>{number2}</p>
      <button onClick={ handleClick }>+</button>
    </div>
  )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
