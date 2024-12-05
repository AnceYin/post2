/**
 * 描述: 获取轮播图信息
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getCarousel',
// 	data: { }
// })
// .then(res => {});
// 返回格式:
// {
//     "status": 0,
//     "describe": "success",
//     "data": [
//         {
//             "describe": "", // 说明
//             "pictureLink": "https://env-00jxgt5r6k5b.normal.cloudstatic.cn/1.jpg?expire_at=1718115213&er_sign=afbd7c5cff45f39b8dd231dde8b503b6", // 图片链接
//             "jumpType": 0, // 跳转类型
//             "jumpLink": "" // 跳转链接
//         }
//     ]
// }
 */

const db = uniCloud.database();
const dbCmd = db.command 

'use strict';
exports.main = async (event, context) => {
	const doc = await db.collection("Carousel").get();
	console.log(doc.data);
	//返回数据给客户端
	return {
		"status": 0,
		"describe": "success",
		"data": doc.data
	}
};
