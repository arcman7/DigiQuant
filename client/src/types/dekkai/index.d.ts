declare const dekkai: {
  readonly DataFile: any;
  readonly DataTools: any;
  readonly WorkerPool: any;
  init(workerCount?: number): Promise<any>;
  terminate(): void;
  iterateLocalFile(file: any, itr: any, options?: any): Promise<void>;
  binaryFromLocalFile(file: any, options?: any): Promise<any>;
  binaryFromURL(url: any, options?: any): Promise<any>;
  binaryFromString(str: any, options?: any): Promise<any>;
  tableFromLocalFile(file: any, options?: any): Promise<any>;
  tableFromURL(url: any, options?: any): Promise<any>;
  tableFromString(str: any, options?: any): Promise<any>;
};
export default dekkai;
