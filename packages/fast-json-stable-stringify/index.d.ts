declare module "fast-json-stable-stringify" {
  export interface opt {
    /**
     * Pass cycles
     */
    cycles: boolean;
    /**
     * @see {@link https://stackoverflow.com/a/9653082}
     */
    censor: boolean;
  }
  function stringify(obj: any, opts: opt): string;
  export = stringify;
}
