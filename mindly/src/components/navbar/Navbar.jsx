import { Box, Flex, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/Nav/Logo.svg";
import navbarBg from "../../assets/Nav/Navbar.svg";
import "../../ui/navbar.css";

function Navbar() {
	return (
		<Box
			py={10}
			backgroundImage={`url(${navbarBg})`}
			backgroundSize="cover"
			backgroundPosition="center"
		>
			<Flex justify="space-between" align="center" maxW="90vw" mx="auto">
				<Box as={Link} to="/">
					<Box as="img" src={logoImg} alt="Mindly" h="40px" />
				</Box>

				<Flex gap={4} align="center">
					<Button className="nav-button" as={Link} to="/">
						Home
					</Button>
					<Button className="nav-button" as={Link} to="/videos">
						Videos
					</Button>
					<Button className="nav-button" as={Link} to="/forum">
						Forum
					</Button>
				</Flex>

				<Flex gap={3}>
					<Button className="admin-btn" as={Link} to="/admin">
						Admin
					</Button>
					<Button className="nav-button" as={Link} to="/login">
						Log in
					</Button>
					
				</Flex>
			</Flex>
		</Box>
	);
}

export default Navbar;
