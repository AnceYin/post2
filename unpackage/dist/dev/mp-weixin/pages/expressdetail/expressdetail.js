"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      packageInfo: null
    };
  },
  onLoad(options) {
    if (options && options.id && options.image && options.title && options.subtitle && options.info && options.status) {
      const packageInfo = {
        id: options.id,
        image: decodeURIComponent(options.image),
        title: decodeURIComponent(options.title),
        subtitle: decodeURIComponent(options.subtitle),
        info: decodeURIComponent(options.info),
        status: decodeURIComponent(options.status)
      };
      this.packageInfo = packageInfo;
    } else {
      console.error("Missing required parameters:", options);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.packageInfo
  }, $data.packageInfo ? {
    b: $data.packageInfo.image,
    c: common_vendor.t($data.packageInfo.title),
    d: common_vendor.t($data.packageInfo.subtitle == "undefined" ? "" : $data.packageInfo.subtitle),
    e: common_vendor.t($data.packageInfo.info),
    f: common_vendor.t($data.packageInfo.status)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
