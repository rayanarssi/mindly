import { Box, Flex, HStack, Text, Badge } from "@chakra-ui/react";
import "./profile.css";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

function PostCard({ post }) {
	const preview =
		post.body.length > 120 ? post.body.slice(0, 120) + "..." : post.body;

	const title =
		post.body.split("\n")[0] ||
		post.body.slice(0, 60) + (post.body.length > 60 ? "..." : "");

	return (
		<Box className="post-card">
			<Flex align="flex-start" justify="space-between" mb={2}>
				<Text className="post-card-title" noOfLines={1}>
					{title}
				</Text>
				{post.theme && (
					<Badge
						bg={themeColors[post.theme] || "#dda15e"}
						className="post-card-badge"
					>
						{post.theme}
					</Badge>
				)}
			</Flex>
		</Box>
	);
}

export default PostCard;