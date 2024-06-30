const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsWithToken = async (token) => {
  if (!token) {
    console.log({
      message: "session out",
      logout: true,
    });
    return {
      message: "session out",
      logout: true,
    };
  }
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decode.id).select(
    "-password -assign_password"
  );
  return user;
};

module.exports = getUserDetailsWithToken;
