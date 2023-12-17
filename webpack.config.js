const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
  },
  mode: "production",
  optimization: {
    minimize: true,
  },
};
