export function createIncrementArray(length: number) {
  const arr = [];
  for (let i = 0; i < length; i++) arr.push(i);

  return arr;
}

export function getParamCalls(length: number) {
  return createIncrementArray(length).map((item) => [item]);
}

export function typeCast<T>(data: any): T {
  return data as unknown as T;
}
