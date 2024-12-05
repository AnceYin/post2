"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 快递单号
      expressnumber: "",
      // 查询状态
      searchBol: false,
      // 快递信息
      myexpressData: [
        {
          takeCode: "A3-2-30234",
          expressCompanyCode: "YZXB",
          billCode: "78420616856546",
          wayBillStatus: 1,
          expressCompanyIcon: "../../static/images/zhongtong.png"
        },
        {
          takeCode: "A3-2-30234",
          expressCompanyCode: "YZXB",
          billCode: "78420616856546",
          wayBillStatus: 1,
          expressCompanyIcon: "../../static/images/zhongtong.png"
        }
      ]
    };
  },
  methods: {
    // 搜索快递
    onSearchExpressData() {
      if (this.expressnumber) {
        common_vendor.Vs.callFunction({
          name: "getCourierInfo",
          data: {
            type: 2,
            data: this.expressnumber
          }
        }).then((res) => {
          if (res.result.status === 0 && res.result.data.packageInfo.length > 0) {
            this.myexpressData = res.result.data.packageInfo;
            this.searchBol = true;
          } else {
            this.myexpressData = [];
            common_vendor.index.showToast({
              title: "暂未查询到相关快递",
              icon: "none"
            });
          }
        }).catch((err) => {
          console.log("错误---", err);
        });
      } else {
        common_vendor.index.showToast({
          title: "请输入快递单号",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.expressnumber,
    b: common_vendor.o(($event) => $data.expressnumber = $event.detail.value),
    c: common_vendor.o((...args) => $options.onSearchExpressData && $options.onSearchExpressData(...args)),
    d: common_assets._imports_0,
    e: $data.searchBol
  }, $data.searchBol ? {
    f: common_vendor.f($data.myexpressData, (item, k0, i0) => {
      return common_vendor.e({
        a: item.expressCompanyIcon,
        b: common_vendor.t(item.takeCode),
        c: common_vendor.t(item.expressCompanyCode),
        d: common_vendor.t(item.billCode),
        e: item.wayBillStatus == 1
      }, item.wayBillStatus == 1 ? {} : item.wayBillStatus == 2 ? {} : item.wayBillStatus == 3 ? {} : {}, {
        f: item.wayBillStatus == 2,
        g: item.wayBillStatus == 3,
        h: item.wayBillStatus == 4
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
