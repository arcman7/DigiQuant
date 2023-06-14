import { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import { bytesToSize, readChunkAsText } from "../helpers/FileReader";
import { UserDataset } from "../services/UserDatasets";

// import { UserDataset } from "../services/UserDatasets";

const FileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
  border-bottom: 1px solid grey;
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const PreviewFileAsText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: scroll;
  font-size: 0.75em !important;
  margin-top: 10px;
`;

const SubFooter = styled.div`
  display: flex;
  justify-content: center;
`;

type SaveDatasetFormProps = {
  handleClose: () => void;
  saveUserDataset: (
    filepath: string,
    dataset: File | string,
    filetype: "text" | "binary"
  ) => Promise<void>;
  show: boolean;
  file: File | null;
};

const SaveDatasetForm = ({
  file,
  show,
  handleClose,
  saveUserDataset,
}: SaveDatasetFormProps) => {
  if (!file) return null;

  const [previewText, setPreviewText] = useState<string>("");

  readChunkAsText(file, 0, 2 * 1024).then((text) => {
    setPreviewText(text);
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <ModalTitle>Uploading Dataset...</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <FileInfoContainer>
          <div>
            <span>filename: </span>
            {file.name}
          </div>
          <div>
            <span>dataset size: </span>
            {bytesToSize(file.size)}
          </div>
        </FileInfoContainer>
        <PreviewFileAsText>
          {previewText.split("\n").map((lineOfText) => {
            return <div>{lineOfText}</div>;
          })}
        </PreviewFileAsText>
        <SubFooter> Preview file as text. </SubFooter>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          onClick={() => {
            saveUserDataset(
              file.name, file, 'text'
            );
          }}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
export default SaveDatasetForm;
