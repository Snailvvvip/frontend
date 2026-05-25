import React from './react';
import ReactDOM from './react-dom';


function Counter() {
  console.log('Counter render');
  const [number, setNumber] = React.useState(0);

  // useEffect里的函数会在当前的组件渲染到页面之后执行
  React.useEffect(() => {
    console.log('开启定时器');
    const timer = setInterval(() => {
      console.log('执行定时器');
      setNumber(number => number + 1);
    }, 1000)
    return () => {
      console.log('销毁定时器');
      clearInterval(timer);
    }
  })
  // Counter render
  // 开启定时器
  // 执行定时器
  // Counter render
  // 销毁定时器
  // 开启定时器
  // 执行定时器
  return (
    <div>{ number }</div>
  )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
/***
 * 这是最难用好的一个effect
 * 每次渲染都会开启一个新的定时器
 * 1.加上依赖空数组 定时器只会执行一次
 * 2.可在在下一次执行effect的这前清除上一个定时器
 * 
 * Counter渲染完成
 * 开启定时器
 * 1s 执行定时器  setNumber更新组件
 * Counter渲染
 * 先执行上一次的销毁函数 
 * 销毁定时器
 * 开启定时器
 */
  
  
/**
Counter render
开启定时器
执行定时器
Counter render
销毁定时器
开启定时器
执行定时器
*/


 