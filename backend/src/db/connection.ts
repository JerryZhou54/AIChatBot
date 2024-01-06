import {connect, disconnect} from "mongoose";
export async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
    throw new Error("Cannot connect to MongoDB");
  }
}

export async function disconnectFromBase() {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Cannot disconnect from MongoDB");
  }
}