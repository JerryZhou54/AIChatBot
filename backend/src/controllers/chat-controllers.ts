import { NextFunction, Request, Response } from "express";
import Users from "../models/Users.js";
import { configureOpenAI } from "../config/openai-config.js";
import OpenAIApi from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Types } from "mongoose";

export const generateChatCompletion = async(
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { message } = req.body;
	try {
		const user = await Users.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json({ message: "User not registered or token malfunctioned"});
		}
		// grab chats of user
		const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionMessageParam[];
		chats.push({ role: "user", content: message });
		user.chats.push({ role: "user", content: message });
		// send all chats with new one to openai API
		const config = configureOpenAI();
		const openai = new OpenAIApi(config);
		// get latest response
		const chatResponse = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: chats,
		});
		user.chats.push(chatResponse.choices[0].message);
		await user.save();
		return res.status(200).json({chats: user.chats});
	} catch (error) {
		console.log(error);
		
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export const sendChatsToUser = async(
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await Users.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).send("User not registered or token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permission didn't match");
		}
		// return chats of user
		return res.status(200).json({message: "OK", chats: user.chats});
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "ERROR", cause: error.message});
	}
}

export const clearChats = async(
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await Users.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).send("User not registered or token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permission didn't match");
		}
		// delete chats of user
		user.chats = new Types.DocumentArray([]);
		await user.save();
		return res.status(200).json({message: "OK", chats: user.chats});
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "ERROR", cause: error.message});
	}
}