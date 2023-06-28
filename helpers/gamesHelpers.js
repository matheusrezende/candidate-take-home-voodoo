function flattenJsonNestedArrays(responseData) {
  return responseData.flat(2).filter((item) => item.app_id);
}

function sortDescending(a, b) {
  return b - a;
}

function sortGamesByRating(data) {
  return data.sort((a, b) => sortDescending(a, b));
}

function getTop100(data) {
  return sortGamesByRating(flattenJsonNestedArrays(data)).slice(0, 100);
}

function gameMapper(data) {
  return {
    storeId: data.app_id,
    publisherId: data.publisher_id,
    name: data.name,
    platform: data.os,
    bundleId: data.bundle_id,
    appVersion: data.version,
    isPublished: new Date(data.release_date) < Date.now(),
  };
}

module.exports = {
  gameMapper,
  getTop100,
};
