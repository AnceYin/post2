"use strict";
const common_vendor = require("../../common/vendor.js");
const addressproduceVue = () => "../../components/addressproduce/addressproduce.js";
const _sfc_main = {
  data() {
    return {};
  },
  components: {
    addressproduceVue
  }
};
if (!Array) {
  const _component_addressproduceVue = common_vendor.resolveComponent("addressproduceVue");
  _component_addressproduceVue();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
