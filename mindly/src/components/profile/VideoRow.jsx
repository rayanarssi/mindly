import { Flex, HStack, Text, Badge, IconButton } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

function VideoRow({ video, showHeart = true, showCreator = true }) {
	return (
		<Flex
			align="center"
			justify="space-between"
			p={4}
			bg="white"
			borderRadius="lg"
			boxShadow="sm"
			transition="all 0.2s"
			_hover={{ boxShadow: "md" }}
		>
			<HStack gap={3} overflow="hidden">
				{showHeart && (
					<IconButton
						aria-label="Favorite"
						variant="ghost"
						color="#bc4749"
						fontSize="lg"
						minW="auto"
						h="auto"
						p={1}
					>
						<FaHeart />
					</IconButton>
				)}
				<Text fontWeight="semibold" color="#283618" noOfLines={1}>
					{video.title}
				</Text>
			</HStack>
			<HStack gap={3} flexShrink={0} ml={4}>
				{video.theme && (
					<Badge
						bg={themeColors[video.theme] || "#dda15e"}
						color="white"
						fontSize="xs"
						px={2}
						py={0.5}
						borderRadius="full"
						textTransform="capitalize"
					>
						{video.theme}
					</Badge>
				)}
				{showCreator && (
					<Text fontSize="sm" color="gray.500">
						{video.creator_name || "Unknown"}
					</Text>
				)}
			</HStack>
		</Flex>
	);
}

export default VideoRow;
