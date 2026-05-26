import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/footer";
import CheckInFlow from "../components/CheckInFlow/CheckInFlow";
import {
	Box,
	Heading,
	Text,
	Button,
	Flex,
	SimpleGrid,
	Image,
	Container,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import bgHome from "../assets/Homepage/BG_Home.png";
import actionBrown from "../assets/Homepage/Action_brown.png";
import Book from "../assets/Homepage/Book_home.svg";
import Bulb from "../assets/Homepage/lightbulb_home.svg";
import Action from "../assets/Homepage/Action_home.svg";
import Beige from "../assets/Homepage/Beige_home.svg";
import StressPlay from "../assets/Homepage/Stress_play_home.svg";
import FocusPlay from "../assets/Homepage/Focus_play_home.svg";
import MotivationPlay from "../assets/Homepage/Motivation_play_home.svg";
import WhiteHome from "../assets/Homepage/White_home.svg";
import ClockHome from "../assets/Homepage/clock_home.svg";
import "../ui/home.css";
import { useVideosByTheme } from "../hooks/useVideos";
import { useVideoFavorites } from "../hooks/useVideoFavorites";
import { toaster } from "../library/toaster";
import { useAuth } from "../library/supabase/AuthContext";
import { supabase } from "../library/supabase/supabaseClient";

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

function Home() {
	const { videos, loading, error } = useVideosByTheme();
	const videoIds = videos.map((v) => v.id);
	const { favoritedVideos, toggleFavorite } = useVideoFavorites(videoIds);
	const { user, userProfile } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;

		const checkStatus = async () => {
			const { data } = await supabase
				.from("profiles")
				.select("role, status")
				.eq("id", user.id)
				.single();

			if (data?.role === "expert" && data?.status === 2) {
				navigate("/pending-approval");
			}
		};

		checkStatus();
	}, [user, navigate]);

	const showLoginToast = () => {
		toaster.create({
			title: "Login required",
			description: "You need to log in to add videos to favorites.",
			type: "warning",
		});
	};

	return (
		<Box>
			<CheckInFlow />
			<Box
				backgroundImage={`url(${bgHome})`}
				backgroundSize="cover"
				backgroundPosition="center"
				position="relative"
			>
				<Navbar />
				<Flex
					direction="column"
					justify="center"
					align="center"
					minH="calc(100vh - 80px)"
					px={4}
					textAlign="center"
				>
					<Heading className="home-heading">
						Learn and Share
						<Text className="home-subheading"> with Mindly</Text>
					</Heading>
					<Text className="home-text">
						Stress, distraction, and mental fog all have a cause. <br />
						Take a moment to understand what's behind it.
					</Text>
					<Flex gap={4} mt={4} flexWrap="wrap" justify="center">
						<Button className="home-button" as={Link} to="/videos" size="lg">
							Watch Videos
						</Button>
						<Button className="home-button2" as={Link} to="/forum" size="lg">
							Ask a Question
						</Button>
					</Flex>
				</Flex>
			</Box>

			<Box
				backgroundImage={`url(${actionBrown})`}
				py={120}
				backgroundRepeat={"no-repeat"}
				backgroundPosition="center"
				position="relative"
				mt="-200px"
				zIndex={2}
				maxWidth={1133}
				width="100%"
				marginInline="auto"
			>
				<Container maxW="70vw">
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
						<Flex
							direction="column"
							align="center"
							p={6}
							borderRadius="15px"
							border="3px solid"
							borderColor="#fefae0"
							textAlign="center"
						>
							<Image src={Book} alt="Book Icon" mb={4} />
							<Heading className="title_action" mb={4} color="#fefae0">
								Recognize your problem
							</Heading>
							<Text color="#fefae0">
								Feeling stressed, distracted, or unmotivated? Pick a theme.
							</Text>
						</Flex>

						<Flex
							direction="column"
							align="center"
							p={6}
							borderRadius="15px"
							border="3px solid"
							borderColor="#fefae0"
							textAlign="center"
						>
							<Image src={Bulb} alt="Bulb Icon" mb={4} />
							<Heading className="title_action">
								Understand what's happening
							</Heading>
							<Text color="#fefae0">
								Discover why stress happens, why focus is difficult, and how
								motivation works.
							</Text>
						</Flex>

						<Flex
							direction="column"
							align="center"
							p={6}
							borderRadius="15px"
							border="3px solid"
							borderColor="#fefae0"
							textAlign="center"
						>
							<Image src={Action} alt="Action Icon" mb={4} />
							<Heading className="title_action">
								Take action and ask your questions
							</Heading>
							<Text color="#fefae0">
								Expert advice. Anonymous questions. You're not alone.
							</Text>
						</Flex>
					</SimpleGrid>
				</Container>
			</Box>

			<Box
				minH="100vh"
				backgroundImage={`url(${Beige})`}
				backgroundSize="contain"
				backgroundPosition="center"
				position="relative"
				mt={-350}
				pt={400}
				pb={100}
				zIndex={1}
			>
				<Container maxW="90vw" mt={-10}>
					<Heading className="featured-videos-heading" maxW="90vw">
						Expert Insights, Made Simple.
					</Heading>
					<Flex justify="flex-end" mt={8} mb={8} pr={4}>
						<Button
							className="videos-button"
							as={Link}
							to="/videos"
							size="lg"
							fontSize="16px"
							color="#fefae0"
							borderRadius="10px"
							backgroundColor="#472c1b"
							_hover={{ backgroundColor: "#5a3a22" }}
						>
							View All Videos
						</Button>
					</Flex>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
						{loading ? (
							<Text>Loading videos...</Text>
						) : error ? (
							<Text color="red.500">Error loading videos</Text>
						) : (
							videos.map((video) => {
								const themeColor =
									themeColors[video.theme] || themeColors.stress;
								const ThemeIcon = themeIcons[video.theme] || themeIcons.stress;
								return (
									<Link
										to={`/video/${video.id}`}
										key={video.id}
										style={{ textDecoration: "none" }}
									>
										<Box
											bg="white"
											borderRadius="1vw"
											overflow="hidden"
											boxShadow="lg"
											position="relative"
											_hover={{ transform: "scale(1.02)", transition: "0.2s" }}
										>
											<Box
												className="video_thumbnail"
												bg={themeColor}
												position="relative"
												zIndex={0}
												h="250px"
												display="flex"
												alignItems="center"
												justifyContent="center"
											>
												<Box
													position="absolute"
													top={3}
													right={3}
													zIndex={3}
													cursor="pointer"
													onClick={async (e) => {
														e.preventDefault();
														e.stopPropagation();
														if (!user) {
															showLoginToast();
															return;
														}

														const result = await toggleFavorite(video.id);
														if (result?.action === "favorited") {
															toaster.create({
																title: "Success",
																description: "Video added to favorites",
																type: "success",
															});
														}
													}}
													color={
														favoritedVideos.has(video.id) ? "#fefae0" : "white"
													}
													fontSize="22px"
													filter={
														favoritedVideos.has(video.id)
															? "none"
															: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
													}
												>
													{favoritedVideos.has(video.id) ? (
														<FaHeart />
													) : (
														<FaRegHeart />
													)}
												</Box>
												<Box className="theme_icon" zIndex={1}>
													<Image src={ThemeIcon} alt="Play" w="80px" h="80px" />
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
													{video.video_time} min
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
													bg={themeColor}
													px={3}
													py={1}
													fontSize="sm"
													mb={2}
												>
													{video.theme.charAt(0).toUpperCase() +
														video.theme.slice(1)}
												</Box>
												<Text color="#472c1b" fontWeight="bold" mb={1}>
													{video.title}
												</Text>
												<Text color="#472c1b" fontSize="sm">
													{video.creator_name}
												</Text>
											</Box>
										</Box>
									</Link>
								);
							})
						)}
					</SimpleGrid>
				</Container>
			</Box>
			<Footer />
		</Box>
	);
}

export default Home;
