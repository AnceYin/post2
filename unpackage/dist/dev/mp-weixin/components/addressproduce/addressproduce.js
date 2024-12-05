"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      nickName: "",
      //昵称
      phoneNumber: "",
      //手机号
      addressContent: "",
      //地址
      CopyContent: "",
      //复制内容
      nickNamepopupBol: false,
      //控制昵称输入框隐藏显示
      tipscontext: ""
      //提示文本
    };
  },
  // mounted() {
  // 	console.log('加载中....')
  // 	this.getNoticeList();
  // },
  methods: {
    // // 插入字符串
    // insertTextStr(){
    // 	return soure.slice(0, start) + newStr + soure.slice(start)
    // }
    async getNoticeList() {
      console.log("提示文本");
      const notics = common_vendor.Vs.importObject("other");
      try {
        const res = await notics.getGenerateAddressTip();
        console.log("提示文本", res);
        if (res.status === 0 && res.describe == "success") {
          this.tipscontext = "温馨提示：" + res.data;
        }
      } catch (e) {
        console.log(e.errMsg);
      }
    },
    // 生成地址按钮事件
    generateAddress() {
      this.nickNamepopupBol = true;
    },
    // 复制地址
    copyAddressData() {
      common_vendor.index.setClipboardData({
        data: this.CopyContent,
        success() {
          console.log("复制成功");
        }
      });
    },
    // 封装的公共方法生成地址
    getAddress() {
      const certificate = common_vendor.wx$1.getStorageSync("certificate");
      console.log("certificate----", certificate);
      if (certificate) {
        const nickName = this.nickName;
        common_vendor.Vs.callFunction({
          name: "getPhone",
          data: {
            certificate
          }
        }).then((res) => {
          if (res.result.status == 0 && res.result.data) {
            this.phoneNumber = res.result.data.phoneNumber;
            let userNmae = nickName ? nickName : "默认昵称";
            const addressData = " 广东省佛山市顺德区顺德职业技术学院蜂创校园服务中心";
            let address = userNmae + " " + this.phoneNumber + addressData;
            this.CopyContent = address;
            this.nickName = userNmae;
            this.addressContent = addressData;
          }
        }).catch((err) => {
          console.log("获取手机号错误", err);
        });
        console.log("昵称---", nickName);
      } else {
        console.log("未获取到手机号");
        common_vendor.index.showToast({
          title: "未授权，请先到首页授权",
          icon: "none"
        });
      }
      this.nickNamepopupBol = false;
    },
    // 点击输入框获取到昵称
    getNickname(e) {
      this.nickName = e.detail.value;
    },
    // 取消昵称
    PopupCancel() {
      this.nickNamepopupBol = false;
    },
    // 确认昵称
    PopupOk(e) {
      console.log("昵称名" + e);
      if (this.nickName) {
        this.getAddress();
      } else {
        common_vendor.index.showToast({
          title: "请选择或输入昵称",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.nickName),
    b: common_vendor.t($data.phoneNumber),
    c: common_vendor.t($data.addressContent),
    d: common_vendor.o((...args) => $options.generateAddress && $options.generateAddress(...args)),
    e: common_vendor.o((...args) => $options.copyAddressData && $options.copyAddressData(...args)),
    f: $data.nickNamepopupBol,
    g: common_vendor.o((...args) => $options.PopupCancel && $options.PopupCancel(...args)),
    h: common_vendor.o((...args) => $options.getNickname && $options.getNickname(...args)),
    i: common_vendor.o((...args) => $options.PopupCancel && $options.PopupCancel(...args)),
    j: common_vendor.o((...args) => $options.PopupOk && $options.PopupOk(...args)),
    k: $data.nickNamepopupBol
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
