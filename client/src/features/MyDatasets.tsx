import styled from "styled-components";

import { UserDatasetMeta } from "../services/UserDatasets";
import { bytesToSize } from "../helpers/FileReader";

const MyDatasetsContainer = styled.table`

`;

export type MyDatasetsProps = {
  datasetMetas: UserDatasetMeta[];
};

const MyDatasets = ({ datasetMetas = [] }: MyDatasetsProps) => {
  const renderTableRow = (datasetMeta: UserDatasetMeta) => {
    return (
      <tr>
        <td>{datasetMeta.datasetName}</td>
        <td>{bytesToSize(datasetMeta.size)}</td>
        <td>{datasetMeta.extension}</td>
        <td>{datasetMeta.lastModified}</td>
      </tr>
    );
  }

  return (
    <MyDatasetsContainer className="table">
      <thead>
        <tr>
          <th scope="col">Dataset Name</th>
          <th scope="col">Size</th>
          <th scope="col">Extension</th>
          <th scope="col">Last Modified</th>
        </tr>
      </thead>
      <tbody>
        {datasetMetas.map((datasetMeta) => {
          return renderTableRow(datasetMeta);
        })}
      </tbody>
    </MyDatasetsContainer>
  )
};

export default MyDatasets;