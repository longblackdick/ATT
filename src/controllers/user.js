const router = require('express').Router();
const path = require('path');
const User = require('../models/User');
const { checkForm, filter, handleError } = require('../utils/verification');

const viewDir = path.join(__dirname, '../views');

/**
 * user info page
 * GET /
 */
router.get('/', filter, (req, res) => {
  res.sendFile(path.join(viewDir, 'user.html'));
});


/**
 * login and register page
 * GET /signin
 */
router.get('/signin', (req, res) => {
  res.sendFile(path.join(viewDir, 'sign_in.html'));
});

/**
 * login and register page
 * GET /signup
 */
router.get('/signup', (req, res) => {
  res.sendFile(path.join(viewDir, 'sign_up.html'));
});

/**
 * POST /signin
 */
router.post('/signin', async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status().json({ code: 1, desc: '您没有指定登录数据' });
    return;
  }
  const { email, password } = req.body;
  const [err, userData] = await handleError(User.find(email));
  // 存在错误，判断错误
  if (err) {
    console.log(err.message);
    res.json({ code: 2, desc: 'server internal error or no account' });
  } else if (User.encryptPwd(userData.pwd_salt, password) !== userData.password) {
    // 不存在错误，判断密码，结果为 密码错误
    res.json({ code: 1, desc: 'wrong password' });
  } else {
    // 密码正确，设置session，返回数据
    req.session.user = userData;
    res.json({ code: 0, data: { next: '/' } });
  }
});

/**
 * init the data, ie. current coins
 * POST /init
 */
router.post('/init', filter, async (req, res) => {
  const { user } = req.session;
  const data = {
    name: user.name,
    email: user.email,
    avatar: user.portrait,
    signature: user.signature,
    coin: user.coin,
  };
  res.json({ code: 0, data });
});

/**
 * POST /signup
 */
router.post('/signup', async (req, res) => {
  if (!req.body || !req.body.email || !req.body.name || !req.body.password) {
    res.json({ code: 2, desc: '没有传递注册参数' });
    return;
  }
  const { email, name, password } = req.body;

  if (!checkForm(email, name, password)) {
    res.json({ code: 1, desc: '输入数据格式错误' });
    return;
  }

  const [findErr] = await handleError(User.find(email));
  // 不存在err代表查到了
  if (!findErr) {
    res.json({ code: 1, desc: 'the email has been token' });
    return;
  }
  const [errCreate] = await handleError(User.create(req.body));
  if (errCreate) {
    console.log(errCreate);
    res.json({ code: 1, desc: 'server internal error' });
  } else {
    res.json({ code: 0, data: { next: '/' } });
  }
});

router.post('/remove', async (req, res) => {
  if (!req.body || !req.body.id) {
    res.json({ code: 1, desc: '请指定要删除的账号id' });
    return;
  }
  const [err, user] = await handleError(User.find(req.body.email));

  if (err) {
    res.json({ code: 1, desc: 'err' });
  }
  user.remove();
  if (user) {
    res.json({ code: 0, data: { next: '/user/login' } });
  }
});

/**
 * POST /logout
 */
router.get('/logout', (req, res) => {
  if (req.cookies.user) {
    res.clearCookie();
  }
  if (req.session) {
    req.session = null;
  }
  res.redirect('/user/login');
});

module.exports = router;
