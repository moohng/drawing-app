const validate = require('./middleware/validate.js');

module.exports = {
  debug: true, // 调试模式时，将返回 stack 错误堆栈
  baseDir: __dirname, // 必选，应用根目录
  middleware: [
    [
      validate(),
      { enable: true },
    ]
  ], // 自定义中间件
};
