
import dekkai from 'dekkai';


export const debounce = (func: (...args: any) => void, wait: number = 300) => {
  let timer: number;
  type funcArgs = Parameters<typeof func>;
  return (...args: funcArgs) => {
    clearTimeout(timer); //@ts-ignore
    timer = setTimeout(() => {
      func(...args);
    }, wait);
  }
}
//'c:/Users/Ryan/projects/DigiQuant/client/node_modules/dekkai/dist/esm/dekkai.js' implicitly has an 'any' type.

export const sizeOfDataset = (dataset: File | string) => {
  if (dataset instanceof File) {
    return dataset.size;
  } else { /* 2 bytes per character */
    return dataset.length * 2;
  }
}

export const compressNumber = (n: number) => {
  if (n < 0 || n > 4294967295) {
    throw new Error("Number must be between 0 and 4294967295.");
  }

  const bytes = [0, 0, 0, 0];
  bytes[0] = n % 255;
  n = Math.floor(n / 255);
  bytes[1] = n % 255;
  n = Math.floor(n / 255);
  bytes[2] = n % 255;
  n = Math.floor(n / 255);
  bytes[3] = n % 255;

  return bytes;
};

export const decompressNumber = (bytes: [number, number, number, number]) => {
  let n = 0;
  n = n * 255 + bytes[3];
  n = n * 255 + bytes[2];
  n = n * 255 + bytes[1];
  n = n * 255 + bytes[0];

  return n;
};

const parseCSV2Image = (csv: File) => {

}


