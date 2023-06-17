import { useState } from "react";
import styled from "styled-components";

import { UserDatasetMeta } from "../services/UserDatasets";
import { bytesToSize } from "../helpers/fileReader";
import { debounce } from "../helpers/dataIngestion";

const MyDatasetsContainer = styled.table``;
const UnprocessedDivder = styled.thead`
  color: #512ed1;
  font-size: 1.5em;
  width: 100%;
  padding-left: 10px;
`;
const NoBorderInput = styled.input`
  border: none;
  outline: none;
  border-bottom: 1px solid #ccc;
  margin: 0;
`;

export type MyDatasetsProps = {
  userDatasetMetas: UserDatasetMeta[];
  updateUserDatasetMeta: (meta: UserDatasetMeta) => void;
};

const MyDatasets = ({
  userDatasetMetas,
  updateUserDatasetMeta,
}: MyDatasetsProps) => {
  const handleInputChange = debounce(
    (datasetName: string, meta: UserDatasetMeta) => {
      meta.datasetName = datasetName;
      updateUserDatasetMeta(meta);
    }
  );

  const renderTableRow = (meta: UserDatasetMeta, i: number) => {
    const [inputValue, setInputValue] = useState<string>(meta.datasetName);
    return (
      <tr key={i}>
        <td>
          <NoBorderInput
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleInputChange(e.target.value, meta);
            }}
          />
        </td>
        <td>{bytesToSize(meta.size)}</td>
        <td>{meta.extension}</td>
        <td>{meta.lastModified}</td>
      </tr>
    );
  };

  return (
    <MyDatasetsContainer className="table">
      <UnprocessedDivder>Text based (Unprocessed)</UnprocessedDivder>
      <thead>
        <tr>
          <th scope="col">Dataset Name</th>
          <th scope="col">Size</th>
          <th scope="col">Extension</th>
          <th scope="col">Last Modified</th>
        </tr>
      </thead>
      <tbody>
        {userDatasetMetas.map((meta, i) => {
          return renderTableRow(meta, i);
        })}
      </tbody>
    </MyDatasetsContainer>
  );
};

export default MyDatasets;
