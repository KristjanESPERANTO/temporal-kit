export const readVersion = (contents) => {
  const match = contents.match(/temporal-kit@([0-9]+\.[0-9]+\.[0-9]+)/);
  return match ? match[1] : null;
};

export const writeVersion = (contents, version) =>
  contents.replace(/temporal-kit@[0-9]+\.[0-9]+\.[0-9]+/g, `temporal-kit@${version}`);
