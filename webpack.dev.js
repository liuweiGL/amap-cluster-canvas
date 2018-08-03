const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "amap-cluster-canvas.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [path.resolve(__dirname, "src")]
      },
      {
        test: /\.css$/,
        loader: "css-loader",
        options: {
          sourceMap: true
        }
      }
    ]
  },
  plugins: [],
  devtool: "eval",
  devServer: {
    port: 8080,
    open: true,
    compress: true
  }
};
