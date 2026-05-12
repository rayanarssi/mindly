import {
	Box,
	Flex,
	HStack,
	VStack,
	Text,
	Button,
	Spacer,
} from "@chakra-ui/react";
import userAvatarIcon from "../../assets/Login/user_icon_brown.svg";
import expertAvatarIcon from "../../assets/Login/expert_icon_brown.svg";
import "./profile.css";

function ProfileHeader({ user, userProfile, onSignOut }) {
	const getAvatarSrc = () => {
		if (!userProfile) return userAvatarIcon;
		return userProfile.role === "expert" ? expertAvatarIcon : userAvatarIcon;
	};

	return (
		<Flex
		className="profile-header"
			direction={{ base: "column", md: "row" }}
			align="center"
			gap={{ base: 4, md: 6 }}
			p={5}
		>
			<Box
				as="img"
				src={getAvatarSrc()}
				alt="Profile"
				w="80px"
				h="80px"
				borderRadius="full"
				bg="#fefae0"
				p={1.5}
			/>
			<VStack align={{ base: "center", md: "start" }} gap={1}>
				<HStack gap={3}>
					<Text className="header-name"  >
						{userProfile?.name || "User"}
					</Text>
				</HStack>
				<Text className="email-header">
					{userProfile?.email || user?.email}
				</Text>
			</VStack>
			<Spacer />
			<Button onClick={onSignOut} className="btn-logout">
				Log out
			</Button>
		</Flex>
	);
}

export default ProfileHeader;
