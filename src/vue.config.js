module.exports = {
  configureWebpack: {
    devtool: 'source-map',

    modules: {
      test: /.html/,
      loader: 'html-loader'
    }
  },
};
