import localforage from "localforage";

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

export type UserDataset = {
  filetype: "text" | "binary";
  extension: string;
  dataset: string | File;
  lastModified: number;
};

export type UserDatasetMeta = {
  filepath: string;
  filetype: "text" | "binary";
  size: number;
  datasetName: string;
  extension: string;
  lastModified: number;
};

export async function saveUserDataset(
  db: LocalForage,
  datasetName: string,
  userDataset: UserDataset
): Promise<void> {
  const filepath = `raw/${datasetName}`;
  await db.setItem(filepath, userDataset.dataset);
  const { extension, filetype, lastModified } = userDataset;

  let size = 0;
  if (userDataset.dataset instanceof File) {
    size = userDataset.dataset.size;
  } else {
    size = userDataset.dataset.length;
  }

  const metadata: UserDatasetMeta = {
    extension,
    filetype,
    lastModified,
    filepath,
    datasetName,
    size,
  };

  await db.setItem(`${filepath}_meta`, metadata);
}
export async function getUserDataset(
  db: LocalForage,
  meta: UserDatasetMeta
): Promise<File | string | null> {
  return await db.getItem(meta.filepath);
}

export async function getUserDatasetMeta(
  db: LocalForage,
  filepath: string
): Promise<UserDatasetMeta | null> {
  return await db.getItem(filepath);
}
