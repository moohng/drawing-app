const { Controller } = require("uni-cloud-router");
const SHA1 = require('crypto-js/sha1');

module.exports = class TicketController extends Controller {
  async get() {
    
    const { url, nonceStr, timestamp } = this.ctx.data;
    
    this.ctx.validate({
      url: {
        required: true,
        type: 'string',
      },
      nonceStr: {
        required: true,
        type: 'string',
      },
      timestamp: {
        required: true,
        type: 'string',
      },
    });
    
    const { data } = await uniCloud.httpclient.request('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
      data: {
        access_token: 'client_credential',
        type: 'jsapi',
      },
      contentType: 'json',
      dataType: 'json',
    });
    
    const ticket = data.ticket;
    
    const signature = SHA1(`jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`).toString();
    
    return {
      timestamp,
      nonceStr,
      signature,
    };
  }
}