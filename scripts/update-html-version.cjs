module.exports.readVersion = (contents) => {
  const match = contents.match(/temporal-kit@([0-9]+\.[0-9]+\.[0-9]+)/);
  return match ? match[1] : null;
};

module.exports.writeVersion = (contents, version) =>
  contents.replace(/temporal-kit@[0-9]+\.[0-9]+\.[0-9]+/g, `temporal-kit@${version}`);
