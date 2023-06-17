import localforage from "localforage";
import { sizeOfDataset } from "../helpers/dataIngestion";

export async function getUserDatasetsDB(): Promise<LocalForage> {
  await localforage.ready();
  // return localforage;
  return localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: "user_datasets",
    storeName: "user_datasets", // Should be alphanumeric, with underscores.
    description: "All datasets uploaded or saved by the user",
  });
}

export type UserDatasetInfo = {
  filetype: "text" | "binary";
  extension: string;
  dataset: string | File;
};

export type UserDatasetMeta = {
  filepath: string;
  filetype: "text" | "binary";
  size: number;
  datasetName: string;
  extension: string;
  lastModified: number;
};

export async function updateUserDatasetMeta(
  db: LocalForage,
  meta: UserDatasetMeta
): Promise<void> {
  meta.lastModified = Date.now();
  const metaFilepath = `${meta.filepath}_meta`;
  await db.setItem(metaFilepath, meta);
}

export async function saveUserDataset(
  db: LocalForage,
  datasetName: string,
  userDatasetInfo: UserDatasetInfo
): Promise<void> {
  const filepath = `raw/${datasetName}`;
  const dataSetFile = userDatasetInfo.dataset;

  await db.setItem(filepath, dataSetFile);

  const { extension, filetype } = userDatasetInfo;

  const metadata: UserDatasetMeta = {
    extension,
    filetype,
    filepath,
    datasetName,
    size: sizeOfDataset(dataSetFile),
    lastModified: Date.now(),
  };

  const metaFilepath = `${filepath}_meta`;

  await db.setItem(metaFilepath, metadata);
}

export async function getUserDatasetMeta(
  db: LocalForage,
  datasetName?: string,
  datasetMetaFilepath?: string
): Promise<UserDatasetMeta | null> {
  if (datasetMetaFilepath) {
    return await db.getItem(datasetMetaFilepath);
  }

  if (!datasetName) return null;

  const filepath = `raw/${datasetName}`;
  const metaFilepath = `${filepath}_meta`;
  return await db.getItem(metaFilepath);
}

export async function getUserDatasetMetas(
  db: LocalForage
): Promise<UserDatasetMeta[] | void> {
  const keys = await db.keys();
  const datasetMetaKeys = keys.filter((key) => key.slice(-5) === "_meta");
  const datasetMetas = await Promise.all(
    datasetMetaKeys.map((key) => getUserDatasetMeta(db, undefined, key))
  );
  return datasetMetas.filter((meta) => meta !== null) as UserDatasetMeta[];
  // return db.keys().then((keys) => {
  //   /* TODO: Clean up this mess */
  //   const datasetMetaKeys = keys.filter((key) => key.slice(-5) === "_meta");
  //   Promise.all(datasetMetaKeys.map((key) => getUserDatasetMeta(db, key)))
  //     .then((datasetMetas: (UserDatasetMeta | null)[]) => {
  //       const userDatasetMetas: UserDatasetMeta[] = [];
  //       datasetMetas.forEach((meta) => {
  //         if (meta === null) return;
  //         userDatasetMetas.push(meta);
  //       });
  //       return userDatasetMetas;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // });
}

export async function getUserDataset(
  db: LocalForage,
  meta: UserDatasetMeta
): Promise<File | string | null> {
  return await db.getItem(meta.filepath);
}
