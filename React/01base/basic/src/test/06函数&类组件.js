import React from './react';
import ReactDOM from './react-dom';

/**
 * 可以通过函数定义组件
 * 函数组件其实就是一个接收属性对象并返回一个React元素的函数
 * 组件名称必须以大写字母开头,原生组件 span h1 是以小写字母开头的，自定义组件是以大写字母开头的
 * 组件必须先定义再使用
 * 组件必须返回唯一的根元素，并且只能返回一个唯一的根元素 JSX expressions must have one parent element
 * 组件返回的可能是一个原生的组件元素，也可以是另外一个函数组件的元素
 * 组件可以接收属性对象，用来计算返回的元素  vue {{msg}} 如果想取变量的值显示在此处，就可以使用 {}
 * @param {*} props 
 * @returns 
 */
function FunctiionComponent(props) {
  return <h1>{ props.title } | FunctiionComponent</h1>;
}
// function FunctiionComponent(props) {
  // let element = React.createElement("h1", {
  //   className: "title",
  //   style: {
  //     color: 'red'
  //   }
  // }, "hello", React.createElement("span", null, "world"));
  // return <h1>{ props.title }</h1>
  // return <FunctiionComponent2 title={ props.title + 'FunctiionComponent' }/>;
// }

/**
 * 也可以通过类定义组件
 * 类组件的渲染是先通过属性对象创建类组件的实例，调用实例的render方法返回一个React元素
 */
class ClassComponent extends React.Component {
  constructor(props) {
    super(props); // this.props = props
  }
  render() {
  return <FunctiionComponent title={ this.props.title + '| ClassComponent' }/>;
    // return <h1>{ this.props.title }</h1>
  }
}
// let element = <FunctiionComponent title={'标题'} />
let element = React.createElement(ClassComponent, {title: '标题'})

ReactDOM.render(
  element, document.getElementById('root')
);

