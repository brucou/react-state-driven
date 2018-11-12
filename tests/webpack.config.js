const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./tests/index.js",
  devServer: {
    contentBase: "./tests",
    hot: true
  },

  mode: "development",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["react-hot-loader/babel"]
          }
        }
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, "./tests"),
    filename: "test-bundle.js"
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "tests/index.html",
      template: "tests/index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
