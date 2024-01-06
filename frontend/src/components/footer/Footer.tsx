import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
	return (
		<footer>
			<div
				style={{
					width: "100%",
					padding: 20,
					minHeight: "20vh",
					maxHeight: "30vh",
					marginTop: 50,
				}}
			>
				<p style={{ fontSize: "30px", textAlign: "center" }}>
					Built With Love by {""}
					<span>
						<Link style={{ color: "white"}} className="nav-link" to={"https://github.com/JerryZhou54"}>Wei Zhou💗</Link>
					</span>
					<span>
						<Link style={{ color: "white"}} className="nav-link" to={"https://github.com/JerryZhou54/AIChatBot"}><FaGithub/></Link>
					</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;