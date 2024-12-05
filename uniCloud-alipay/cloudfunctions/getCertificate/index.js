/**
 * 描述: 传入code获取凭证，凭证可换取手机号和快递信息
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getCertificate',
// 	data: { code: 123 }
// })
// .then(res => {});
// 返回格式:
// {
//     "status": 0, // 调用状态, 0表示调用成功，1表示调用失败
//     "describe": "success",
//     "data": {
//         "certificate": "CNbHi95+30gUIWmUV6MJPpGH3L1ChmCqJ4nHyWX31HM="
//     }
// }
 */
const CryptoJS = require('crypto-js');
const axios = require('axios');
const db = uniCloud.database();

'use strict';

exports.main = async (event, context) => {
	const {
		code
	} = event;
	console.log("传入的code为：", code);

	// 从数据库获取 accessToken，key，iv
	const [WXDoc, JMDoc] = await Promise.all([
		db.collection("WeChatAuthentication").doc("665c437c90a85d15ac161d82").get(),
		db.collection("encryption").doc("6678f38a14b645711ebeeb96").get()
	]);

	const {
		accessToken
	} = WXDoc.data[0];
	const {
		key_tmp,
		iv_tmp
	} = JMDoc.data[0];

	// 定义加密参数
	const key = CryptoJS.enc.Hex.parse(`${key_tmp}`);
	const iv = CryptoJS.enc.Hex.parse(`${iv_tmp}`);

	// 配置请求微信接口的参数
	let requestData = JSON.stringify({
		"code": code
	});
	let config = {
		method: 'POST',
		url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
		headers: {
			'Reqable-Id': 'reqable-id-e7c2a52e-a1bc-4ad4-a182-d3782883589d',
			'Content-Type': 'application/json'
		},
		data: requestData
	};

	// 调用微信接口获取手机号码信息
	const response = await axios.request(config);
	console.log("调用微信的getuserphonenumber接口得到的数据为：", response.data);

	let result;
	try {
		// 检查响应数据
		if (!response.data.phone_info || !response.data.phone_info.phoneNumber) {
			throw new Error("Invalid response data from WeChat API");
		}

		let phoneNumber = response.data.phone_info.phoneNumber;

		// 加密手机号和时间戳
		const rawData = phoneNumber;
		const timestamp = Date.now().toString();
		const dataToEncrypt = `${rawData}:${timestamp}`;
		const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key, {
			iv: iv
		}).toString();

		result = {
			"status": 0,
			"describe": "success",
			"data": {
				"certificate": encrypted
			}
		};
	} catch (error) {
		result = {
			"status": 1,
			"describe": error.message,
			"data": {
				"certificate": null
			}
		};
	}

	console.log("本程序返回给前端的数据", result);

	// 返回数据给客户端
	return result;
};