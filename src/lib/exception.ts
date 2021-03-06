export function causeAsyncException(reason: any): void {
  assert(!console.debug(stringify(reason)));
  void new Promise((_, reject) =>
    void reject(reason));
}

function stringify(target: any): string {
  try {
    return target instanceof Error && typeof target.stack === 'string'
      ? target.stack
      : target !== void 0 && target !== null && typeof target.toString === 'function'
        ? target + ''
        : Object.prototype.toString.call(target);
  }
  catch (reason) {
    return stringify(reason);
  }
}
