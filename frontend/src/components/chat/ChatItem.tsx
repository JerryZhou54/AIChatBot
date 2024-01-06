import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function extractCodeFromString(message: string) {
	return message.split("```").filter((e) => e != null);
}

const ChatItem = ({content,role}:{content:string;role:"user"|"assistant"}) => {
	const messageBlocks = extractCodeFromString(content);
	const auth = useAuth();
	return (
		role === "assistant" ? (
		<Box sx={{ display:"flex", p:2, bgcolor:"#004d5612", my:2, gap:2 }}>
			<Avatar sx={{ ml:"0" }}>
				<img src="openai.png" alt="openai" width={"30px"}/>
			</Avatar>
			<Box>
				{!messageBlocks && (
					<Typography sx={{ fontSize: "20px" }}>{content}</Typography>
				)}
				{messageBlocks &&
				 	messageBlocks.length &&
					messageBlocks.map((block, index) => 
						(index % 2 !== 0 ? (
							<SyntaxHighlighter style={coldarkDark} language={block.split("\n")[0]}>
								{block.substring(block.indexOf("\n") + 1)}
							</SyntaxHighlighter>
						) : (
							<Typography sx={{ fontSize: "20px" }}>{block}</Typography>
						))
					)
				}
			</Box>
		</Box>
		) : (
		<Box sx={{ display:"flex", p:2, bgcolor:"#004d56", gap:2 }}>
			<Avatar sx={{ ml:"0", bgcolor:"black", color:"white" }}>
				{auth?.user?.name.split(" ")[0][0]}
				{auth?.user?.name.split(" ")[1][0]}
			</Avatar>
			<Box>
				<Typography sx={{ fontSize: "20px" }}>{content}</Typography>
			</Box>
		</Box>
		)
	);
};

export default ChatItem;