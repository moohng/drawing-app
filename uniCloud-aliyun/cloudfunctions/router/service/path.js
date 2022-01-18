const { Service } = require("uni-cloud-router");

module.exports = class HelloService extends Service {

  get(code) {
    return this.db
      .collection('dp-path')
      .where(this.db.command.or({ code }, { password: code }))
      .orderBy('createTime', 'desc')
      .limit(1)
      .get();
  }
  
  add(data) {
    return this.db.collection('dp-path').add(data);
  }
};
