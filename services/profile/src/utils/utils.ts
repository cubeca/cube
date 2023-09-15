export const stringToKeyValuePairs = (str: any) => {
  const pairs = str.split('&');
  const result: any = {};

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    result[key] = value;
  }

  return result;
};
