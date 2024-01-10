import { Pinecone } from '@pinecone-database/pinecone';

export default async function initPinecone() {
  try {   
    const pinecone = new Pinecone({      
			environment: process.env.PINECONE_ENVIRONMENT,      
			apiKey: process.env.PINECONE_API_KEY,      
		});      
    
    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}