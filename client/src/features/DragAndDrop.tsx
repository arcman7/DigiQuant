import React, { useEffect, useState } from "react";
import styled from "styled-components";

const DragTarget = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-around;
  font-size: 1.5em;
  font-weight: bold;
  &.drag-active {
    border: 3px dashed #808080;
    margin: 15px;
    border-shadow: 0 0 10px #808080;
  }
  border-shadow: none;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const CurrentMessageSpan = styled.span`
  display: flex;
  flex-grow: 2;
  justify-content: center;
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 10px;
  height: 50px;
  align-items: center;
  border-radius: 15px;
  opacity: 0.5;
  user-select: none;
  &.drag-active {
    border-shadow: 0 0 10px #808080;
  }
`;

const ChildrenSpan = styled.span`
  display: flex;
  justify-content: center;
  font-size: 1.1em;
  font-weight: normal;
  user-select: none;
  height: 50px;
  max-height: 50px;
  align-items: center;
`;
export type DragAndDropProps = {
  children: React.ReactNode;
  onDragMessage?: string;
  onUploadingMessage?: string;
  onProcessingMessage?: string;
  onDoneMessage?: string;
  idleMessage?: string;
};

type DRAG_STATES = 0 | 1 | 2 | 3 | 4;
const STATE_IDLE: DRAG_STATES = 0;
const STATE_DRAG_ENTER: DRAG_STATES = 1;
const STATE_DRAG_OVER: DRAG_STATES = 2;
const STATE_DRAG_LEAVE: DRAG_STATES = 3;
const STATE_DRAG_DROP: DRAG_STATES = 4;
const STATE_DRAG_UPLOADING: DRAG_STATES = 5;
const STATE_DRAG_PROCESSING: DRAG_STATES = 6;
const STATE_DRAG_DONE: DRAG_STATES = 7;

const getCurrentMessage = (
  currentState: DRAG_STATES,
  props: {
    idleMessage?: string;
    onDragMessage?: string;
    onUploadingMessage?: string;
    onProcessingMessage?: string;
    onDoneMessage?: string;
  }
) => {
  switch (currentState) {
    case STATE_IDLE:
      return props.idleMessage;
    case STATE_DRAG_ENTER:
    case STATE_DRAG_OVER:
      return props.onDragMessage;
    case STATE_DRAG_LEAVE:
      return props.idleMessage;
    case STATE_DRAG_DROP:
      return props.onUploadingMessage;
    case STATE_DRAG_UPLOADING:
      return props.onUploadingMessage;
    case STATE_DRAG_PROCESSING:
      return props.onProcessingMessage;
    case STATE_DRAG_DONE:
      return props.onDoneMessage;
    default:
      return props.idleMessage;
  }
};

const DragAndDrop = ({
  children,
  idleMessage = "Drag and drop files here.", //, or click to select files to upload.",
  onDragMessage = "Release the mouse to drop files now.",
  onUploadingMessage = "Uploading files...",
  onProcessingMessage = "Processing files...",
  onDoneMessage = "Done processing files.",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [dragOverState, setDragOverState] = useState(STATE_IDLE);
  const [currentMessage, setCurrentMessage] = useState(idleMessage);

  useEffect(() => {
    console.log("dragOverState", dragOverState);
    setCurrentMessage(
      getCurrentMessage(dragOverState, {
        idleMessage,
        onDragMessage,
        onUploadingMessage,
        onProcessingMessage,
        onDoneMessage,
      })
    );
  }, [dragOverState]);

  const dragEnter = (event: HTMLDragEvent) => {
    console.log("drag ENTER event");
    // Prevent the default action for the `drag` event
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
    if (dragOverState !== STATE_DRAG_OVER) {
      setDragOverState(STATE_DRAG_ENTER);

    }
  };
  const dragOver = (event: HTMLDragEvent) => {
    // Prevent the default action for the `dragover` event
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
    setDragOverState(STATE_DRAG_OVER);
  };

  const dragLeave = (event: HTMLDragEvent) => {
    console.log("drag LEAVE event");
    // Prevent the default action for the `drop` event
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    setDragOverState(STATE_DRAG_LEAVE);
  };

  const dragDrop = (event: HTMLDragEvent) => {
    console.log("drag DROP event", event.dataTransfer.files);
    // Prevent the default action for the `drop` event
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    setDragOverState(STATE_DRAG_DROP);
  };

  return (
    <DragTarget
      onDragEnter={dragEnter}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={dragDrop}
      className={`${dragActive ? "drag-active drop-zone" : "drop-zone"}`}
    >
      <ContentContainer>
        <ChildrenSpan>{children}</ChildrenSpan>
        <CurrentMessageSpan className={dragActive ? "drag-active" : ""}>
          {currentMessage}
        </CurrentMessageSpan>
      </ContentContainer>
    </DragTarget>
  );
};

export default DragAndDrop;
