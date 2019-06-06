

/**
 * sign up
 */
function submitSignUpForm() {
  const email = document.getElementById('inputEmail').value;
  const name = document.getElementById('inputName').value;
  const password = document.getElementById('inputPassword').value;
  const rePassword = document.getElementById('confirmPassword').value;

  if (!checkEmail(email) || !checkUser(name) || !checkPassword(password, rePassword)) {
    alert('邮箱，用户名或密码格式错误');
    return false;
  }
  axios.post('/user/signup', {
    email,
    name,
    password,
  }).then((res) => {
    if (res.data.code !== 0) {
      console.log(res.data.desc);
      return;
    }
    window.location.href = res.data.data.next;
  }).catch((err) => {
    console.error(err);
  });
}

/**
 * sign in
 */
function submitSignInForm() {
  const email = document.getElementById('inputEmail').value;
  const password = document.getElementById('inputPassword').value;

  if (!checkEmail(email) || !checkPassword(password)) {
    alert('邮箱或密码格式错误');
    return false;
  }

  axios.post('/user/signin', { email, password }).then((res) => {
    if (res.data.code !== 0) {
      console.error(res.data.desc);
      alert(res.data.desc);
      return;
    }
    console.log('登录成功');
    window.location.href = res.data.data.next;
  }).catch((err) => {
    console.log(err);
  });
}

/**
 * check email
 * @param {string} email
 */
function checkEmail(email) {
  const regexp = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!email || !regexp.test(email)) {
    return false;
  }
  return true;
}

/**
 * check user name
 * @param {string} user
 */
function checkUser(user) {
  const pattern = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
  if (!user || !pattern.test(user)) {
    return false;
  }
  return true;
}

/**
 * check password
 * @param {string} password
 * @param {string} rePassword
 */
function checkPassword(password, rePassword = '') {
  const pattern = /^\w{6,16}$/;
  if (!password || !pattern.test(password)) {
    return false;
  }
  if (rePassword !== '' && password !== rePassword) {
    return false;
  }
  return true;
}

/**
 * get url param
 * @param {string} name
 */
function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    console.log(unescape(r[2]));
    return unescape(r[2]);
  }
  return null;
}
