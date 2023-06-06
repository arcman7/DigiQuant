import React from "react";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

const defaultExampleFunction = `
function foo(bar: number[] = [0,1,2,3,4,5,6]) {
  /*... your code here */
}
`;
const CodeEditor = () => {
  return (
    <div id="code-editor-container">
    <Editor
      height="80vh"
      width="50vw"
      defaultLanguage="typescript"
      theme="vs-dark"
      defaultValue={defaultExampleFunction}
    />
    </div>
  );
};  
export default CodeEditor;