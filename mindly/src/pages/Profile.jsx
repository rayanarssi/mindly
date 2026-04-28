import { Box, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../library/supabase/AuthContext";
import { supabase } from "../library/supabase/supabaseClient";
import userAvatarIcon from "../assets/Login/user_icon_brown.svg";
import expertAvatarIcon from "../assets/Login/expert_icon_brown.svg";
import backArrow from "../assets/Login/back_arrow.svg";

	function Profile() {
	const navigate = useNavigate();
	const { user, userProfile, loading, signOut } = useAuth();

	const getAvatarIcon = () => {
		if (!userProfile) return userAvatarIcon;
		return userProfile.role === "expert" ? expertAvatarIcon : userAvatarIcon;
	};

	const handleSignOut = async () => {
		try {
			console.log("Sign out clicked");
			await signOut();
			console.log("Sign out completed");
		} catch (error) {
			console.error("Sign out failed:", error);
		}
	};

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user, navigate]);

	if (!user) {
		return null;
	}

	return (
		<Box className="profile-page" minH="100vh" bg="#fefae0" py={10}>
			<Box className="profile-container" maxW="600px" mx="auto" px={4}>
				<Box as="button" className="back-arrow" onClick={() => navigate("/")}>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>

				<VStack gap={6} mt={6}>
					<Box
						as="img"
						src={getAvatarIcon()}
						alt="Profile"
						w="100px"
						h="100px"
						borderRadius="full"
						border="3px solid #dda15e"
						bg="#fefae0"
						p={2}
					/>

					<Box textAlign="center">
						<Heading size="lg" color="#283618">
							{userProfile?.name || "User"}
						</Heading>
						<Text color="#606c38" fontSize="sm">
							{userProfile?.email || user.email}
						</Text>
						<Text color="#dda15e" fontSize="sm" textTransform="capitalize">
							{userProfile?.role || user?.user_metadata?.role || "user"}
						</Text>
					</Box>

					<Box
						as="button"
						onClick={handleSignOut}
						bg="#bc4749"
						color="white"
						px={8}
						py={3}
						borderRadius="10px"
						fontSize="16px"
						fontWeight="bold"
						cursor="pointer"
						w="200px"
						textAlign="center"
						_hover={{ bg: "#a33" }}
					>
						Log Out
					</Box>
				</VStack>
			</Box>
		</Box>
	);
}

export default Profile;
