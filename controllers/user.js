import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    console.log(req.query);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) next(new ErrorHandler("Invalid Email or Password", 404, false));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      next(new ErrorHandler("Invalid Email or Password", 404, false));

    sendCookie(user, res, `Welcome Back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, error) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        message: "User Logged Out",
      });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, error) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) next(new ErrorHandler("User Already Exist", 404, true));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendCookie(user, res, "Register Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res, error) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
