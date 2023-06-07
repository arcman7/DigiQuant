import localforage from 'localforage';

export async function getUserFilesDB(): Promise<LocalForage> {
  localforage.config({
    driver      : localforage.INDEXEDDB,
    name        : 'user_files',
    storeName   : 'user_files', // Should be alphanumeric, with underscores.
    description : 'All files created and saved by the user',
  });
  await localforage.ready();
  return localforage;
}

export type UserFile = {
  content: string;
  type: string;
  lastModified: number;
}

export async function saveUserFile(
  db: LocalForage, filepath: string, file: UserFile
): Promise<void> {
  await db.setItem(filepath, file);
}

export async function getUserFile(
  db: LocalForage, filepath: string
): Promise<UserFile | null> {
  return await db.getItem(filepath);
}

export async function getSavedUserFilesList(db: LocalForage) {
  const filesOnDisk: { [key: string]: boolean } = {}

  await db.iterate((val: Blob | string, filePath: string) => {
    if (val === undefined) {
      return
    }
    if (val instanceof Blob) {
      if (val.size > 0) {
        filesOnDisk[filePath] = true
      }
      return
    }
    if (typeof(val) === 'string' && val.length > 0) {
      filesOnDisk[filePath] = true
    }
  })

  return filesOnDisk;
}