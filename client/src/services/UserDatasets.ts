import localforage from "localforage";

export async function getUserDatasetsDB(): Promise<LocalForage> {
  localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: "user_datasets",
    storeName: "user_datasets", // Should be alphanumeric, with underscores.
    description: "All datasets uploaded or saved by the user",
  });
  await localforage.ready();
  return localforage;
}

export type UserDataset = {
  filetype: string;
  extension: string;
  dataset: string | File;
  lastModified: number;
};

export async function saveUserDataset(
  db: LocalForage,
  filepath: string,
  dataset: UserDataset,
): Promise<void> {
  await db.setItem(filepath, dataset);
}

export async function getUserDataset(
  db: LocalForage,
  filepath: string,
): Promise<UserDataset | null> {
  return await db.getItem(filepath);
}