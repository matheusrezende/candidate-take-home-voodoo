const axios = require("axios");
const { IOS_FILE, ANDROID_FILE } = require("../config/s3files");

function fetchFiles() {
  const filesToFetch = [IOS_FILE, ANDROID_FILE];
  return Promise.all(
    filesToFetch.map((item) =>
      axios.get(item).then((response) => response.data)
    )
  );
}

module.exports = {
  fetchFiles,
};
