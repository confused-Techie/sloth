module.exports = {
  config: {
    sourceDirectory: "./docs",
    buildDirectory: "./dist",
    devPort: 8080,
    jsBuildDirectory: "./dist",
    jsSourceDirectory: "./assets/js",
    jsMinifyGenerateSourceMap: true,
    jsMinifyOptions: {},
    cssBuildDirectory: "./dist",
    cssSourceDirectory: "./assets/css",
    cssMinifyGenerateSourceMap: true,
    cssMinifyOptions: {},
    staticSourceDirectory: "./assets/static",//[
      //"./assets/static"
      //{
      //  from: "./assets/static/robots.txt",
      //  to: "./dist/robots.txt"
      //}
    //],
    staticBuildDirectory: "./dist",
    sidebar: "./sidebar.json",
    defaultView: "home"
  }
};
