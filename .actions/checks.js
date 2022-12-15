const fs = require("fs");
const core = require("@actions/core");

module.exports = function () {
  fs.readFile(".actions/cached-version", "utf8", (err, v) => {
    if (err) {
      core.error(err);
    }
    fs.readFile("package.json", "utf8", (err, package_raw) => {
      if (err) {
        core.error(err);
      }
      package_raw = JSON.parse(package_raw);
      var pV = package_raw.version.split(".");
      var oV = v.split(".");
      if (pV[0] <= oV[0] && pV[1] <= oV[1] && pV[2] <= oV[2]) {
        core.notice("package.json version is not up to date. Incrementing `revision`.");
        package_raw.version = [oV[0], oV[1], JSON.parse(oV[2]) + 1].join(".");
        fs.writeFileSync("package.json", JSON.stringify(package_raw, null, 2), "utf8");
      }
      fs.writeFile(".actions/cached-version", package_raw.version, "utf8", () => {
        return package_raw.version;
      });
    });
  });
};
