import React, { useState } from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import testComputeShader from './shaders/testComputeShader.wgsl';

import CodeEditor from "./features/CodeEditor";
import { getUserFilesDB } from "./services/UserFiles";


const dbLoadingProm = getUserFilesDB();
let hasLoaded = false;

const App = () => {
  const [userFilesDb, setUserFilesDb] = useState<LocalForage | null>(null);
  const [filenames, setFilenames] = useState<string[]>([]);
  
  dbLoadingProm.then((db) => {
    if (hasLoaded) return;

    console.log('userDB loaded', db);
    setUserFilesDb(db);
    db.keys().then((keys) => {
      setFilenames(keys);
    });
    
    hasLoaded = true;
  });

  const saveUserFile = (filename: string, filecontent: string, filetype: string) => {
    dbLoadingProm.then((db) => {
      db.setItem(filename, {
        type: filetype,
        content: filecontent,
        lastModified: Date.now(),
      }).catch((err) => {
        console.error(err);
      });
    })
  };

  return (<>
    <CodeEditor
      saveUserFile={saveUserFile}
      filenames={filenames}
    />
    <canvas id="canvas"></canvas>
  </>);
};


ReactDOM.render(
  <App />,
  document.getElementById('root')  
);