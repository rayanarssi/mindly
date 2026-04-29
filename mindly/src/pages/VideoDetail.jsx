import {
	Box,
	Heading,
	Text,
	Flex,
	Image,
	Container,
	SimpleGrid,
	Spinner,
} from "@chakra-ui/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useVideo, useRelatedVideos } from "../hooks/useVideos";
import StressPlay from "../assets/Homepage/Stress_play_home.svg";
import FocusPlay from "../assets/Homepage/Focus_play_home.svg";
import MotivationPlay from "../assets/Homepage/Motivation_play_home.svg";
import ClockHome from "../assets/Homepage/clock_home.svg";
import WhiteHome from "../assets/Homepage/White_home.svg";
import backArrow from "../assets/Login/back_arrow.svg";
import "../ui/home.css";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

const themeIcons = {
	stress: StressPlay,
	focus: FocusPlay,
	motivation: MotivationPlay,
};

function VideoDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { video, loading, error } = useVideo(id);
	const { videos: relatedVideos, loading: relatedLoading } = useRelatedVideos(
		video?.theme,
		id,
		3,
	);

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="100vh"
			>
				<Spinner size="xl" />
			</Box>
		);
	}

	if (error || !video) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="100vh"
			>
				<Text color="red.500">Video not found</Text>
			</Box>
		);
	}

	const themeColor = themeColors[video.theme] || themeColors.stress;
	const ThemeIcon = themeIcons[video.theme] || themeIcons.stress;

	return (
		<Box>
			<Box
				minH="100vh"
				backgroundColor="#fefae0"
				backgroundSize="cover"
				backgroundPosition="center"
				pt={120}
				pb={12}
			>
				<Container maxW="90vw">
					<Box
						as="button"
						className="back-arrow"
						onClick={() => navigate("/videos")}
					>
						<Box as="img" src={backArrow} alt="Back" />
					</Box>
					<Flex
						gap={8}
						align="flex-start"
						direction={{ base: "column", md: "row" }}
					>
						<Box flex="1" maxW="700px">
							<Box bg={themeColor} borderRadius="1vw" overflow="hidden" mb={3}>
								<video
									controls
									style={{ width: "100%", height: "400px", objectFit: "cover" }}
								>
									<source src={video.video_url} type="video/mp4" />
									<source src={video.video_url} type="video/webm" />
									Your browser does not support the video tag.
								</video>
							</Box>
							<Box mt={-1} p={4}>
								<Flex justify="space-between" align="center" mb={2}>
									<Heading className="videodetail-title" color="#472c1b">
										{video.title}
									</Heading>
									<Box
										className="theme_videos"
										bg={themeColor}
										px={3}
										py={1}
										fontSize="sm"
										display="inline-block"
									>
										{video.theme.charAt(0).toUpperCase() + video.theme.slice(1)}
									</Box>
								</Flex>
								<Text className="video-creator" color="#472c1b" mb={2}>
									{video.creator_name}
								</Text>
							</Box>
						</Box>

						<Box w={{ base: "100%", md: "600px" }}>
							<Box className="about-video">
								<Heading className="description-video">Description</Heading>
								<Text color="#472c1b">
									{video.description || "No description available."}
								</Text>
							</Box>
						</Box>
					</Flex>

					<Box mt={12}>
						<Heading className="related-videos">Related videos</Heading>
						{relatedLoading ? (
							<Spinner />
						) : (
							<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
								{relatedVideos.map((relVideo) => {
									const relThemeColor =
										themeColors[relVideo.theme] || themeColors.stress;
									const RelThemeIcon =
										themeIcons[relVideo.theme] || themeIcons.stress;
									return (
										<Link
											to={`/video/${relVideo.id}`}
											key={relVideo.id}
											style={{ textDecoration: "none" }}
										>
											<Box
												bg="white"
												borderRadius="1vw"
												overflow="hidden"
												boxShadow="lg"
												position="relative"
												_hover={{
													transform: "scale(1.02)",
													transition: "0.2s",
												}}
											>
												<Box
													className="video_thumbnail"
													bg={relThemeColor}
													position="relative"
													zIndex={0}
													h="250px"
													display="flex"
													alignItems="center"
													justifyContent="center"
												>
													<Box className="theme_icon" zIndex={1}>
														<Image
															src={RelThemeIcon}
															alt="Play"
															w="80px"
															h="80px"
														/>
													</Box>
													<Box
														className="video_minute"
														zIndex={2}
														display="flex"
														alignItems="center"
														gap={1}
													>
														<Image
															src={ClockHome}
															alt="Clock"
															w="18px"
															h="18px"
														/>
														{relVideo.video_time} min
													</Box>
													<Box
														position="absolute"
														bottom={-4}
														left={0}
														right={0}
														display="flex"
														justifyContent="center"
														zIndex={1}
													>
														<Image
															src={WhiteHome}
															alt="White Home"
															w="100%"
															maxW="425px"
															h="80px"
															mb={-55}
														/>
													</Box>
												</Box>
												<Box p={5} position="relative" zIndex={2}>
													<Box
														className="theme_videos"
														bg={relThemeColor}
														px={3}
														py={1}
														fontSize="sm"
														mb={2}
													>
														{relVideo.theme.charAt(0).toUpperCase() +
															relVideo.theme.slice(1)}
													</Box>
													<Text color="#472c1b" fontWeight="bold" mb={1}>
														{relVideo.title}
													</Text>
													<Text color="#472c1b" fontSize="sm">
														{relVideo.creator_name}
													</Text>
												</Box>
											</Box>
										</Link>
									);
								})}
							</SimpleGrid>
						)}
					</Box>
				</Container>
			</Box>
		</Box>
	);
}

export default VideoDetail;
