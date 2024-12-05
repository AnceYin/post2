/**
 * 描述: 传入凭证或快递号获取快递信息
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getCourierInfo',
// 	data: { type: 1, data: "9ow6wq/sUbLB3XE81ECAYdNjcctRjsxZliRmqRM1yYo=" } // type值为1代表凭证，2代表快递号
// })
// .then(res => {})
// .catch(err => {});
// 返回格式:
// {
//     "status": 0, // 调用状态, 0表示调用成功，1表示兔喜API报错，2表示多多API报错，3表示凭证不合法，4表示类型不合法，5表示传入快递号不合法
//     "describe": "success",
//     "data": {
//         "packageInfo": [ // 数组各元素按入库时间戳从大到小排序
//             {
//                 "updateDate": 1717132872973, // 入库时间戳
//                 "expressCompanyCode": "YZXB", // 快递公司缩写
//                 "expressCompanyIcon": "https://env-00jxgt5r6k5b.normal.cloudstatic.cn/CourierIcon/YZXB.png", // 快递公司Icon链接
//                 "wayBillStatus": 2, // 快递信息状态，1表示待取件，2表示签收出库，3表示退件出库
//                 "billCode": "9859893975798", // 快递单号
//                 "takeCode": "26-4-8827" // 取件码
//             }
//         ]
//     }
// }
 */

const CryptoJS = require('crypto-js');
const axios = require('axios');
const qs = require('qs');
const db = uniCloud.database();
const dbCmd = db.command;


