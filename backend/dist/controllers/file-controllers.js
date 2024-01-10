import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "../index.js";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
export const uploadFile = async (req, res, next) => {
    try {
        const file = new Blob([req.files.upload.data]);
        const loader = new PDFLoader(file);
        const rawDocs = await loader.load();
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await textSplitter.splitDocuments(rawDocs);
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPEN_AI_SECRET,
        });
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: process.env.PINECONE_NAME_SPACE,
            textKey: 'text',
        });
        return res.status(200).json({ message: "Files upload success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Fail to ingest files" });
    }
};
export const clearFiles = async (req, res, next) => {
    try {
        const ns = pinecone.Index(process.env.PINECONE_INDEX_NAME).namespace(process.env.PINECONE_NAME_SPACE);
        await ns.deleteAll();
        return res.status(200).json({ message: "Files delete success" });
    }
    catch (error) {
        return res.status(500).json({ message: "File delete failed" });
    }
};
//# sourceMappingURL=file-controllers.js.map