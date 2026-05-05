import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/footer";
import {
	Box,
	Heading,
	Text,
	Flex,
	Image,
	Container,
	Spinner,
	SimpleGrid,
} from "@chakra-ui/react";
import brownForum from "../assets/Forum/brown_forum.svg";
import communityIcon from "../assets/Forum/community_icon.svg";
import stressForum from "../assets/Forum/stress_forum.svg";
import focusForum from "../assets/Forum/focus_forum.svg";
import motivationForum from "../assets/Forum/motivation_forum.svg";
import likeForum from "../assets/Forum/like_forum.svg";
import commentForum from "../assets/Forum/comment_forum.svg";
import { useForumPosts } from "../hooks/useForumPosts";
import "../ui/forum.css";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

function Forum() {
	const { posts, loading, error } = useForumPosts();

	return (
		<Box className="forum-page" bg="#fefae0" minH="100vh">
			<Navbar />

			<Box pt={16} pb={10}>
				<Container maxW="90vw">
					<Heading className="forum-heading">Forum</Heading>
					<Text className="forum-description" maxW="600px">
						Ask any questions that come to mind. <br /> You decide whether you
						want to ask them anonymously.
					</Text>
				</Container>
			</Box>

			<Box
				backgroundImage={`url(${brownForum})`}
				backgroundSize="cover"
				backgroundPosition="center"
				backgroundRepeat="no-repeat"
				py={38}
				position="relative"
			>
				<Container maxW="90vw">
					<Flex
						direction="row"
						align="center"
						justify="left"
						textAlign="left"
						gap={4}
					>
						<Image src={communityIcon} alt="Community Icon" w="20px" h="20px" />

						<Text
							className="community-guidelines-text"
							color="#fefae0"
							maxW="1000px"
						>
							Community guidelines: Be respectful to others. Do not share
							personal information. Help us keep this space safe and supportive for everyone.
						</Text>
					</Flex>
				</Container>
			</Box>

			<Container maxW="90vw" py={10}>
				{loading ? (
					<Flex justify="center" py={10}>
						<Spinner size="xl" color="#472c1b" />
					</Flex>
				) : error ? (
					<Text color="red.500" textAlign="center">
						Error loading posts: {error.message}
					</Text>
				) : posts.length === 0 ? (
					<Text textAlign="center" color="#472c1b" fontSize="lg" py={10}>
						No posts yet. Be the first to ask a question!
					</Text>
				) : (
					<SimpleGrid columns={2} gap={6}>
						{posts.map((post) => {
							const themeColor = themeColors[post.theme] || themeColors.stress;
							const ThemeIcon =
								post.theme === "stress"
									? stressForum
									: post.theme === "focus"
										? focusForum
										: post.theme === "motivation"
											? motivationForum
											: stressForum;
							return (
								<Box
									key={post.id}
									bg="#fefae0"
									borderRadius="12px"
									border="2px solid"
									borderColor={themeColor}
									boxShadow="lg"
									position="relative"
									minH="210px"
									>
									<Box p={4} position="relative">
										<Flex justify="space-between" align="flex-start" mb={3}>
											<Text className="forum-card-creator"  >
												{post.creator_name}
											</Text>
											<Box
												bg={themeColor}
												px={3}
												py={1}
												fontSize="xs"
												borderRadius="full"
												color="white"
												fontWeight="bold"
											>
												{post.theme
													? post.theme.charAt(0).toUpperCase() +
														post.theme.slice(1)
													: "General"}
											</Box>
										</Flex>

										<Text color="#472c1b" fontSize="md" mb={3}>
											{post.body}
										</Text>
									</Box>

									<Box position="relative">
										<Image src={ThemeIcon} alt="Theme" w="100%" h="auto" />
									</Box>

									<Box
										position="absolute"
										bottom={0}
										left={0}
										right={0}
										h="60px"
										bg={themeColor}
										borderBottomRadius="10px"
										px={4}
										display="flex"
										alignItems="center"
									>
										<Flex justify="space-between" align="center" w="100%">
											<Flex align="center" gap={2}>
												<Image src={likeForum} alt="Likes" w="16px" h="16px" />
												<Text color="white" fontSize="sm" fontWeight="bold">
													{post.likes_count || 0} likes
												</Text>
											</Flex>
											<Flex align="center" gap={2}>
												<Image
													src={commentForum}
													alt="Replies"
													w="16px"
													h="16px"
												/>
												<Text color="white" fontSize="sm" fontWeight="bold">
													{post.replies_count || 0} replies
												</Text>
											</Flex>
										</Flex>
									</Box>
								</Box>
							);
						})}
					</SimpleGrid>
				)}
			</Container>

			<Footer />
		</Box>
	);
}

export default Forum;
