import { NextFunction, Request, Response } from "express";
import User from "../models/Users.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME, BASE_DOMAIN } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const users = await User.find(); // get all users
    return res.status(200).json({ message: "OK", users});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const {name, email, password} = req.body; // user signup
		const existingUser = await User.findOne({email: email}).exec();
		if (existingUser) return res.status(401).send("User already exists");
    const encryptedPassword = await hash(password, 10);
    const user = new User({name, email, password: encryptedPassword});
    await user.save();

		// create token and store cookie
		res.clearCookie(COOKIE_NAME, {
			path: "/",
			domain: BASE_DOMAIN,
			httpOnly: true,
			signed: true,
		});

		const token = createToken(user._id.toString(), user.email, "7d");
		const expires = new Date();
		expires.setDate(expires.getDate() + 7);
		res.cookie(COOKIE_NAME, token, {
			path: "/",
			domain: BASE_DOMAIN,
			expires,
			httpOnly: true,
			signed: true,
			secure: true
		});
		
    return res.status(201).json({ message: "OK", name: user.name, email: user.email});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const {email, password} = req.body; // user login
		const user = await User.findOne({email: email}).exec();
		if (!user) {
			return res.status(401).send("User not registered");
		}
		const isPasswordCorrect = await compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(403).send("Password Incorrect");
		}
		
		// create token and store cookie
		res.clearCookie(COOKIE_NAME, {
			path: "/",
			domain: BASE_DOMAIN,
			httpOnly: true,
			signed: true,
		});

		const token = createToken(user._id.toString(), user.email, "7d");
		const expires = new Date();
		expires.setDate(expires.getDate() + 7);
		res.cookie(COOKIE_NAME, token, {
			path: "/",
			domain: BASE_DOMAIN,
			expires,
			httpOnly: true,
			signed: true,
			secure: true
		});

		return res.status(200).json({ message: "OK", name: user.name, email: user.email});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
		// user token check
		const user = await User.findById(res.locals.jwtData.id).exec();
		if (!user) {
			return res.status(401).send("User not registered or token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permissions didn't match");
		}

		return res.status(200).json({ message: "OK", name: user.name, email: user.email});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogout = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
		// user token check
		const user = await User.findById(res.locals.jwtData.id).exec();
		if (!user) {
			return res.status(401).send("User not registered or token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permissions didn't match");
		}

		res.clearCookie(COOKIE_NAME, {
			path: "/",
			domain: BASE_DOMAIN,
			httpOnly: true,
			signed: true,
		});

		return res.status(200).json({ message: "OK", name: user.name, email: user.email});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};