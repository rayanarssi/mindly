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
	Button,
	Textarea,
} from "@chakra-ui/react";
import { supabase } from "../library/supabase/supabaseClient";
import brownForum from "../assets/Forum/brown_forum.svg";
import communityIcon from "../assets/Forum/community_icon.svg";
import stressForum from "../assets/Forum/stress_forum.svg";
import focusForum from "../assets/Forum/focus_forum.svg";
import motivationForum from "../assets/Forum/motivation_forum.svg";
import likeForum from "../assets/Forum/like_forum.svg";
import commentForum from "../assets/Forum/comment_forum.svg";
import reportForum from "../assets/Forum/report_forum.svg";
import userAvatarIcon from "../assets/Login/user_icon_brown.svg";
import expertAvatarIcon from "../assets/Login/expert_icon_brown.svg";
import { useForumPosts } from "../hooks/useForumPosts";
import { useLikes } from "../hooks/useLikes";
import { useReplies } from "../hooks/useReplies";
import { useReport } from "../hooks/useReport";
import { useAuth } from "../library/supabase/AuthContext";
import { useState } from "react";
import "../ui/forum.css";
import { toaster } from "../library/toaster";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

function Forum() {
	const { posts, loading, error, refetch } = useForumPosts();
	const { user } = useAuth();
	const postIds = posts.map((p) => p.id);
	const { userLikes, toggleLike } = useLikes(postIds);

	const [themeFilter, setThemeFilter] = useState("all");
	const [sortBy, setSortBy] = useState("most recent");
	const [askModalOpen, setAskModalOpen] = useState(false);
	const [newQuestion, setNewQuestion] = useState({ body: "", theme: "stress" });
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [replyModalOpen, setReplyModalOpen] = useState(false);
	const [replyBody, setReplyBody] = useState("");
	const [replyAnonymous, setReplyAnonymous] = useState(false);
	const [replySubmitting, setReplySubmitting] = useState(false);
	const {
		replies,
		loading: repliesLoading,
		addReply,
		fetchReplies,
	} = useReplies(selectedPost?.id);

	const { submitReport, submitting: reportSubmitting } = useReport();
	const [reportModalOpen, setReportModalOpen] = useState(false);
	const [selectedReportPost, setSelectedReportPost] = useState(null);
	const [reportReason, setReportReason] = useState("");
	const [reportDescription, setReportDescription] = useState("");

	const showLoginToast = (action) => {
		toaster.create({
			title: "Login required",
			description: `You need to log in to ${action}.`,
			type: "warning",
		});
	};

	const handleOpenReplyModal = (post) => {
		setSelectedPost(post);
		setReplyBody("");
		setReplyAnonymous(false);
		setReplyModalOpen(true);
		fetchReplies(post.id);
	};

	const handleAddReply = async (e) => {
		e.preventDefault();
		if (!replyBody.trim() || !user || replySubmitting) return;
		setReplySubmitting(true);
		const { error } = await addReply({
			body: replyBody,
			is_anonymous: replyAnonymous,
		});
		setReplySubmitting(false);
		if (!error) {
			setReplyBody("");
			setReplyAnonymous(false);
			setReplyModalOpen(false);
			refetch();
			toaster.create({
				title: "Success",
				description: "Reply successfully posted",
				type: "success",
			});
		}
	};

	const handleOpenReportModal = (post) => {
		setSelectedReportPost(post);
		setReportReason("");
		setReportDescription("");
		setReportModalOpen(true);
	};

	const handleSubmitReport = async (e) => {
		e.preventDefault();
		if (!reportReason || !user || reportSubmitting) return;
		const { error } = await submitReport({
			postId: selectedReportPost.id,
			reason: reportReason,
			description: reportDescription,
		});
		if (!error) {
			setReportModalOpen(false);
			setSelectedReportPost(null);
			toaster.create({
				title: "Report submitted",
				description: "Thank you for helping keep our community safe.",
				type: "success",
			});
		} else {
			toaster.create({
				title: "Error",
				description: "Failed to submit report. Please try again.",
				type: "error",
			});
		}
	};

	const filteredAndSortedPosts = posts
		.filter((post) => themeFilter === "all" || post.theme === themeFilter)
		.sort((a, b) => {
			if (sortBy === "most likes")
				return (b.likes_count || 0) - (a.likes_count || 0);
			if (sortBy === "most replies")
				return (b.replies_count || 0) - (a.replies_count || 0);
			return new Date(b.created_at) - new Date(a.created_at);
		});

	const handleAskQuestion = async (e) => {
		e.preventDefault();
		if (!newQuestion.body.trim() || !user) return;
		setSubmitting(true);
		try {
			const { error } = await supabase.from("posts").insert({
				user_id: user.id,
				body: newQuestion.body,
				theme: newQuestion.theme,
				is_anonymous: isAnonymous,
				likes_count: 0,
				replies_count: 0,
			});
			if (error) throw error;
			setAskModalOpen(false);
			setNewQuestion({ body: "", theme: "stress" });
			setIsAnonymous(false);
			refetch();
			toaster.create({
				title: "Success",
				description: "Post successfully posted",
				type: "success",
			});
		} catch (err) {
			console.error("Error posting question:", err);
		} finally {
			setSubmitting(false);
		}
	};

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
							personal information. Help us keep this space safe and supportive
							for everyone.
						</Text>
					</Flex>
				</Container>
			</Box>

			<Container maxW="90vw" py={6}>
				<Flex
					justify="space-between"
					align="center"
					mb={6}
					flexWrap="wrap"
					gap={4}
				>
					<Flex gap={4} flexWrap="wrap">
						<Box className="forum-filter-group">
							<select
								className="forum-select"
								value={themeFilter}
								onChange={(e) => setThemeFilter(e.target.value)}
							>
								<option value="all">All themes</option>
								<option value="stress">Stress</option>
								<option value="focus">Focus</option>
								<option value="motivation">Motivation</option>
							</select>
						</Box>
						<Box className="forum-filter-group">
							<select
								className="forum-select"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="most recent">Most recent</option>
								<option value="most likes">Most likes</option>
								<option value="most replies">Most replies</option>
							</select>
						</Box>
					</Flex>
					<Button
						bg="#472c1b"
						color="#fefae0"
						px={4}
						py={2}
						borderRadius="10px"
						fontWeight="bold"
						fontSize="md"
						onClick={() => {
							if (!user) {
								showLoginToast("ask a question");
								return;
							}
							setAskModalOpen(true);
						}}
					>
						+ Ask a question
					</Button>
				</Flex>

				{loading ? (
					<Flex justify="center" py={10}>
						<Spinner size="xl" color="#472c1b" />
					</Flex>
				) : error ? (
					<Text color="red.500" textAlign="center">
						Error loading posts: {error.message}
					</Text>
				) : filteredAndSortedPosts.length === 0 ? (
					<Text textAlign="center" color="#472c1b" fontSize="lg" py={10}>
						{themeFilter !== "all"
							? "No posts match this theme."
							: "No posts yet. Be the first to ask a question!"}
					</Text>
				) : (
					<SimpleGrid columns={2} gap={6}>
						{filteredAndSortedPosts.map((post) => {
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
											<Flex align="center" gap={2}>
												{post.creator_role && (
													<Image
														src={
															post.creator_role === "expert"
																? expertAvatarIcon
																: userAvatarIcon
														}
														alt={post.creator_role}
														w="24px"
														h="24px"
													/>
												)}
												<Text className="forum-card-creator">
													{post.creator_name}
												</Text>
											</Flex>
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
											<Flex
												align="center"
												gap={2}
												cursor="pointer"
												onClick={async () => {
													if (!user) {
														showLoginToast("like a post");
														return;
													}
													const result = await toggleLike(post.id);
													if (result?.action === "liked") {
														toaster.create({
															title: "Post liked",
															type: "success",
														});
													}
													refetch();
												}}
												_hover={user ? { opacity: 0.8 } : {}}
											>
												<Image
													src={likeForum}
													alt="Likes"
													w="16px"
													h="16px"
													filter={
														userLikes.has(post.id) ? "brightness(1.5)" : "none"
													}
												/>
												<Text color="white" fontSize="sm" fontWeight="bold">
													{post.likes_count || 0} likes
												</Text>
											</Flex>
											<Flex
												align="center"
												gap={2}
												cursor="pointer"
												onClick={() => {
													if (!user) {
														showLoginToast("report a post");
														return;
													}
													handleOpenReportModal(post);
												}}
												_hover={user ? { opacity: 0.8 } : {}}
											>
												<Image
													src={reportForum}
													alt="Report"
													w="16px"
													h="16px"
												/>
											</Flex>
											<Flex
												align="center"
												gap={2}
												cursor="pointer"
												onClick={() => {
													if (!user) {
														showLoginToast("reply to a post");
														return;
													}
													handleOpenReplyModal(post);
												}}
												_hover={user ? { opacity: 0.8 } : {}}
											>
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

			{askModalOpen && (
				<Box
					position="fixed"
					top="0"
					left="0"
					right="0"
					bottom="0"
					bg="rgba(0,0,0,0.5)"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex="9999"
				>
					<Box
						bg="#fefae0"
						p={6}
						borderRadius="12px"
						maxW="500px"
						width="90%"
						maxH="90vh"
						overflowY="auto"
					>
						<Flex justify="space-between" align="center" mb={4}>
							<Heading className="heading-ask-question" color="#472c1b">
								Ask a question
							</Heading>
							<Button
								className="close-panel-btn"
								size="sm"
								onClick={() => setAskModalOpen(false)}
							>
								✕
							</Button>
						</Flex>
						<form onSubmit={handleAskQuestion}>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "16px",
								}}
							>
								<div>
									<Text color="#472c1b" fontWeight="bold" mb={1}>
										Theme
									</Text>
									<select
										value={newQuestion.theme}
										onChange={(e) =>
											setNewQuestion({ ...newQuestion, theme: e.target.value })
										}
										style={{
											width: "100%",
											padding: "8px",
											borderRadius: "8px",
											border: "2px solid #472c1b",
											backgroundColor: "#fefae0",
											color: "#472c1b",
											fontWeight: "500",
											outline: "none",
										}}
									>
										<option value="stress">Stress</option>
										<option value="focus">Focus</option>
										<option value="motivation">Motivation</option>
									</select>
								</div>
								<div>
									<Text color="#472c1b" fontWeight="bold" mb={1}>
										Your question
									</Text>
									<Textarea
										placeholder="Type your question here..."
										value={newQuestion.body}
										onChange={(e) =>
											setNewQuestion({ ...newQuestion, body: e.target.value })
										}
										rows={4}
										border="2px solid #472c1b"
										borderRadius="8px"
										_focus={{ borderColor: "#472c1b" }}
										required
									/>
								</div>
								<Flex align="center" gap={3}>
									<Box
										as="button"
										type="button"
										w="44px"
										h="24px"
										borderRadius="full"
										bg={isAnonymous ? "#472c1b" : "gray.300"}
										position="relative"
										transition="background 0.2s"
										border="none"
										cursor="pointer"
										onClick={() => setIsAnonymous((prev) => !prev)}
										_focus={{ outline: "none" }}
										_hover={{ opacity: 0.8 }}
									>
										<Box
											w="20px"
											h="20px"
											borderRadius="full"
											bg="white"
											position="absolute"
											top="2px"
											left={isAnonymous ? "22px" : "2px"}
											transition="left 0.2s"
											boxShadow="sm"
										/>
									</Box>
									<Text
										color="#472c1b"
										fontWeight="medium"
										cursor="pointer"
										onClick={() => setIsAnonymous((prev) => !prev)}
									>
										Ask anonymously
									</Text>
								</Flex>
								<Button
									type="submit"
									bg="#472c1b"
									color="#fefae0"
									fontWeight="bold"
									py={2}
									borderRadius="8px"
									_hover={{ opacity: 0.9 }}
									disabled={submitting || !newQuestion.body.trim()}
								>
									{submitting ? "Posting..." : "Post question"}
								</Button>
							</div>
						</form>
					</Box>
				</Box>
			)}
			{replyModalOpen && selectedPost && (
				<Box
					position="fixed"
					top="0"
					left="0"
					right="0"
					bottom="0"
					bg="rgba(0,0,0,0.5)"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex="9999"
				>
					<Box
						bg="#fefae0"
						borderRadius="12px"
						maxW="600px"
						width="90%"
						maxH="85vh"
						overflowY="auto"
					>
						<Box p={6}>
							<Flex justify="space-between" align="center" mb={4}>
								<Heading fontSize="24px" color="#472c1b" fontWeight="bold">
									Post
								</Heading>
								<Button
									className="close-panel-btn"
									size="sm"
									onClick={() => setReplyModalOpen(false)}
								>
									✕
								</Button>
							</Flex>

							<Box
								border="2px solid"
								borderColor={
									themeColors[selectedPost.theme] || themeColors.stress
								}
								borderRadius="10px"
								p={4}
								mb={4}
							>
								<Flex justify="space-between" align="flex-start" mb={2}>
									<Flex align="center" gap={2}>
										{selectedPost.creator_role && (
											<Image
												src={
													selectedPost.creator_role === "expert"
														? expertAvatarIcon
														: userAvatarIcon
												}
												alt={selectedPost.creator_role}
												w="20px"
												h="20px"
											/>
										)}
										<Text fontWeight="bold" color="#472c1b" fontSize="md">
											{selectedPost.creator_name}
										</Text>
									</Flex>
									<Box
										bg={themeColors[selectedPost.theme] || themeColors.stress}
										px={3}
										py={1}
										fontSize="xs"
										borderRadius="full"
										color="white"
										fontWeight="bold"
									>
										{selectedPost.theme
											? selectedPost.theme.charAt(0).toUpperCase() +
												selectedPost.theme.slice(1)
											: "General"}
									</Box>
								</Flex>
								<Text color="#472c1b">{selectedPost.body}</Text>
							</Box>

							{repliesLoading ? (
								<Flex justify="center" py={4}>
									<Spinner size="md" color="#472c1b" />
								</Flex>
							) : replies.length === 0 ? (
								<Text color="#472c1b" textAlign="center" py={4} fontSize="sm">
									No replies yet. Be the first to reply!
								</Text>
							) : (
								<Box mb={4} maxH="300px" overflowY="auto">
									{replies.map((reply) => (
										<Box
											key={reply.id}
											borderBottom="1px solid"
											borderColor="#e0d5c1"
											py={3}
										>
											<Flex align="center" gap={2} mb={1}>
												<Image
													src={userAvatarIcon}
													alt="User"
													w="18px"
													h="18px"
												/>
												<Text fontWeight="bold" color="#472c1b" fontSize="sm">
													{reply.creator_name}
												</Text>
												<Text color="#8a7a6a" fontSize="xs">
													{new Date(reply.created_at).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
														},
													)}
												</Text>
											</Flex>
											<Text color="#472c1b" fontSize="sm" pl="26px">
												{reply.body}
											</Text>
										</Box>
									))}
								</Box>
							)}

							{user && (
								<form onSubmit={handleAddReply}>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "12px",
										}}
									>
										<Textarea
											placeholder="Write your reply..."
											value={replyBody}
											onChange={(e) => setReplyBody(e.target.value)}
											rows={3}
											border="2px solid #472c1b"
											borderRadius="8px"
											_focus={{ borderColor: "#472c1b" }}
											required
										/>
										<Flex align="center" gap={3}>
											<Box
												as="button"
												type="button"
												w="44px"
												h="24px"
												borderRadius="full"
												bg={replyAnonymous ? "#472c1b" : "gray.300"}
												position="relative"
												transition="background 0.2s"
												border="none"
												cursor="pointer"
												onClick={() => setReplyAnonymous((prev) => !prev)}
												_focus={{ outline: "none" }}
												_hover={{ opacity: 0.8 }}
											>
												<Box
													w="20px"
													h="20px"
													borderRadius="full"
													bg="white"
													position="absolute"
													top="2px"
													left={replyAnonymous ? "22px" : "2px"}
													transition="left 0.2s"
													boxShadow="sm"
												/>
											</Box>
											<Text
												color="#472c1b"
												fontWeight="medium"
												fontSize="sm"
												cursor="pointer"
												onClick={() => setReplyAnonymous((prev) => !prev)}
											>
												Reply anonymously
											</Text>
										</Flex>
										<Button
											type="submit"
											bg="#472c1b"
											color="#fefae0"
											fontWeight="bold"
											py={2}
											borderRadius="8px"
											_hover={{ opacity: 0.9 }}
											disabled={replySubmitting || !replyBody.trim()}
										>
											{replySubmitting ? "Sending..." : "Send reply"}
										</Button>
									</div>
								</form>
							)}

							{!user && (
								<Text color="#8a7a6a" textAlign="center" fontSize="sm">
									Log in to reply to this post.
								</Text>
							)}
						</Box>
					</Box>
				</Box>
			)}
			{reportModalOpen && selectedReportPost && (
				<Box
					position="fixed"
					top="0"
					left="0"
					right="0"
					bottom="0"
					bg="rgba(0,0,0,0.5)"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex="9999"
				>
					<Box
						bg="#fefae0"
						p={6}
						borderRadius="12px"
						maxW="500px"
						width="90%"
						maxH="90vh"
						overflowY="auto"
					>
						<Flex justify="space-between" align="center" mb={4}>
							<Heading fontSize="24px" color="#472c1b" fontWeight="bold">
								Report post
							</Heading>
							<Button
								className="close-panel-btn"
								size="sm"
								onClick={() => setReportModalOpen(false)}
							>
								✕
							</Button>
						</Flex>

						<Box
							border="2px solid"
							borderColor={
								themeColors[selectedReportPost.theme] || themeColors.stress
							}
							borderRadius="10px"
							p={4}
							mb={4}
						>
							<Flex justify="space-between" align="flex-start" mb={2}>
								<Flex align="center" gap={2}>
									<Text fontWeight="bold" color="#472c1b" fontSize="md">
										{selectedReportPost.creator_name}
									</Text>
								</Flex>
								<Box
									bg={
										themeColors[selectedReportPost.theme] || themeColors.stress
									}
									px={3}
									py={1}
									fontSize="xs"
									borderRadius="full"
									color="white"
									fontWeight="bold"
								>
									{selectedReportPost.theme
										? selectedReportPost.theme.charAt(0).toUpperCase() +
											selectedReportPost.theme.slice(1)
										: "General"}
								</Box>
							</Flex>
							<Text color="#472c1b">{selectedReportPost.body}</Text>
						</Box>

						<form onSubmit={handleSubmitReport}>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "16px",
								}}
							>
								<div>
									<Text color="#472c1b" fontWeight="bold" mb={1}>
										Reason for reporting
									</Text>
									<select
										value={reportReason}
										onChange={(e) => setReportReason(e.target.value)}
										required
										style={{
											width: "100%",
											padding: "8px",
											borderRadius: "8px",
											border: "2px solid #472c1b",
											backgroundColor: "#fefae0",
											color: "#472c1b",
											fontWeight: "500",
											outline: "none",
										}}
									>
										<option value="">Select a reason...</option>
										<option value="inappropriate_language">
											Inappropriate language
										</option>
										<option value="personal_information">
											Sharing personal information
										</option>
										<option value="harassment">Harassment or bullying</option>
										<option value="spam">Spam or misleading content</option>
										<option value="other">Other</option>
									</select>
								</div>
								<div>
									<Text color="#472c1b" fontWeight="bold" mb={1}>
										Additional details (optional)
									</Text>
									<Textarea
										placeholder="Provide any additional context..."
										value={reportDescription}
										onChange={(e) => setReportDescription(e.target.value)}
										rows={3}
										border="2px solid #472c1b"
										borderRadius="8px"
										_focus={{ borderColor: "#472c1b" }}
									/>
								</div>
								<Button
									type="submit"
									bg="#472c1b"
									color="#fefae0"
									fontWeight="bold"
									py={2}
									borderRadius="8px"
									_hover={{ opacity: 0.9 }}
									disabled={reportSubmitting || !reportReason}
								>
									{reportSubmitting ? "Submitting..." : "Submit report"}
								</Button>
							</div>
						</form>
					</Box>
				</Box>
			)}
			<Footer />
		</Box>
	);
}

export default Forum;
