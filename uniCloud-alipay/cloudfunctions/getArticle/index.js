/**
 * 描述: 获取文章信息
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getArticle',
// 	data: { }
// })
// .then(res => {});
// 返回格式:
// {
//     "status": 0,
//     "describe": "success",
//     "data": [
//         {
//             "_id": "6661be3442b7caac2177f16a",
//             "describe": "寄件指引",
//             "link": "https://env-00jxgt5r6k5b.normal.cloudstatic.cn/寄件指引.jpg?expire_at=1717685291&er_sign=8947a3f9e399500f43a7f17d1d2dc9d1"
//         }
//     ]
// }
 */

const db = uniCloud.database();
const dbCmd = db.command 

'use strict';
exports.main = async (event, context) => {
	const doc = await db.collection("Article").get();
	console.log(doc.data);
	//返回数据给客户端
	return {
		"status": 0,
		"describe": "success",
		"data": doc.data
	}
};
