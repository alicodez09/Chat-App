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

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decode.id).select(
      "-password -assign_password"
    );
    return user;
  } catch (error) {
    console.log({
      message: "Invalid Token",
      logout: true,
    });
    return {
      message: "Invalid Token",
      logout: true,
    };
  }
};

module.exports = getUserDetailsWithToken;
