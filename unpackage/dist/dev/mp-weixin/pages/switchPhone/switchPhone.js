"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 数据属性，如果有需要可以在此添加
    };
  },
  methods: {
    navigateToMiniProgram(appId) {
      common_vendor.wx$1.navigateToMiniProgram({
        appId,
        path: "",
        // 如果需要指定小程序的页面路径，可以在这里添加
        extraData: {
          // 需要传递给目标小程序的数据
        },
        envVersion: "release",
        // 可以是 'release'、'develop' 或 'trial'
        success(res) {
          console.log("跳转成功", res);
        },
        fail(err) {
          console.error("跳转失败", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.o(($event) => $options.navigateToMiniProgram("wxb269b8326b8f7c9a")),
    c: common_assets._imports_1$1,
    d: common_vendor.o(($event) => $options.navigateToMiniProgram("wx6885acbedba59c14"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-82260311"]]);
wx.createPage(MiniProgramPage);
