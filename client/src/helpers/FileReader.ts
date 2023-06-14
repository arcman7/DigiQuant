import Papa from 'papaparse';

export const parseCSV = (
  file: File,
  // options: Papa.ParseLocalConfig
) => {
  return Papa.parse(file, {
    complete: function(results) {
      console.log(results);
    },
    // ...options
  });
};

export const readChunkAsText = (
  file: File,
  start: number,
  end: number
): Promise<string> => {
  const blob = file.slice(start, end);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (errorEvent) => {
      reject(errorEvent);
    };
    reader.readAsText(blob);
  });
};

export const readChunk = (
  file: File,
  start: number,
  end: number
): Promise<string | ArrayBuffer> => {
  const blob = file.slice(start, end);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result || "");
    };
    reader.onerror = (errorEvent) => {
      reject(errorEvent);
    };
    reader.readAsArrayBuffer(blob);
  });
};

export const readFile = (file: File): Promise<string | ArrayBuffer> => {
  return readChunk(file, 0, file.size);
};

export const arrayBuffer2String = (
  buf: ArrayBuffer,
  callback: (result: string) => void
) => {
  const bb = new Blob([buf]);
  const f = new FileReader();
  f.onload = (e) => {
    callback((e.target?.result as string) || "");
  };
  f.readAsText(bb);
};

export const string2ArrayBuffer = (
  string: string,
  callback: (result: ArrayBuffer) => void
) => {
  const bb = new Blob([string]);
  const f = new FileReader();
  f.onload = function (e) {
    callback((e.target?.result as ArrayBuffer) || new ArrayBuffer(0));
  };
  f.readAsArrayBuffer(bb);
};

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (!bytes) {
    return "0 Byte";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

/*export const compressNumber = (n: number) => {
  if (n < 0 || n > 4294967295) {
    throw new Error("Number must be between 0 and 4294967295.");
  }
  const bytes = [0, 0, 0, 0];
  
  for (let i = 0; i < 4; i++) {
    bytes[i] = n % 256;
    n = Math.floor(n / 256);
  }
  return bytes;
};
*/
/*export const decompressNumber = (bytes: [number, number, number, number]) => {
  let n = 0;
  for (let i = 3; i >= 0; i--) {
    n = n * 256 + bytes[3];
  }

  return n
}
*/

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

  return n
}

export const getExtension = (filename: string) => filename.split(".").pop();


export const getFileStructurePattern = (filestring: string, fileType = 'CSV') => {
  const rows = filestring.split("\n");
  if (fileType === 'CSV') {
    const anomalies = [];
    const header = rows[0];
    const expectedNumColumns = header.split(",").length;
    const numColumnsPerRow = Array(rows.length).fill(0);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const numColumns = row.split(",").length;
      numColumnsPerRow[i] = numColumns;

      if (numColumns !== expectedNumColumns) {
        anomalies.push(`Row ${i + 1} has ${numColumns} columns, expected ${expectedNumColumns}`);
      }
    }

    if (anomalies.length > 0) {
      anomalies.forEach((anomaly) => {
        console.warn(anomaly);
      });
      return anomalies;
    } else {

    }
  }

  throw new Error('Unsupported file type');
};