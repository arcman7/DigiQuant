import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

import DragAndDrop from "./DragAndDrop";

import type { UserFile } from "../services/UserFiles";

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

const DataHeaderSpan = styled.span`
  display: flex;
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
  border-right: 1px solid #808080;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  align-items: center;
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

// type MenuChoiceProps = {
//   onClick?: () => void;
// };

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
  &:hover {
    background-color: rgba(118, 184, 253, 0.55);
    cursor: pointer;
  }
  border-right: 1px solid #800000;
`;

const DataAndFilesManager = (
  {
    //children
  }
) => {
  const [selectedMenuChoice, setSelectedMenuChoice] = useState<number>(0);
  const renderMenuChoice = (choice: string, index: number) => {
    const menuChoiceClick = () => {
      console.log("menuChoiceClick");
      setSelectedMenuChoice(index);
    };
    return (
      <MenuChoice key={index} onClick={menuChoiceClick}>
        {choice}
      </MenuChoice>
    );
  };

  const renderedView = (() => {
    switch (selectedMenuChoice) {
      case 0:
        return <DragAndDrop>Data and Files</DragAndDrop>;
      case 1:
        return <div>Public Datasets</div>;
      default:
    }
  })();

  return (
    <DataAndFilesContainer id="data-and-files-manager">
      {/* {children} */}
      <Menubar>
        {/* <MenuChoice>Upload </MenuChoice>
        <MenuChoice>Public Datasets </MenuChoice> */}
        {["Upload", "Public Datasets"].map(renderMenuChoice)}
      </Menubar>
      {/* <DataHeaderSpan>Data and Files</DataHeaderSpan> */}
      {renderedView}
    </DataAndFilesContainer>
  );
};

export default DataAndFilesManager;
