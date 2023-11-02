export const stringToKeyValuePairs = (str: any) => {
  if (str === '{}') {
    return {};
  }

  const pairs = str.split('&');
  const result: any = {};

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    result[key] = value;
  }

  return result;
};

export const brevoTemplateIdMapping = {
  REPORT_ABUSE_TEMPLATE: 12
};
