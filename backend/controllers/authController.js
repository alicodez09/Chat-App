const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUserDetailsWithToken = require("../middlewares/getUserDetailsWithToken");

//! Register User
const Register = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;

    // Checking the user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log({
        success: false,
        message: "User already exists",
      });
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    // password in hashedpassword
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashPassword,
      assign_password: password,
    };

    const User = new UserModel(payload);
    const data = await User.save();

    console.log({
      success: true,
      message: "User Registered Successfully",
      data: data,
    });
    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something wents wrong while registeration",
      error,
    });
  }
};

//! Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Checking the user
    const existingUser = await UserModel.findOne({ email }).select(
      "-password -assign_password"
    );
    if (!existingUser) {
      console.log({
        success: false,
        message: "User does't  exists",
      });
      return res.status(400).send({
        success: false,
        message: "User does't  exists",
      });
    }

    console.log({
      success: true,
      message: "User Verified Successfully",
      data: existingUser,
    });
    return res.status(200).send({
      success: true,
      message: "User Verified Successfully",
      data: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something wents wrong while verifying the user",
      error,
    });
  }
};

//! Verify Password
const verifyPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;

    const user = await UserModel.findById(userId);
    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(200).send({
        success: false,
        message: "User Password not Verified Successfully",
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    const cookieOptions = {
      http: true,
      secure: true,
    };
    console.log({
      success: true,
      message: "Login Successfully",
      token: token,
    });
    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "Login Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something wents wrong while verifying the user",
      error,
    });
  }
};

//! Get User Details
const userDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsWithToken(token);

    res.status(200).send({
      success: true,
      message: "User Details get successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something wents wrong",
      error,
    });
  }
};

//! Update User Details
const updateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsWithToken(token);
    const { name, profile_pic } = req.body;

    // Updating the user
    await UserModel.findByIdAndUpdate(
      { _id: user._id },
      { name, profile_pic },
      { new: true }
    );

    // Get updated values of user
    const updatedUser = await UserModel.findById(user._id);

    res.status(200).send({
      success: true,
      message: "User Details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something wents wrong",
      error,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
    };
    return res.cookie("token", "", cookieOptions).status(200).send({
      success: true,
      message: "Session out",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something wents wrong",
      error,
    });
  }
};

module.exports = {
  Register,
  verifyEmail,
  verifyPassword,
  userDetails,
  updateUserDetails,
  logout,
};
