/**
 * 描述: 传入code获取手机号
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getPhoneNumber',
// 	data: { code: 123 }
// })
// .then(res => {});
// 返回格式:
// {
// 	"result": {
// 		"status": 0, // 调用状态, 0表示调用成功，1表示调用失败
//		"describe": "success",
// 		"data": {
// 			"phoneNumber": 19074923286
// 		}
// 	}
// }
 */

const axios = require('axios');
const db = uniCloud.database();
'use strict';
exports.main = async (event, context) => {
	const {code} = event;
	let data = JSON.stringify({
		"code": code
	});
	console.log("传入的code为：")
	console.log(code)
	const doc = await db.collection("WeChatAuthentication").doc("665c437c90a85d15ac161d82").get();
	const { accessToken } = doc.data[0];
	let config = {
		method: 'POST',
		url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
		headers: {
			'Reqable-Id': 'reqable-id-e7c2a52e-a1bc-4ad4-a182-d3782883589d',
			'Content-Type': 'application/json'
		},
		data: data
	};
	const response = await axios.request(config);
	console.log("调用微信的getuserphonenumber接口得到的数据为：")
	console.log(response.data)
	
	let result;
	try {
		let phoneNumber = response.data.phone_info.phoneNumber
		result = {
			"result": {
				"status": 0,
				"describe": "success",
				"data": {
					"phoneNumber": phoneNumber
				}
			}
		}
	} catch (error) {
		result = {
			"result": {
				"status": 1,
				"describe": error.message,
				"data": {
					"phoneNumber": null
				}
			}
		}
	}
	
	console.log("本程序返回给前端的数据")
	console.log(result)
	//返回数据给客户端
	return result
};