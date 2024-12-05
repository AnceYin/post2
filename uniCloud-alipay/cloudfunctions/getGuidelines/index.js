/**
 * 描述: 获取新生指引信息
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getGuidelines',
// 	data: { }
// })
// .then(res => {});
// 返回格式:
// {
//     "status": 0,
//     "describe": "success",
//     "data": [
//         {
//             "_id": "6669001579dba612c71f5e38",
//             "describe": "填写驿站地址",
//             "jumpLink": [
//                 "" // 内部图片链接
//             ],
//             "jumpType": 1, // 0为纯图片，1为图片+一些功能
//             "pictureLink": "https://env-00jxgt5r6k5b.normal.cloudstatic.cn/地址生成.png?expire_at=1718162403&er_sign=57644f1aa6edb5228b2637b6ffe7b715" // 卡片上的图片
//         }
//     ]
// }
 */

const db = uniCloud.database();
const dbCmd = db.command 

'use strict';
exports.main = async (event, context) => {
	const doc = await db.collection("Guidelines").get();
	console.log(doc.data);
	//返回数据给客户端
	return {
		"status": 0,
		"describe": "success",
		"data": doc.data
	}
};
