import { Box, Flex, HStack, Text, Badge } from "@chakra-ui/react";

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
		<Box
			p={5}
			bg="white"
			borderRadius="lg"
			boxShadow="sm"
			transition="all 0.2s"
			_hover={{ boxShadow: "md" }}
		>
			<Flex align="flex-start" justify="space-between" mb={2}>
				<Text fontWeight="bold" color="#283618" fontSize="md" noOfLines={1}>
					{title}
				</Text>
				{post.theme && (
					<Badge
						bg={themeColors[post.theme] || "#dda15e"}
						color="white"
						fontSize="xs"
						px={2}
						py={0.5}
						borderRadius="full"
						textTransform="capitalize"
						flexShrink={0}
						ml={3}
					>
						{post.theme}
					</Badge>
				)}
			</Flex>
			
		</Box>
	);
}

export default PostCard;
