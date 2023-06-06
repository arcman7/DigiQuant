import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import testComputeShader from './shaders/testComputeShader.wgsl';

import CodeEditor from "./features/CodeEditor";
// const App = (props: { message: string }) => {
//   const [count, setCount] = useState(0);
//   const increment = useCallback(() => {
//     setCount(count => count + 1);
//   }, [count]);
//   return(<>
//     <h1>{props.message}</h1>
//     <h2>Count: {count}</h2>
//     <button onClick={increment}>Increment</button>
//   </>)
// };
const App = (props: { message: string }) => {
  return(<>
    <CodeEditor></CodeEditor>
    <canvas id="canvas"></canvas>
  </>)
};


ReactDOM.render(
  <App message="Simple Counter App built on ESBuild + React + Typescript"/>,
  document.getElementById('root')  
);