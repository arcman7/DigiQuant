import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import testComputeShader from './shaders/testComputeShader.wgsl';

import CodeEditor from "./features/CodeEditor";

const App = () => {
  return (<>
    <CodeEditor></CodeEditor>
    <canvas id="canvas"></canvas>
  </>);
};


ReactDOM.render(
  <App />,
  document.getElementById('root')  
);