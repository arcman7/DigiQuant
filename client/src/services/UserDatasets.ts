import localforage from "localforage";

export async function getUserFilesDB(): Promise<LocalForage> {
  localforage.config({
    driver: localforage.INDEXEDDB,
    name: "user_datasets",
    storeName: "user_datasets", // Should be alphanumeric, with underscores.
    description: "All datasets uploaded or saved by the user",
  });
  await localforage.ready();
  return localforage;
}