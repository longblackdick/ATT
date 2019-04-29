const express = require('express'); // express工具包
// const session = require('express-session');
const bodyParser = require('body-parser');
// const cookie = require('cookie-parser');
const path = require('path'); // node的path工具包

const {
  settlement,
  getCardGroup,
  randomCards
} = require('./card');

const app = express();

// 将public下的文件设置为静态文件，此后public目录成为根目录
app.use(express.static('public'));
// 为了解析application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// 解析 post 的 body 使用，解析application/json
app.use(bodyParser.json());
app.use(express.json());
// app.use(cookie());


let gameStart = false;
let gameCards; // 游戏分配的卡牌
let gameCoin = 10000; // 当前用户的金币数
let pourCoin = 0; // 当前下注金币

// 主页
app.get('/', (req, res) => {
  const homePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(homePath);
});

// 登录
app.get('/login', (req, res) => {
  const loginPath = path.join(__dirname, 'public', 'pages/login/index.html');
  res.sendFile(loginPath);
});

// 下注
app.post('/pour', (req, res) => {
  if (gameStart) {
    res.json({
      code: 1,
      desc: '游戏已经开始，不能下注',
    });
    return;
  }
  const {
    coin
  } = req.body;
  pourCoin = coin;
  if (gameCoin < coin) {
    res.json({
      code: 1,
      desc: '游戏金币不足',
    });
    return;
  }
  gameCoin -= coin;
  gameStart = true;
  gameCards = randomCards();
  const cards = (getCardGroup(gameCards)).cards;
  res.json({
    cards,
    code: 0,
  });
});

// 选牌
app.post('/switch', (req, res) => {
  if (!gameStart) {
    res.json({
      code: 2,
      desc: 'Game not start',
    });
    return;
  }
  let keep = req.body['keep[]'];
  if (!keep) {
    keep = [];
  }
  const temp = [];
  for (let i = 0; i < 5; i += 1) {
    if (keep.includes(i.toFixed())) {
      temp.push(gameCards[i]);
    } else {
      temp.push(undefined);
    }
  }
  gameCards = randomCards(temp);
  const cardGroup = getCardGroup(gameCards);
  const cards = cardGroup.cards;
  const result = cardGroup.judge();
  const winCoin = settlement(pourCoin, result);
  gameCoin += winCoin;
  gameStart = false;
  res.json({
    cards,
    code: 0,
    currentCoin: gameCoin,
    result,
    winCoin,
  });
});

app.post('/init', (req, res) => {
  res.json({
    code: 0,
    currentCoin: gameCoin,
  });
});

const port = 3001;
app.listen(port, () => {
  console.clear();
  console.log(`Server running on http://localhost:${port}`);
  console.log('尽情享受ATT')
});