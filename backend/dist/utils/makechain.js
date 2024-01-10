import { OpenAI } from '@langchain/openai';
import { LLMChain, loadQAChain, ConversationalRetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
const CONDENSE_PROMPT = PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);
const QA_PROMPT = PromptTemplate.fromTemplate(`You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`);
export const makeChain = (vectorstore) => {
    const retriever = vectorstore.asRetriever();
    const questionGenerator = new LLMChain({
        llm: new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', openAIApiKey: process.env.OPEN_AI_SECRET }),
        prompt: CONDENSE_PROMPT,
    });
    const docChain = loadQAChain(new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', openAIApiKey: process.env.OPEN_AI_SECRET }), {
        type: "stuff",
        prompt: QA_PROMPT,
    });
    return new ConversationalRetrievalQAChain({
        retriever,
        combineDocumentsChain: docChain,
        questionGeneratorChain: questionGenerator,
        //returnSourceDocuments: true,
    });
};
//# sourceMappingURL=makechain.js.map