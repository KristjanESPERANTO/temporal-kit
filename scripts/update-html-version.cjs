module.exports.readVersion = function (contents) {
  const match = contents.match(/temporal-kit@([0-9]+\.[0-9]+\.[0-9]+)/);
  return match ? match[1] : null;
};

module.exports.writeVersion = function (contents, version) {
  return contents.replace(
    /temporal-kit@[0-9]+\.[0-9]+\.[0-9]+/g,
    `temporal-kit@${version}`
  );
};
