/**
 * 描述: 传入凭证获取手机号
// 调用方式:
// uniCloud.callFunction({
// 	name: 'getPhone',
// 	data: { certificate: "oZQ4kYIDup8WrVMRjU0wzm89lR8uyPed5rjQNQqOE04=" }
// })
// .then(res => {});
// 返回格式:
// {
//     "status": 0,
//     "describe": "成功",
//     "data": {
//         "phoneNumber": 19074923286
//     }
// }
 */


const db = uniCloud.database();
const dbCmd = db.command 
const CryptoJS = require('crypto-js');

'use strict';
exports.main = async (event, context) => {
    const { certificate } = event;
	
	// 从数据库获取 key，iv
	const JMDoc = await db.collection("encryption").doc("6678f38a14b645711ebeeb96").get()
	const { key_tmp, iv_tmp } = JMDoc.data[0];
	
	// 定义加密参数
	const key = CryptoJS.enc.Hex.parse(`${key_tmp}`);
	const iv = CryptoJS.enc.Hex.parse(`${iv_tmp}`);
    
    // 解密数据
    const encryptedData = certificate;
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
        return {
            "status": 1,
            "describe": "凭证不合法",
			"data": {
			    "phoneNumber": null
			}
        };
    }

    const [rawData, timestamp] = decryptedText.split(':');
    const phoneNumber = rawData;
	
    // 检验手机号是否合法（假设合法手机号为10-15位数字）
    const phoneRegex = /^\d{10,15}$/;
    const isPhoneNumberValid = phoneRegex.test(phoneNumber);

    // 检验时间戳是否合法（比当前时间戳要小）
    const isTimestampValid = timestamp < Date.now().toString();

    if (!isPhoneNumberValid || !isTimestampValid ) {
        return {
            "status": 1,
            "describe": "凭证不合法",
			"data": {
			    "phoneNumber": null
			}
        };
    }

    return {
        "status": 0,
        "describe": "成功",
        "data": {
            "phoneNumber": phoneNumber
        }
    };
};
