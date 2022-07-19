const getDelta = (source, updated) => {
  let added = updated.filter(
    (updatedItem) =>
      source.find((sourceItem) => sourceItem.id === updatedItem.id) ===
      undefined
  );
  let changed = updated.filter(
    (updatedItem) =>
      source.find((sourceItem) => sourceItem.id === updatedItem.id) !==
      undefined
  );
  let deleted = source.filter(
    (sourceItem) =>
      updated.find((updatedItem) => updatedItem.id === sourceItem.id) ===
      undefined
  );

  const delta = {
    added: added,
    changed: changed,
    deleted: deleted,
  };

  return delta;
};
module.exports = getDelta;
