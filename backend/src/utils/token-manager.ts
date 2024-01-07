import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
	const payload = { id, email };
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: expiresIn,
	});
	return token;
} 

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	console.log(req.signedCookies);
	const token = req.signedCookies[`${COOKIE_NAME}`];
	if (!token || token.trim() === "") {
		return res.status(401).json({ message: "Token not received"});
	}
	return new Promise<void>((resolve, reject) => {
		// The callback is called with the decoded payload if the signature is valid 
		// If not, it will be called with the error.
		return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
			if (err) {
				reject(err.message);
				return res.status(401).json({ message: "Token expired" });
			} else {
				resolve();
				res.locals.jwtData = success;
				return next();
			}
		})
	})
}