'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  
  const appid = 'wx79fd704b15fe3852';
  
  const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/cgi-bin/token', {
    data: {
      grant_type: 'client_credential',
      appid,
      secret: 'cec445d91929ea6d0908d3ea234af49e',
    },
    contentType: 'json',
    dataType: 'json',
  });
  
  console.log('======', res.data);
  
  const collection = db.collection('wx-access-token');
  const { data } = await collection.where({ appid }).get();
  
  const doc = {
    ...res.data,
    appid,
    updateTime: new Date(),
  };
  
  if (data.length) {
    await collection.doc(data[0]._id).set(doc);
  } else {
    await collection.add(doc);
  }
	
  return res.data;
};
