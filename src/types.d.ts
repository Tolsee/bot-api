declare module 'async-retry' {
  function retry<T>(
    callbackFn: (bail: Function, num: number) => Promise<T | undefined>,
    opts?: import('@types/retry').OperationOptions,
  ): Promise<T>;

  export default retry;
}
