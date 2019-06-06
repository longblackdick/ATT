
// eslint-disable-next-line new-cap
const router = require('express').Router();
const path = require('path');
// const User = require('../models/User');
const { handleError } = require('../utils/verification');
const { getCards, getCardsIndex, settlement } = require('../utils/att');
const { exchange, filter } = require('../utils/verification');
const Rooms = require('../models/Rooms');

const viewDir = path.join(__dirname, '../views');

/**
 * GET /
 */
router.get('/', filter, (req, res) => {
  res.sendFile(path.join(viewDir, 'game.html'));
});

router.post('/init', filter, async (req, res) => {
  const { roomId } = req.session.user;
  const [err, result] = await handleError(Rooms.getRooms(roomId));
  if (err) {
    res.json({ code: 1, desc: '服务器内部错误' });
    return;
  }
  if (req.session.user.coin < result[0].min_user_coin
    || req.session.user.coin > result[0].max_user_coin) {
    res.json({ code: 1, desc: '当前金币玩家不允许进入此房间' });
    return;
  }
  res.json({ code: 0, data: { room: result[0] } });
});


/**
 * pour
 */
router.post('/pour', filter, async (req, res) => {
  const user = exchange(req.session.user);

  if (user.gameStart) {
    res.json({ code: 1, desc: '游戏已经开始，不能下注' });
    return;
  }

  /** coin 下注金额 */
  user.pourCoin = req.body.coin;

  if (user.coin < user.pourCoin) {
    res.json({ code: 1, desc: '游戏金币不足' });
    return;
  }
  user.gameCards = getCardsIndex(); // {0,12,1,3,4}
  const { cards } = getCards(user.gameCards);
  user.coin -= user.pourCoin;
  req.session.user = user;
  const [errSave] = await handleError(user.save());
  if (errSave) {
    // console.error('user update failed');
    res.json({
      code: 2,
      desc: 'internal error',
    });
  } else {
    user.gameStart = true;
    res.json({ code: 0, data: { cards } });
    req.session.user = user;
  }
});

/**
 * 处理 switch
 */
router.post('/switch', filter, async (req, res) => {
  const user = exchange(req.session.user);

  if (!user.gameStart) {
    res.json({ code: 2, desc: 'Game not start' });
    return;
  }
  // keep数据转换成整型
  let { keep } = req.body;
  if (keep) {
    keep = keep.map(e => parseInt(e, 10));
  }
  console.log(keep);
  user.gameCards = getCardsIndex(user.gameCards, keep);
  // user.gameCards = getCardsIndex(user.gameCards);
  const { cards, result } = getCards(user.gameCards);
  const winCoin = settlement(user.pourCoin, result);
  req.session.user = user;

  if (winCoin > 0) user.coin += winCoin;
  const [errSave] = await handleError(user.save());
  if (errSave) {
    res.json({ code: 2, desc: 'internal error' });
  } else {
    user.gameStart = false;
    req.session.user = user;
    res.json({
      code: 0,
      data: {
        cards, currentCoin: user.coin, result, winCoin,
      },
    });
  }
});

module.exports = router;
