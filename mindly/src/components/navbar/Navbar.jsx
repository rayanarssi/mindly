import { Box, Flex, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/Nav/Logo.svg";
import navbarBg from "../../assets/Nav/Navbar.svg";
import "../../ui/navbar.css";

function Navbar() {
	return (
		<Box
			px={2}
			py={8}
			backgroundImage={`url(${navbarBg})`}
			backgroundSize="cover"
			backgroundPosition="center"
		>
			<Flex justify="space-between" align="center" maxW="1400px" mx="auto">
				<Box as="img" src={logoImg} alt="Mindly" h="50px" />

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
					<Button className="login-btn" as={Link} to="/login">
						Login
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
}

export default Navbar;
