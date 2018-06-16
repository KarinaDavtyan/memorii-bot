const processAsync = async (handlers, value) => {
  for (let i = 0; i < handlers.length; i++) {
    const result = await handlers[i](value);
    if (result) return result;
  }
}

const process = async (handlers, value) =>  {
  for (let i =0 ; i < handlers.length; i++) {
    const result = handlers[i](value);
    if (result) return result;
  }
}

exports.process = process;
exports.processAsync = processAsync;
