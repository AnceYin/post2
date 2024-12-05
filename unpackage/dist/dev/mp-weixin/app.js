"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/switchPhone/switchPhone.js";
  "./pages/expressdetail/expressdetail.js";
  "./pages/shippingdetail/shippingdetail.js";
  "./pages/introdetail/introdetail.js";
  "./pages/addressproduce/addressproduce.js";
  "./pages/demo/demo.js";
  "./pages/searchexpressdata/searchexpressdata.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
