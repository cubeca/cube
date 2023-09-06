export const makeUUID = () => {
  const randHex = () => '0123456789abcdef'[Math.floor(Math.random() * 16)];
  const randRest = () => '89ab'[Math.floor(Math.random() * 4)];
  return String('00000000-0000-4000-8000-000000000000').replaceAll('8', randRest).replaceAll('0', randHex);
};
