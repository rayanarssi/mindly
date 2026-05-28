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

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

const themeLabels = {
	stress: "Stress",
	focus: "Focus",
	motivation: "Motivation",
};

function ProfileHeader({ user, userProfile, onSignOut, dominantTheme }) {
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
				className="profile-avatar"
			/>
			<VStack align={{ base: "center", md: "start" }} gap={1}>
				<HStack gap={3}>
					<Text className="header-name">{userProfile?.name || "User"}</Text>
					{dominantTheme && (
						<Box className="dominant-theme-badge" bg={themeColors[dominantTheme]}>
							<Text className="dominant-theme-text">
								{themeLabels[dominantTheme]}
							</Text>
						</Box>
					)}
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
