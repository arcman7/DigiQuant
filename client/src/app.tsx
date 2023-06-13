import React, { useState } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import testComputeShader from "./shaders/testComputeShader.wgsl";

import CodeEditor from "./features/CodeEditor";
import DataAndFilesManager from "./features/DataAndFiles";
import {
  UserFile,
  getUserFile,
  getUserFilesDB,
  saveUserFile,
} from "./services/UserFiles";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const dbLoadingProm = getUserFilesDB();
let hasLoaded = false;

const App = () => {
  const [userFilesDb, setUserFilesDb] = useState<LocalForage | null>(null);
  const [filenames, setFilenames] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

  dbLoadingProm.then((db) => {
    if (hasLoaded) return;

    console.log("userDB loaded", db);
    setUserFilesDb(db);
    db.keys().then((keys) => {
      setFilenames(keys);
    });

    hasLoaded = true;
  });

  const saveUserFileQueued = (
    filename: string,
    filecontent: string,
    filetype: string
  ) => {
    dbLoadingProm.then((db) => {
      return saveUserFile(db, filename, {
        type: filetype,
        content: filecontent,
        lastModified: Date.now(),
      }).catch((err) => {
        console.error(err);
      });
    });
  };

  const getUserFileQueued = (filename: string): Promise<UserFile | null> => {
    return dbLoadingProm.then((db) => {
      return getUserFile(db, filename);
    });
  };

  return (
    <>
      <AppContainer>
        <CodeEditor
          saveUserFile={saveUserFileQueued}
          getUserFile={getUserFileQueued}
          filenames={filenames}
          currentFileIndex={currentFileIndex}
          setCurrentFileIndex={setCurrentFileIndex}
        />
        <DataAndFilesManager />
        {/* <canvas id="canvas"></canvas> */}
      </AppContainer>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
