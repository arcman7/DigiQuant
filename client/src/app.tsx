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
import { UserDataset, getUserDataset, getUserDatasetsDB, saveUserDataset } from "./services/UserDatasets";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const userFilesDBLoadingProm = getUserFilesDB();
let userFilesDBhasLoaded = false;

const userDatasetsDBLoadingProm = getUserDatasetsDB();
let userDatasetsDBhasLoaded = false;

const App = () => {
  const [_, setUserFilesDb] = useState<LocalForage | null>(null);
  const [filenames, setFilenames] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

  const [__, setUserDatasetsDb] = useState<LocalForage | null>(null);
  const [datasetNames, setDatasetNames] = useState<string[]>([]);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState<number>(0);


  userFilesDBLoadingProm.then((db) => {
    if (userFilesDBhasLoaded) return;

    console.log("userFilesDB loaded", db);
    setUserFilesDb(db);
    db.keys().then((keys) => {
      setFilenames(keys);
    });

    userFilesDBhasLoaded = true;
  });

  userDatasetsDBLoadingProm.then((db) => {
    if (userDatasetsDBhasLoaded) return;

    console.log("userDatasetsDB loaded", db);
    setUserDatasetsDb(db);
    db.keys().then((keys) => {
      setDatasetNames(keys);
    });

    userDatasetsDBhasLoaded = true;
  });

  const saveUserFileQueued = (
    filename: string,
    filecontent: string,
    filetype: string
  ) => {
    return userFilesDBLoadingProm.then((db) => {
      return saveUserFile(db, filename, {
        type: filetype,
        content: filecontent,
        lastModified: Date.now(),
      }).catch((err) => {
        console.error(err);
      });
    });
  };

  const saveUserDatasetQueued = (
    filename: string,
    dataset: string | File,
    filetype: string,
  ) => {
    return userDatasetsDBLoadingProm.then((db) => {
      return saveUserDataset(db, filename, {
        filetype,
        dataset,
        lastModified: Date.now(),
      }).catch((err) => {
        console.error(err);
      });
    });
  };

  const getUserFileQueued = (filename: string): Promise<UserFile | null> => {
    return userFilesDBLoadingProm.then((db) => {
      return getUserFile(db, filename);
    });
  };

  const getUserDatasetQueued = (datasetName: string): Promise<UserDataset | null> => {
    return userDatasetsDBLoadingProm.then((db) => {
      return getUserDataset(db, datasetName);
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
        <DataAndFilesManager saveUserDataset={saveUserDatasetQueued} getUserDataset={getUserDatasetQueued} datasetNames={datasetNames}
        currentDatasetIndex={currentDatasetIndex} setCurrentDatasetIndex={setCurrentDatasetIndex}
        />
        {/* <canvas id="canvas"></canvas> */}
      </AppContainer>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
