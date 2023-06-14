import { useState, useEffect } from "react";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

import DragAndDrop from "./DragAndDrop";
import SaveDatasetForm from "./SaveDatasetForm";
import { UserDataset } from "../services/UserDatasets";

const DataAndFilesContainer = styled.div`
  display: flex;
  width: 40vw;
  height: 90vh;
  flex-direction: column;
  align-items: stretch;
  //border-right: 1px solid #808080;

  /*
  * Created with https://www.css-gradient.com
  * Gradient link: https://www.css-gradient.com/?c1=b6a7e8&c2=93c0ed&gt=l&gd=dtl
  */
  background: #b6a7e8;
  background: linear-gradient(135deg, #b6a7e8, #93c0ed);
`;

const Menubar = styled.menu`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-direction: row;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #800000;
  max-height: 75px;
  min-height: 75px;
  background: #b6a7e8;
  background: linear-gradient(135deg, #b6a7e8, #93c0ed);
`;

const MenuChoice = styled(Dropdown)`
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  align-content: center;
  padding: 0;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 1.5em;
  border-right: 1px solid #800000;
  user-select: none;
  &:hover {
    background-color: rgba(118, 184, 253, 0.55);
    cursor: pointer;
  }
  &.active {
    border-bottom: 4px solid rgba(39, 88, 245, 0.8);
  }
`;

type DataAndFilesManagerProps = {
  saveUserDataset: (
    filename: string,
    dataset: File | string,
    filetype: string
  ) => Promise<void>;
  getUserDataset: (filename: string) => Promise<UserDataset | null>;
  datasetNames: string[];
  currentDatasetIndex: number;
  setCurrentDatasetIndex: (index: number) => void;
};

const DataAndFilesManager = ({
  saveUserDataset,
  getUserDataset,
  datasetNames,
  currentDatasetIndex,
  setCurrentDatasetIndex,
}: DataAndFilesManagerProps) => {
  const [selectedMenuChoice, setSelectedMenuChoice] = useState<number>(0);
  const [processingUpload, setProcessingUpload] = useState<boolean>(false);
  const [showSaveDatasetModal, setShowSaveDatasetModal] =
    useState<boolean>(false);
  const [fileBeingUploaded, setFileBeingUploaded] = useState<File | null>(null);

  const menuChoices = ["Upload", "Public Datasets", "My Datasets"];
  const defaultPreviewText = "Data and Files";

  const renderMenuChoice = (choice: string, index: number) => {
    const menuChoiceClick = () => {
      console.log("menuChoiceClick");
      setSelectedMenuChoice(index);
    };
    return (
      <MenuChoice
        className={selectedMenuChoice === index ? "active" : ""}
        key={index}
        onClick={menuChoiceClick}
      >
        {choice}
      </MenuChoice>
    );
  };

  const renderedView = (() => {
    switch (selectedMenuChoice) {
      case 0:
        return (
          <DragAndDrop
            onDrop={(files: File[]) => {
              if (files.length === 0) {
                console.log("No files dropped.");
                return;
              }
              setFileBeingUploaded(files[0]);
              setProcessingUpload(true);
              setShowSaveDatasetModal(true);

            }}
          >
            Files and Data
            <SaveDatasetForm
              file={fileBeingUploaded}
              handleClose={() => {
                setShowSaveDatasetModal(false);
                setProcessingUpload(false);
              }}
              handleSubmit={() => {}}
              show={showSaveDatasetModal}
            />
          </DragAndDrop>
        );
      case 1:
        return <div>{menuChoices[selectedMenuChoice]}</div>;
      case 2:
        return <div>{menuChoices[selectedMenuChoice]}</div>;
      default:
    }
  })();

  return (
    <DataAndFilesContainer id="data-and-files-manager">
      {/* {children} */}
      <Menubar>{menuChoices.map(renderMenuChoice)}</Menubar>
      {renderedView}
    </DataAndFilesContainer>
  );
};

export default DataAndFilesManager;
