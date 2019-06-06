module.exports = {
  OK: {
    status: 200,
    desc: '请求成功',
  },
  BadRequest: {
    status: 400,
    desc: '请求的语法错误，服务器无法理解',
  },
  Unauthorized: {
    status: 401,
    desc: '请求要求用户的身份认证',
  },
  NotFound: {
    status: 404,
    desc: '您所请求的资源无法找到',
  },
  InternalServerError: {
    status: 500,
    desc: '服务器内部错误，无法完成请求',
  },
  Forbidden: {
    status: 403,
    desc: '服务器理解请求客户端的请求，但是拒绝执行此请求',
  },
};
