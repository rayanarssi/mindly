import { Box, Flex, Button, Avatar, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../library/supabase/AuthContext";
import logoImg from "../../assets/Nav/Logo.svg";
import navbarBg from "../../assets/Nav/Navbar.svg";
import userAvatarIcon from "../../assets/Login/user_icon_brown.svg";
import expertAvatarIcon from "../../assets/Login/expert_icon_brown.svg";
import "../../ui/navbar.css";

function Navbar() {
	// const { user, userProfile, signOut } = useAuth();
	// const navigate = useNavigate();

	// const getAvatarIcon = () => {
	// 	if (!userProfile) return userAvatarIcon;
	// 	return userProfile.role === "expert" ? expertAvatarIcon : userAvatarIcon;
	// };

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

				{/* {user ? (
					<Flex align="center" gap={3} cursor="pointer">
						<Box
							as="img"
							src={getAvatarIcon()}
							alt="Profile"
							w="45px"
							h="45px"
							borderRadius="full"
							border="2px solid #fefae0"
							bg="#fefae0"
							p={1}
						/>
					</Flex>
				) : ( */}

				<Flex gap={3}>
					<Button className="admin-btn" as={Link} to="/admin">
						Admin
					</Button>
					<Button className="login-btn" as={Link} to="/login">
						Log in
					</Button>
				</Flex>
				{/* )} */}
			</Flex>
		</Box>
	);
}

export default Navbar;
