const User = require('models/user');
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('config/keys');

signToken = user => {
  return jwt.sign({
    iss: 'Etherowd',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() +1) // current time + 1 day ahead
  }, JWT_SECRET);
}

module.exports = {
  create: async (req, res, next) => {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress)
      return res
        .status(400)
        .send({ error: 'Request should have signature and publicAddress' });

    console.log(publicAddress);

    return (
      await User.findOne({ where: { publicAddress } })
        ////////////////////////////////////////////////////
        // Step 1: Get the user with the given publicAddress
        ////////////////////////////////////////////////////
        .then(user => {
          if (!user)
            return res.status(401).send({
              error: `User with publicAddress ${publicAddress} is not found in database`
            });
          return user;
        })
        ////////////////////////////////////////////////////
        // Step 2: Verify digital signature
        ////////////////////////////////////////////////////
        .then(user => {
          if (!user) {
            // Should not happen, we should have already sent the response
            throw new Error('User is not defined in "Verify digital signature".');
          }

          const msg = `I am signing my one-time nonce: ${user.nonce}`;
          console.log(msg);

          // We now are in possession of msg, publicAddress and signature. We
          // will use a helper from eth-sig-util to extract the address from the signature
          const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
          const address = sigUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature
          });
          console.log(address)

          // The signature verification is successful if the address found with
          // sigUtil.recoverPersonalSignature matches the initial publicAddress
          if (address.toLowerCase() === publicAddress.toLowerCase()) {
            return user;
          } else {
            return res
              .status(401)
              .send({ error: 'Signature verification failed' });
          }
        })
        ////////////////////////////////////////////////////
        // Step 3: Generate a new nonce for the user
        ////////////////////////////////////////////////////
        .then(user => {
          if (!user) {
            // Should not happen, we should have already sent the response

            throw new Error(
              'User is not defined in "Generate a new nonce for the user".'
            );
          }

          user.nonce = Math.floor(Math.random() * 10000);
          return user.save();
        })
        ////////////////////////////////////////////////////
        // Step 4: Create JWT
        ////////////////////////////////////////////////////
        .then(user => {
          return new Promise((resolve, reject) =>
            // https://github.com/auth0/node-jsonwebtoken
            jwt.sign(
              {
                payload: {
                  id: user.id,
                  publicAddress
                }
              },
              config.secret,
              {},
              (err, token) => {
                if (err) {
                  return reject(err);
                }
                return resolve(token);
              }
            )
          );
        })
        .then(accessToken => res.json({ accessToken }))
        .catch(next)
    );
  },
}
