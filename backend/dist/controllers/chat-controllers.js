import Users from "../models/Users.js";
import { configureOpenAI } from "../config/openai-config.js";
import OpenAIApi from "openai";
import { Types } from "mongoose";
import { pinecone } from "../index.js";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { makeChain } from "../utils/makechain.js";
const generateChatCompletionWithoutFiles = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await Users.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }
        // grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
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
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const generateChatCompletion = async (req, res, next) => {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const ns = index.namespace(process.env.PINECONE_NAME_SPACE);
    const num_vectors = (await ns.describeIndexStats()).totalRecordCount;
    if (num_vectors == 0) {
        return generateChatCompletionWithoutFiles(req, res, next);
    }
    try {
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPEN_AI_SECRET,
        });
        const vectorstore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            textKey: "text",
            namespace: process.env.PINECONE_NAME_SPACE,
        });
        const chain = makeChain(vectorstore);
        const { message } = req.body;
        const user = await Users.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }
        // grab chats of user
        const chats = user.chats.map(function (element) {
            if (element.role == "user") {
                return `Human: ${element.content}\n`;
            }
            else if (element.role == "assistant") {
                return `AI: ${element.content}\n\n`;
            }
        }).join('');
        const response = await chain.invoke({
            question: message,
            chat_history: chats,
        });
        user.chats.push({ role: "user", content: message });
        user.chats.push({ role: "assistant", content: response.text });
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await Users.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didn't match");
        }
        // return chats of user
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
export const clearChats = async (req, res, next) => {
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
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map