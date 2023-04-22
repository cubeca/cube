export const inspect = (...things: any) =>
  things.forEach((thing: any) =>
    console.dir(thing, { depth: null, color: true })
  );

export const filterObject = (obj:any, ...allowedKeys:string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));
