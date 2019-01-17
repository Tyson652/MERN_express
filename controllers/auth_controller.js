const UserModel = require("./../database/models/user_model");
const JWTService = require("./../services/jwt_service");

// API to create a new User
// @params first_name: string
// @params last_name: string
// @params nickname:string
// @params email: string - passport-local-mongoose requires to be unique by default
// @params password: string
// @return  JWT
function register(req, res, next) {
  const { first_name, last_name, nickname, email, password } = req.body;

  const user = new UserModel({
    first_name,
    last_name,
    nickname,
    email
  });

  UserModel.register(user, password, (err, user) => {
    if (err) {
      // FIXME: breaks tests, custom HTTPError not defined
      console.log(err);
      return next(new HTTPError(500, err.message));
    }

    const token = JWTService.generateToken(user);

    return res.json({ token });
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try { 
    const { user, error } = await UserModel.authenticate()(email, password);
    if (error) throw error;

    const token = JWTService.generateToken(user);
    
    return res.json({ token });

  } catch (err) {
    return next(err);
  }
}

module.exports = { 
  register,
  login
};
