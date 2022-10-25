'use strict';

let uniID = require('uni-id');

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event, context)
  
  uniID = uniID.createInstance({
  	context,
  });
  const res = await uniID.loginByWeixin({ code: event.code });
	
	//返回数据给客户端
	return res;
};
