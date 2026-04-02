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
import { Link } from "react-router";
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
import { useVideos } from "../hooks/useVideos";

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
	const { videos, loading, error } = useVideos(3);
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
					<Button className="home-button" as={Link} to="/videos" size="lg">
						Watch Videos
					</Button>
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
				backgroundSize="cover"
				backgroundPosition="center"
				position="relative"
				mt={-350}
				py={400}
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
									<Box
										key={video.id}
										bg="white"
										borderRadius="1vw"
										overflow="hidden"
										boxShadow="lg"
										position="relative"
									>
										<Box
											className="video_thumbnail"
											bg={themeColor}
											position="relative"
											zIndex={0}
										>
											<Image
												src={video.video_url}
												alt={video.title}
												w="100%"
												h="100%"
												objectFit="cover"
											/>
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
												<Image src={ClockHome} alt="Clock" w="18px" h="18px" />
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
