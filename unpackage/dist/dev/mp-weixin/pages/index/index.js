"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      items: [],
      active: 0,
      status: "listData",
      // 初始状态为 'Premission'
      packageList: [],
      // 包裹数据 
      activeNames: [],
      // 当前展开的项
      images: [],
      // 从云函数获取的轮播图数据
      phonelist: [
        {
          lable: "1234****101",
          value: "微信绑定手机号"
        },
        {
          lable: "1234****101",
          value: ""
        }
      ],
      authphoneBox: true,
      phoneDataShow: false,
      phoneBox: "getphone phoneDataIn ",
      phoneNumber: 0,
      // 导航内容
      navContentData: [
        // 待取件
        {
          pickedtype: "0",
          pickedContent: "暂无取件数据"
        },
        // 新生指引
        {
          guidelist: ["绑定驿站地址", "取件指引", "寄件指引", "问题答疑", "更多指引"]
        }
      ],
      // 第几个导航内容卡片
      navindex: 0,
      noticelist: []
    };
  },
  onLoad() {
    console.log("页面加载成功。。。");
    this.fetchCarousel();
    this.getSoredPhoneOnLoad();
    this.fetchArticles();
    this.getNoticeList();
  },
  onPullDownRefresh() {
    console.log("刷新被触发");
    this.fetchCarousel();
    this.getSoredPhoneOnLoad();
    this.fetchArticles();
    common_vendor.index.stopPullDownRefresh();
  },
  onShareAppMessage() {
    return {
      title: "顺手办校园驿站",
      path: "/pages/index/index",
      // 分享路径，确保路径正确
      imageUrl: "https://env-00jxgt5r6k5b.normal.cloudstatic.cn/wx7670dd170ec4fad6.png?expire_at=1719149437&er_sign=d10509e14f9ce2f26611d40868fc138b"
      // 分享的图片 URL
    };
  },
  onShareTimeline() {
    return {
      title: "顺手办校园驿站",
      query: "path=/pages/index/index",
      // 分享路径中的参数
      imageUrl: "https://env-00jxgt5r6k5b.normal.cloudstatic.cn/wx7670dd170ec4fad6.png?expire_at=1719149437&er_sign=d10509e14f9ce2f26611d40868fc138b"
      // 分享的图片 URL
    };
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(Number(dateString));
      if (isNaN(date.getTime())) {
        console.error("Invalid dateString:", dateString);
        return "Invalid Date";
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    },
    async getNoticeList() {
      const notics = common_vendor.Vs.importObject("other");
      try {
        const res = await notics.getAnnouncement();
        if (res.status === 0 && res.describe == "success") {
          this.noticelist = res.data;
        }
      } catch (e) {
        console.log(e.errMsg);
      }
    },
    // 搜索
    OnsearchExpress() {
      common_vendor.index.navigateTo({
        url: "/pages/searchexpressdata/searchexpressdata"
      });
    },
    // 导航滑动事件
    navSlideOn(e) {
      this.navindex = e.detail.current;
      this.active = e.detail.current;
    },
    async fetchCarousel() {
      try {
        const res = await common_vendor.Vs.callFunction({
          name: "getCarousel",
          data: {}
        });
        console.log("Carousel response:", res);
        if (res.result.status === 0) {
          this.images = res.result.data;
          this.images.forEach((image, index) => {
            console.log(`Image ${index} jumpLink:`, image.jumpLink);
          });
          console.log("Images:", this.images);
        } else {
          console.error("获取轮播图数据失败:", res.result.describe);
        }
      } catch (error) {
        console.error("调用云函数失败:", error);
      }
    },
    handleImageClick(index) {
      const image = this.images[index];
      console.log(`Clicked image ${index} jumpLink:`, image.jumpLink);
      if (image.jumpType === 0 && image.jumpLink) {
        common_vendor.wx$1.navigateTo({
          url: image.jumpLink
        });
      } else {
        console.log("未定义的跳转类型或无跳转链接");
      }
    },
    bindViewTap() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/demo/demo?url=${}"
      });
    },
    async fetchArticles() {
      try {
        const res = await common_vendor.Vs.callFunction({
          name: "getGuidelines",
          data: {}
        });
        console.log("文章----", res);
        if (res.result.status === 0) {
          let arr = [];
          let obj = {};
          res.result.data.map((x) => {
            if (x.describe != "更多指引") {
              arr.push(x);
            } else {
              obj = x;
            }
          });
          arr.push(obj);
          this.items = arr;
        } else {
          console.error("获取文章信息失败:", res.result.describe);
        }
      } catch (error) {
        console.error("调用云函数失败:", error);
      }
    },
    addressBtenter() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/addressproduce/addressproduce"
      });
    },
    gotoshipping() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/switchPhone/switchPhone"
      });
    },
    gotointrodetail(item) {
      console.log("item----", item);
      if (item.jumpType != 1) {
        common_vendor.wx$1.navigateTo({
          url: `/pages/introdetail/introdetail?articleUrl=${item.jumpLink}`
        });
      }
    },
    handleTabClick(index) {
      this.active = index;
      this.navindex = index;
    },
    getSoredPhoneOnLoad() {
      let that = this;
      common_vendor.wx$1.getStorage({
        key: "certificate",
        success(res) {
          console.log("获取凭证" + res.data);
          if (res.data) {
            that.sendPhoneNumber(res.data);
          }
        },
        fail() {
          console.log("未获取到");
          that.status = "Premission";
        }
      });
    },
    navigateToDetail(item) {
      common_vendor.wx$1.navigateTo({
        url: `/pages/expressdetail/expressdetail?id=${item.billCode}&image=${encodeURIComponent(item.expressCompanyIcon)}&title=${encodeURIComponent(item.takeCode)}&subtitle=${encodeURIComponent(item.expressCompanyCode)}&info=${encodeURIComponent(item.billCode)}&status=${encodeURIComponent(this.getWayBillStatusText(item.wayBillStatus))}`
      });
    },
    toggleCollapse(id) {
      const index = this.activeNames.indexOf(id);
      if (index > -1) {
        this.activeNames.splice(index, 1);
      } else {
        this.activeNames.push(id);
      }
    },
    Login(e) {
      console.log("用户信息:", e);
      console.log("Login invoked, code:", e.detail.code);
      common_vendor.Vs.callFunction({
        name: "getCertificate",
        data: {
          code: e.detail.code
        }
      }).then((res) => {
        console.log("凭证res---", res);
        let certificate = res.result.data.certificate;
        console.log("凭证----", certificate);
        if (certificate) {
          this.sendPhoneNumber(certificate);
          common_vendor.wx$1.setStorage({
            key: "certificate",
            data: certificate,
            success() {
              console.log("certificate stored successfully");
            }
          });
        }
      }).catch((err) => {
        console.error("Failed to get certificate:", err);
      });
    },
    sendPhoneNumber(certificate) {
      console.log("Sending certificate to backend:", certificate);
      common_vendor.Vs.callFunction({
        name: "getCourierInfo",
        data: {
          type: 1,
          // 假设type为1表示凭证
          data: certificate
        }
      }).then((res) => {
        console.log("通过凭证查询res---", res);
        if (res.result.status === 0 && res.result.data.packageInfo.length > 0) {
          this.packageList = res.result.data.packageInfo.map((pkg) => ({
            updateDate: this.formatDate(pkg.updateDate),
            // 格式化时间
            expressCompanyCode: pkg.expressCompanyCode,
            expressCompanyIcon: pkg.expressCompanyIcon,
            wayBillStatus: pkg.wayBillStatus,
            billCode: pkg.billCode,
            takeCode: pkg.takeCode
          }));
          this.packageList.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
          this.status = "listData";
        } else {
          this.status = "noData";
        }
      }).catch((err) => {
        console.error("Failed to get courier info:", err);
      });
    },
    getWayBillStatusText(status) {
      switch (status) {
        case 1:
          return "待取件";
        case 2:
          return "签收出库";
        case 3:
          return "退件出库";
        default:
          return "未知状态";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.images, (image, index, i0) => {
      return {
        a: image.pictureLink,
        b: index,
        c: common_vendor.o(($event) => $options.handleImageClick(index), index)
      };
    }),
    b: common_vendor.f($data.noticelist, (itme, k0, i0) => {
      return {
        a: common_vendor.t(itme)
      };
    }),
    c: _ctx.index,
    d: common_vendor.o((...args) => $options.OnsearchExpress && $options.OnsearchExpress(...args)),
    e: common_assets._imports_0,
    f: $data.active === 0 ? 1 : "",
    g: common_vendor.o(($event) => $options.handleTabClick(0)),
    h: $data.active === 1 ? 1 : "",
    i: common_vendor.o(($event) => $options.handleTabClick(1)),
    j: $data.active === 2 ? 1 : "",
    k: common_vendor.o(($event) => $options.handleTabClick(2)),
    l: $data.active * 35 + "%",
    m: $data.status === "Premission"
  }, $data.status === "Premission" ? {
    n: common_assets._imports_1,
    o: common_vendor.o((...args) => $options.Login && $options.Login(...args))
  } : $data.status === "listData" ? {
    q: common_vendor.f($data.packageList, (item, k0, i0) => {
      return {
        a: item.expressCompanyIcon,
        b: common_vendor.t(item.takeCode),
        c: common_vendor.t(item.updateDate),
        d: common_vendor.t(item.expressCompanyCode),
        e: common_vendor.t(item.billCode),
        f: common_vendor.t(item.wayBillStatus === 1 ? "待取件" : item.wayBillStatus === 2 ? "签收出库" : "退件出库"),
        g: item.wayBillStatus === 1 ? 1 : "",
        h: item.wayBillStatus === 2 ? 1 : "",
        i: item.wayBillStatus === 3 ? 1 : "",
        j: item.billCode,
        k: common_vendor.o(($event) => $options.navigateToDetail(item), item.billCode)
      };
    })
  } : $data.status === "noData" ? {
    s: common_assets._imports_1
  } : {}, {
    p: $data.status === "listData",
    r: $data.status === "noData",
    t: common_assets._imports_2,
    v: common_vendor.o((...args) => $options.addressBtenter && $options.addressBtenter(...args)),
    w: common_vendor.f($data.items, (item, index, i0) => {
      return {
        a: item.pictureLink,
        b: common_vendor.t(item.describe),
        c: item.jumpType == 1,
        d: item._id,
        e: common_vendor.o(($event) => $options.gotointrodetail(item), item._id)
      };
    }),
    x: $data.active === 1 ? 1 : "",
    y: common_vendor.o((...args) => $options.Login && $options.Login(...args)),
    z: $data.navindex,
    A: common_vendor.o((...args) => $options.navSlideOn && $options.navSlideOn(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
