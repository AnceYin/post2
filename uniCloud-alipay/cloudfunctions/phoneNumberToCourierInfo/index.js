/**
 * 描述: 传入手机号获取快递信息
// 调用方式:
// uniCloud.callFunction({
// 	name: 'phoneNumberToCourierlnfo',
// 	data: { phoneNumber: "19074923286" }
// })
// .then(res => {});
// 返回格式:
// {
//     "status": 0, // 调用状态, 0表示调用成功，1表示兔喜API报错，2表示多多API报错，3表示传入空手机号
//     "describe": "success",
//     "data": {
//         "packageInfo": [ // 数组各元素按入库时间戳从大到小排序
//             {
//                 "updateDate": 1710062595000, // 入库时间戳
//                 "expressCompanyCode": "ZTO", // 快递公司
//                 "billCode": "78403743284498", // 快递单号
//                 "takeCode": "31A3-72410" // 取件码
//             }
//         ]
//     }
// }
 */
'use strict';

const axios = require('axios');
const qs = require('qs');
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	// 定义返回值
	let result = {
		"status": 0,
		"describe": "success",
		"data": {
			"packageInfo": []
		}
	};

	// 处理前端参数
	let {
		phoneNumber
	} = event
	console.log("前端传入的手机号：")
	console.log(phoneNumber)
	if (!phoneNumber) {
		result.status = 3
		result.describe = "手机号为空"
		console.log("返回给后端的数据：")
		console.log(result)
		return result;
	}


	// 统一数据库拿数据
	const [TXDoc, DDDoc, antiContentCount, antiContentDoc, countAdd] = await Promise.all([
		db.collection("TuXiAuthentication").doc("665c435093a03abf82fc11cd").get(),
		db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").get(),
		db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").field({
			"antiContentCount": true
		}).get(),
		db.collection("DuoDuoAntiContent").limit(1).get(),
		db.collection("DuoDuoAuthentication").doc("665c43211bef6bf8b34a8e11").update({
			antiContentCount: dbCmd.inc(1)
		})
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
		'data': `{"billCode":null,"code":"${phoneNumber}","type":1,"dateRange":1,"depotCode":"KDCS39300264913","endDate":"2024-05-27 15:23:52","expressCompanyCode":null,"grayFlag":"Y","leaveRemark":null,"pageSize":50,"page":1}`
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
			'X-Userid': '1584598',
			'X-Unionid': 'union3yUb_WTqv6Yo4KBWCVFU3'
		},
		data: TXData
	};
	let DDData = JSON.stringify({
		"page_index": 1,
		"content": phoneNumber,
		"selected": false,
		"offset": 0,
		"search_type": 1
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
			.filter(item => item.leaveType === 1) // 正常状态为1
			.map(item => ({
				updateDate: item.updateDate,
				expressCompanyCode: item.expressCompanyCode,
				billCode: item.billCode,
				takeCode: item.takeCode
			}));
	} else {
		result.status = 1
		result.describe = "兔喜API报错:" + TXResponse.data.message
	}
	try {
		DDResult = DDResponse.data.result.detail
			.filter(item => item.waybill_status === 100) // 正常状态为100
			.map(item => ({
				updateDate: item.first_in_time,
				expressCompanyCode: item.wp_code,
				billCode: item.waybill_code,
				takeCode: item.pickup_code
			}));
	} catch (err) {
		result.status = 2
		result.describe = "多多API报错:" + DDResponse.data
	}
	result.data.packageInfo = TXResult.concat(DDResult).sort((a, b) => b.updateDate - a.updateDate);

	console.log("返回给后端的数据：")
	console.log(result)
	return result
}