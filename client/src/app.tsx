import React, { useState } from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import testComputeShader from './shaders/testComputeShader.wgsl';

import CodeEditor from "./features/CodeEditor";
import { UserFile, getUserFile, getUserFilesDB, saveUserFile } from "./services/UserFiles";


const dbLoadingProm = getUserFilesDB();
let hasLoaded = false;

const App = () => {
  const [userFilesDb, setUserFilesDb] = useState<LocalForage | null>(null);
  const [filenames, setFilenames] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  
  dbLoadingProm.then((db) => {
    if (hasLoaded) return;

    console.log('userDB loaded', db);
    setUserFilesDb(db);
    db.keys().then((keys) => {
      setFilenames(keys);
    });
    
    hasLoaded = true;
  });

  const saveUserFileQueued = (filename: string, filecontent: string, filetype: string) => {
    dbLoadingProm.then((db) => {
      return saveUserFile(db, filename, 
        {
          type: filetype,
          content: filecontent,
          lastModified: Date.now(),
        }
      ).catch((err) => {
        console.error(err);
      });
    })
  };

  const getUserFileQueued = (filename: string): Promise<UserFile | null> => {
    return dbLoadingProm.then((db) => {
      return getUserFile(db, filename);
    });
  };

  return (<>
    <CodeEditor
      saveUserFile={saveUserFileQueued}
      getUserFile={getUserFileQueued}
      filenames={filenames}
      currentFileIndex={currentFileIndex}
      setCurrentFileIndex={setCurrentFileIndex}
    />
    <canvas id="canvas"></canvas>
  </>);
};


ReactDOM.render(
  <App />,
  document.getElementById('root')  
);