'use strict';
exports.main = async (event, context) => {
	// 定义返回值
	let result = {
		"status": 0,
		"describe": "success",
		"data": {
			"packageInfo": []
		}
	};

	// 从前端拿数据, type的1代表凭证，2代表快递号
	const {
		type,
		data
	} = event;
	console.log(type);
	
	// 从数据库获取 key，iv
	const JMDoc = await db.collection("encryption").doc("6678f38a14b645711ebeeb96").get()
	const { key_tmp, iv_tmp } = JMDoc.data[0];
	
	// 定义加密参数
	const key = CryptoJS.enc.Hex.parse(`${key_tmp}`);
	const iv = CryptoJS.enc.Hex.parse(`${iv_tmp}`);
	
	// 用于保存解析的手机号
	let code;

	switch (type) {
		case 1: {
			// 解密数据
			const encryptedData = data;
			const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
				iv: iv
			});
			const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

			// 凭证为空
			if (!decryptedText) {
				return {
					"status": 3,
					"describe": "凭证不合法",
					"data": {
						"packageInfo": []
					}
				};
			}

			// 解析成手机号和时间戳
			const [rawData, timestamp] = decryptedText.split(':');
			code = rawData;

			// 检验手机号是否合法（假设合法手机号为10-15位数字）
			const phoneRegex = /^\d{10,15}$/;
			const isCodeValid = phoneRegex.test(code);

			// 检验时间戳是否合法（比当前时间戳要小）
			const isTimestampValid = timestamp < Date.now().toString();

			if (!isCodeValid || !isTimestampValid) {
				return {
					"status": 3,
					"describe": "凭证不合法",
					"data": {
						"packageInfo": []
					}
				};
			}
			break;
		}
		case 2: {
			// 检验快递单号是否合法
			if(data.length < 9){
				return {
					"status": 5,
					"describe": "快递号不合法",
					"data": {
						"packageInfo": []
					}
				};
			}
			code = data;
			break;
		}
		default: {
			return {
				"status": 4,
				"describe": "类型不合法",
				"data": {
					"packageInfo": []
				}
			};
		}
	}

	// 统一数据库拿数据
	const [TXDoc, DDDoc, antiContentCount, antiContentDoc, countAdd, IconDoc] = await Promise.all([
		db.collection("TuXiAuthentication").doc("665c435093a03abf82fc11cd").get(),
		db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").get(),
		db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").field({
			"antiContentCount": true
		}).get(),
		db.collection("DuoDuoAntiContent").limit(1).get(),
		db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").update({
			antiContentCount: dbCmd.inc(1)
		}),
		db.collection("ExpressCompanyIconMap").limit(1).get(),
	]);

	// 统一处理数据库数据
	const {
		Token: TXToken,
		XYsDt
	} = TXDoc.data[0];
	const {
		accessToken: DDToken,
		cookie
	} = DDDoc.data[0];
	const antiContent = antiContentDoc.data[0].anti;
	const iconMap = IconDoc.data[0];
	const wayBillStatusMap = {
		"1":1,
		"3":3,
		"4":2,
		"100":1,
		"800":2,
		"301":3
	};
	const DDQueryTypeMap = {
		"1":1,
		"2":3
	};
	

	// 判断数据库antiContent字段是否超了
	if (antiContentCount.data[0].antiContentCount >= 10) {
		let res = await db.collection("DuoDuoAntiContent").limit(1).get(); // 只返回第一条记录
		await Promise.all([
			db.collection("DuoDuoAntiContent").doc(res.data[0]._id).remove(),
			db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").update({
				antiContentCount: 0
			})
		]);
	}

	// 统一封装网络请求
	let TXResult = [],
		DDResult = [];
	let TXData = qs.stringify({
		'data': `{"billCode":null,"code":"${code}","type":"${type}","dateRange":1,"depotCode":"KDCS39300264913","endDate":"2024-05-27 15:23:52","expressCompanyCode":null,"grayFlag":"Y","leaveRemark":null,"pageSize":50,"page":1}`
	});
	let TXConfig = {
		method: 'POST',
		url: 'https://kdcsgateway.zt-express.com/gateway.do/',
		headers: {
			'Reqable-Id': 'reqable-id-17bce034-256c-4767-86d7-092958963060',
			'User-Agent': 'Android:9 ;MI 9 ;Android; Version 4.38.2',
			'Connection': 'Keep-Alive',
			'Accept-Encoding': 'gzip',
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-Ca-Version': '5',
			'X-Zop-Name': 'tuxi.spm.stock.read.queryScanEnterInfoAppByCode',
			'X-App-Version': '4.38.2',
			'X-Ys-Dt': XYsDt,
			'X-Sv-V': 'com.zto.families.ztofamilies_4.38.2',
			'x-device-id': 'b746cb22-edd5-4200-8ef6-6d6585d5a835',
			'X-Iam-Token': TXToken,
			'X-Userid': '248453',
			'X-Unionid': 'union5SUmRfNUAEQ_98UAO7Xw0P_R'
		},
		data: TXData
	};
	let DDData = JSON.stringify({
		"page_index": 1,
		"content": code,
		"selected": false,
		"offset": 0,
		"search_type": DDQueryTypeMap[`${type}`]
	});
	let DDConfig = {
		method: 'POST',
		url: 'https://mdkd-api.pinduoduo.com/api/orion/op/package/search/content',
		headers: {
			'Reqable-Id': 'reqable-id-f90f3bce-83c3-4c7a-83f1-5f2d16e70d7f',
			'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; SM-N9700 Build/PQ3B.190801.06161913)station_android_version/3.8.0 PackegeName/com.xunmeng.station AppVersion/3.8.0 DeviceType/Mobile AppName/DDStore pstation_android_version/3.8.0',
			'Accept-Encoding': 'gzip',
			'content-type': 'application/json;charset=utf-8',
			'p-appname': 'DDStore',
			'verifyauthtoken': 'PY8IH3e8Y8JkPwvBjLrBFA4bdc2d46274077ff6',
			'device-name': 'SM-N9700',
			'etag': '1LNVYCSN',
			'accesstoken': DDToken,
			'anti-content': antiContent,
			'referer': 'Android',
			'mcmd-enc': 'AAAAAAAAAAAAAAAAAAAAAH97/sceJByxAkDejG5VVEuhDWRfsuvISEqdpG3oLuuWH3PEE3aWghMqVWBq9WRLNg==',
			'pdd-config': 'V4:069.030800',
			'vip': '81.69.68.235',
			'Cookie': cookie
		},
		data: DDData
	};

	// 统一发送网络请求
	const [TXResponse, DDResponse] = await Promise.all([
		axios.request(TXConfig),
		axios.request(DDConfig)
	]);

	// 定义返回数据处理网络错误
	if (TXResponse.data.status) {
		TXResult = TXResponse.data.result.stockInfos
			.map(item => ({
				updateDate: item.updateDate,
				expressCompanyCode: item.expressCompanyCode,
				expressCompanyIcon: item.expressCompanyCode,
				wayBillStatus: item.leaveType,
				billCode: item.billCode,
				takeCode: item.takeCode
			}));
	} else {
		result.status = 1
		result.describe = "兔喜API报错:" + TXResponse.data.message
	}
	try {
		DDResponse.data.success
		if (DDResponse?.data?.result?.detail) {
			DDResult = DDResponse.data.result.detail
				.map(item => ({
					updateDate: item.first_in_time,
					expressCompanyCode: item.wp_code,
					expressCompanyIcon: item.wp_code,
					wayBillStatus: item.waybill_status,
					billCode: item.waybill_code,
					takeCode: item.pickup_code
				}));
		}
	} catch (err) {
		result.status = 2
		result.describe = "多多API报错:" + DDResponse.data
	}
	result.data.packageInfo = TXResult.concat(DDResult)
		.sort((a, b) => b.updateDate - a.updateDate)
		.map(item => ({
			updateDate: item.updateDate,
			expressCompanyIcon: iconMap[item.expressCompanyIcon]||iconMap["default"],
			wayBillStatus: wayBillStatusMap[`${item.wayBillStatus}`],
			billCode: item.billCode,
			takeCode: item.takeCode
		}));

	console.log("返回给后端的数据：")
	console.log(result)
	return result
}


