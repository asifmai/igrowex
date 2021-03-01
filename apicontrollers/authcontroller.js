const jwt = require('jsonwebtoken');

function generateTokenResponse(user) {
  const userInfo = {
    id: user._id,
  };

  return {
    token: 'Bearer ' + jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY }),
    user,
  };
}

module.exports.login_post = async function (req, res, next) {
  return res.status(200).json({ status: 200, data: generateTokenResponse(req.user) });
};

module.exports.me_get = (req, res, next) => {
  return res.status(200).json({ status: 200, data: req.user });
};
