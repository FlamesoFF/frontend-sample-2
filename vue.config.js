module.exports = {
  lintOnSave: false,

  // baseUrl: process.env.NODE_ENV === 'production' ? '/' : 'assets/',

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder

      }
    }
  }
};
