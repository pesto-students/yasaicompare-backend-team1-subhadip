const headerValidator = (request) => {
  if (!Object.keys(request.headers).length) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(request.headers, 'authorization')) {
    return false;
  }

  if (request.headers.authorization.includes('Bearer ')) {
    return request.headers.authorization.replace('Bearer ', '');
  }

  return request.headers.authorization;
};

export default {
  headerValidator,
};
