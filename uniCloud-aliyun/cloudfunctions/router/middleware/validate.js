module.exports = () => {
  return async (ctx, next) => {
    ctx.validate = (rule) => {
      const { data } = ctx;
      let errorText = '';
      Object.keys(rule).forEach(key => {
        const item = rule[key];
        if (typeof data[key] === 'undefined') {
          if (item.required) {
            errorText += `${key} is required; `;
          }
        } else {
          if (item.type) {
            if (item.type.toLowerCase() === 'array') {
              if (!Array.isArray(data[key])) {
                errorText += `${key} must be a ${item.type}; `;
              }
            } else if (typeof data[key] !== item.type.toLowerCase()) {
              errorText += `${key} must be a ${item.type}; `;
            }
          }
          if (item.pattern instanceof RegExp && !item.pattern.text(data[key])) {
            errorText += `${key} format fault; `;
          }
        }
      });
      
      if (errorText) {
        throw new Error(errorText);
      }
    };
    
    await next();
  };
};
