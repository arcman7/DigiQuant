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
import {
  UserDataset,
  UserDatasetMeta,
  getUserDataset,
  getUserDatasetMeta,
  getUserDatasetsDB,
  saveUserDataset,
} from "./services/UserDatasets";
import { getFileExtension } from "./helpers/FileReader";

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
  const [datasetMetas, setDatasetMeta] = useState<UserDatasetMeta[]>([]);
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
      /* TODO: Clean up this mess */
      const datasetMetaKeys = keys.filter((key) => key.slice(-5) === "_meta");
      Promise.all(
        datasetMetaKeys.map((key) => getUserDatasetMeta(db, key))
      ).then((datasetMetas: (UserDatasetMeta | null)[]) => {
        const updatedDatasets: UserDatasetMeta[] = [];
        datasetMetas.forEach((dataset) => {
          if (dataset === null) return;
          updatedDatasets.push(dataset);
        });
        setDatasetMeta(updatedDatasets);
      });
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
    datasetName: string,
    dataset: string | File,
    filetype: "text" | "binary"
  ) => {
    return userDatasetsDBLoadingProm.then((db) => {
      return saveUserDataset(db, datasetName, {
        filetype,
        extension: getFileExtension(datasetName),
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

  const getUserDatasetMetaQueued = (
    datasetName: string
  ): Promise<UserDatasetMeta | null> => {
    return userDatasetsDBLoadingProm.then((db) => {
      return getUserDatasetMeta(db, datasetName);
    });
  };

  const getUserDatasetQueued = (
    datasetMeta: UserDatasetMeta
  ): Promise<File | string | null> => {
    return userDatasetsDBLoadingProm.then((db) => {
      return getUserDataset(db, datasetMeta);
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
        <DataAndFilesManager
          saveUserDataset={saveUserDatasetQueued}
          getUserDataset={getUserDatasetQueued}
          getUserDatasetMeta={getUserDatasetMetaQueued}
          datasetMetas={datasetMetas}
          currentDatasetIndex={currentDatasetIndex}
          setCurrentDatasetIndex={setCurrentDatasetIndex}
        />
        {/* <canvas id="canvas"></canvas> */}
      </AppContainer>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
