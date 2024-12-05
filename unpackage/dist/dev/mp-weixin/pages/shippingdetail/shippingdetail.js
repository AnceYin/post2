"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      imageArray: [
        { id: 1, src: "../../static/shipping1.jpg" },
        { id: 2, src: "../../static/shipping2.jpg" }
      ],
      imageSrc: "",
      localId: null
    };
  },
  props: ["id"],
  created() {
    this.localId = this.id;
    console.log("Received id:", this.localId);
    this.imageSrc = this.getImageById(this.localId);
    console.log("Image source:", this.imageSrc);
  },
  methods: {
    getImageById(id) {
      const image = this.imageArray.find((item) => item.id === parseInt(id));
      return image ? image.src : "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.imageSrc
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-79c98aa8"]]);
wx.createPage(MiniProgramPage);
