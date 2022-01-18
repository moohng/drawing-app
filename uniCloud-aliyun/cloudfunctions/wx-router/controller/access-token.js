const { Controller } = require("uni-cloud-router");

module.exports = class AccessTokenController extends Controller {
  async get() {
    const appid = 'wx79fd704b15fe3852';
    
    const collection = this.db.collection('wx-access-token');
    const { data } = await collection.where({ appid }).field({ _id: false, access_token: true }).get();
    
    return data[0];
  }
}