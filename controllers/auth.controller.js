const jwt = require(`jsonwebtoken`);
const adminModel = require(`../models/index`).admin;
const secret = `mokleters`;
const md5 = require(`md5`)

const authenticate = async (request, response, next) => {
  const dataLogin = {
    email: request.body.email,
    password: md5(request.body.password),
  };
  console.log(dataLogin);
  /** check data email and password on user's table */
  let dataadmin = await adminModel.findOne({ where: {email: dataLogin.email, password: dataLogin.password} });

  /** if data user exists */
  if (dataadmin) {
    /** set payload for generate token.
     * payload is must be string.
     * dataUser is object, so we must convert to string.
     */
    let payload = JSON.stringify(dataadmin);
    console.log(payload);

    /** generate token */
    let token = jwt.sign(payload, secret);

    /** define response */
    return response.json({
      success: true,
      logged: true,
      message: `Login Success`,
      token: token,
    //   data: dataadmin,
    });
  }

  /** if data user is not exists */
  return response.json({
    success: false,
    logged: false,
    message: `Authentication Failed. Invalid email or password`,
  });
};

const authorize = (request, response, next) => {
  /** get "Authorization" value from request's header */
  const authHeader = request.headers.authorization;

  /** check nullable header */
  if (authHeader) {
    /** when using Bearer Token for authorization,
     * we have to split headers to get token key.
     * values of headers = Bearers tokenKey
     */
    const token = authHeader.split(" ")[1];

    /** verify token using jwt */
    let verifiedadmin = jwt.verify(token, secret);
    if (!verifiedadmin) {
      return response.json({
        success: false,
        auth: false,
        message: `admin Unauthorized`,
      });
    }

    request.admin = verifiedadmin; // payload

    /** if there is no problem, go on to controller */
    next();
  } else {
    return response.json({
      success: false,
      auth: false,
      message: `admin Unauthorized`,
    });
  }
};

module.exports = { authenticate, authorize };
