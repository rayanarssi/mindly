import { Flex, HStack, Text, Badge, IconButton } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./profile.css";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

function VideoRow({ video, showHeart = true, showCreator = true, onToggleFavorite }) {
	return (
		<Link to={`/video/${video.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}>
			<Flex className="video-row">
				<HStack gap={3} overflow="hidden">
					{showHeart && (
						<IconButton
							aria-label="Favorite"
							variant="ghost"
							className="video-row-heart"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onToggleFavorite?.(video.id);
							}}
						>
							<FaHeart />
						</IconButton>
					)}
					<Text className="video-row-title">
						{video.title}
					</Text>
				</HStack>
				<HStack gap={3} flexShrink={0} ml={4}>
					{video.theme && (
						<Badge
							bg={themeColors[video.theme] || "#dda15e"}
							className="video-row-badge"
						>
							{video.theme}
						</Badge>
					)}
				</HStack>
			</Flex>
		</Link>
	);
}

export default VideoRow;