import axios from "axios";
export const loginUser = async (email: string, password: string) => {
	console.log(axios.defaults.baseURL);
	const res = await axios.post("/user/login", { email, password});
	if (res.status !== 200) {
		throw new Error("Unable to Login");
	}
	const data = await res.data;
	return data;
}

export const signupUser = async (name: string, email: string, password: string) => {
	const res = await axios.post("/user/signup", { name, email, password});
	if (res.status !== 201) {
		throw new Error("Unable to Signup");
	}
	const data = await res.data;
	return data;
}

export const checkAuthStatus = async () => {
	const res = await axios.get("/user/auth-status")
	if (res.status !== 200) {
		throw new Error("Unable to Authenticated");
	}
	const data = await res.data;
	return data;
}

export const getUserChats = async() => {
	const res = await axios.get("/chats/all-chats")
	if (res.status !== 200) {
		throw new Error("Unable to Authenticated");
	}
	const data = await res.data;
	return data;
}

export const sendChatRequest = async (message: string) => {
	const res = await axios.post("/chats/new", { "message": message });
	if (res.status !== 200) {
		throw new Error("Unable to send chat");
	}
	const data = await res.data;
	return data;
}

export const clearChatsRequest = async () => {
	const res = await axios.delete("/chats/clear");
	if (res.status !== 200) {
		throw new Error("Unable to clear chats");
	}
	const data = await res.data;
	return data;
}

export const clearFilesRequest = async() => {
	const res = await axios.delete("/chats/clear-files");
	if (res.status !== 200) {
		throw new Error("Unable to clear files");
	}
	const data = await res.data;
	return data;
}

export const logoutUser = async () => {
	const res = await axios.get("/user/logout");
	if (res.status !== 200) {
		throw new Error("Unable to log out");
	}
	const data = await res.data;
	return data;
}

export const uploadFileRequest = async (file: Blob) => {
	const files = new FormData();
  files.append('upload', file);
	const res = await axios.post("/chats/upload-file", files, {
    headers: {
      'Content-Type': 'application/pdf'
    }
	});
	if (res.status !== 200) {
		throw new Error("Unable to upload file");
	}
	const data = await res.data;
	return data;
}