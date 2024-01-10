import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { clearChats, generateChatCompletion, sendChatsToUser } from "../controllers/chat-controllers.js";
import { clearFiles, uploadFile } from "../controllers/file-controllers.js";

// Protected API
// Only users who are authenticated can access it
const chatRoutes = Router();

chatRoutes.post(
	"/new", 
	validate(chatCompletionValidator),
	verifyToken, 
	generateChatCompletion
);

chatRoutes.get(
	"/all-chats", 
	verifyToken, 
	sendChatsToUser
);

chatRoutes.delete(
	"/clear",
	verifyToken,
	clearChats
);

chatRoutes.post(
	"/upload-file",
	verifyToken,
	uploadFile
);

chatRoutes.delete(
	"/clear-files",
	verifyToken,
	clearFiles
)
export default chatRoutes;