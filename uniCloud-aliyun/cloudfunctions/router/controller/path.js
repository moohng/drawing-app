const { Controller } = require("uni-cloud-router");

module.exports = class HelloController extends Controller {

  get() {
    return this.service.path.get(this.ctx.data.code || '秦丹');
  }
  
  add() {
    this.ctx.validate({
      code: {
        required: true,
        type: 'string',
      },
      path: {
        required: true,
        type: 'Array',
      },
    });
    return this.service.path.add(this.ctx.data);
  }
};
