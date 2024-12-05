const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * 获得公告文字信息
	 * @returns {Object} {"status":0,"describe":"success","data":["公告文字一","公告文字二"]}
	 */
	async getAnnouncement() {
		const doc = await db.collection("Other").get();
		console.log(doc.data[0].announcement);
		return {
			"status": 0,
			"describe": "success",
			"data": doc.data[0].announcement
		}
	},
	/**
	 * 获得生成地址页面提示信息
	 * @returns {Object} {"status":0,"describe":"success","data":"地址页面提示词"}
	 */
	async getGenerateAddressTip() {
		const doc = await db.collection("Other").get();
		console.log(doc.data[0].generateAddressTip);
		return {
			"status": 0,
			"describe": "success",
			"data": doc.data[0].generateAddressTip
		}

	}
}